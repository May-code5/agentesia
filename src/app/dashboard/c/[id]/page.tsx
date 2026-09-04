import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ThreadClient } from "./thread-client";

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ channel?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const sp = await searchParams;
  const channel = sp.channel && sp.channel !== "ALL" ? sp.channel : undefined;

  const conversations = await prisma.conversation.findMany({
    where: {
      workspaceId: session.workspaceId,
      ...(channel ? { channel } : {}),
    },
    orderBy: { lastMessageAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const conversation = await prisma.conversation.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) notFound();

  const items = conversations.map((c) => ({
    id: c.id,
    channel: c.channel,
    contactName: c.contactName,
    contactHandle: c.contactHandle,
    subject: c.subject,
    status: c.status,
    lastMessageAt: c.lastMessageAt.toISOString(),
    preview: c.messages[0]?.body ?? null,
  }));

  return (
    <ThreadClient
      items={items}
      channelFilter={channel || "ALL"}
      conversation={{
        id: conversation.id,
        channel: conversation.channel,
        contactName: conversation.contactName,
        contactHandle: conversation.contactHandle,
        subject: conversation.subject,
        status: conversation.status,
      }}
      messages={conversation.messages.map((m) => ({
        id: m.id,
        body: m.body,
        senderType: m.senderType,
        senderName: m.senderName,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
