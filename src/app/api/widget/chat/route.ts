import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDemoWorkspace, createInboundConversation } from "@/lib/channels/webhooks";
import { getDefaultAgent } from "@/lib/agents/service";
import { generateReply, type AiMessage } from "@/lib/ai/reply";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim();
  const sessionId = String(body.sessionId || `web-${Date.now()}`);
  if (!message) return NextResponse.json({ error: "Mensaje vacio" }, { status: 400 });

  const workspace = await getDemoWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Workspace demo no encontrado. Corre db:seed." }, { status: 500 });
  }

  const agent = await getDefaultAgent(workspace.id);
  let conversation = await prisma.conversation.findFirst({
    where: {
      workspaceId: workspace.id,
      channel: "WEB",
      contactHandle: sessionId,
      status: { in: ["open", "pending"] },
    },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
  });

  if (!conversation) {
    conversation = await createInboundConversation({
      channel: "WEB",
      contactName: "Visitante Web",
      contactHandle: sessionId,
      subject: "Chat widget",
      body: message,
    });
    conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversation.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  } else {
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        body: message,
        senderType: "contact",
        senderName: "Visitante Web",
      },
    });
  }

  const history: AiMessage[] = (conversation.messages || [])
    .filter((m) => m.body !== message)
    .map((m) => ({
      role: m.senderType === "contact" ? "user" : "assistant",
      content: m.body,
    }));

  const result = await generateReply({
    systemPrompt: agent?.systemPrompt || "Eres Luna, asistente de MAY-CODE. Responde en espanol.",
    knowledgeMd: agent?.knowledgeMd,
    history,
    userMessage: message,
    agentName: agent?.name || "Luna",
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      body: result.text,
      senderType: "ai",
      senderName: agent?.name || "Luna",
      metadata: JSON.stringify({ mode: result.mode }),
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date(), agentId: agent?.id },
  });

  return NextResponse.json({
    reply: result.text,
    mode: result.mode,
    conversationId: conversation.id,
  });
}
