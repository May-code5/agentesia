import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ conversation });
}
