import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAgent, listAgents } from "@/lib/agents/service";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const agents = await listAgents(session.workspaceId);
  return NextResponse.json({ agents });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.systemPrompt) {
    return NextResponse.json({ error: "Nombre y system prompt requeridos" }, { status: 400 });
  }
  const agent = await createAgent(session.workspaceId, {
    name: String(body.name),
    systemPrompt: String(body.systemPrompt),
    tone: body.tone ? String(body.tone) : undefined,
    knowledgeMd: body.knowledgeMd ? String(body.knowledgeMd) : undefined,
    enabledChannels: body.enabledChannels ? String(body.enabledChannels) : undefined,
    handoffRules: body.handoffRules ? String(body.handoffRules) : undefined,
    isActive: body.isActive !== false,
  });
  return NextResponse.json({ agent }, { status: 201 });
}
