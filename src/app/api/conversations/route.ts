import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");
  const conversations = await prisma.conversation.findMany({
    where: {
      workspaceId: session.workspaceId,
      ...(channel && channel !== "ALL" ? { channel } : {}),
    },
    orderBy: { lastMessageAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return NextResponse.json({ conversations });
}
