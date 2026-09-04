import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, workspaceId: session.workspaceId },
  });
  if (!conversation) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const text = String(body.body || "").trim();
  if (!text) return NextResponse.json({ error: "Mensaje vacio" }, { status: 400 });

  const senderType = body.senderType === "ai" ? "ai" : "human";
  const message = await prisma.message.create({
    data: {
      conversationId: id,
      body: text,
      senderType,
      senderName: senderType === "human" ? session.name : body.senderName || "Luna",
    },
  });
  await prisma.conversation.update({
    where: { id },
    data: { lastMessageAt: new Date(), status: conversation.status === "closed" ? "open" : conversation.status },
  });

  return NextResponse.json({ message });
}
