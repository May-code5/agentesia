import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { InboxClient } from "./inbox-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const sp = await searchParams;
  const channel = sp.channel && sp.channel !== "ALL" ? sp.channel : undefined;

  const conversations = await prisma.conversation.findMany({
    where: {
      workspaceId: session.workspaceId,
      ...(channel ? { channel } : {}),
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

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

  return <InboxClient items={items} channelFilter={channel || "ALL"} />;
}
