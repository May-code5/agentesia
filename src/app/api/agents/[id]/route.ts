import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteAgent, getAgent, updateAgent } from "@/lib/agents/service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const agent = await getAgent(id, session.workspaceId);
  if (!agent) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const agent = await updateAgent(id, session.workspaceId, {
    name: body.name !== undefined ? String(body.name) : undefined,
    systemPrompt: body.systemPrompt !== undefined ? String(body.systemPrompt) : undefined,
    tone: body.tone !== undefined ? String(body.tone) : undefined,
    knowledgeMd: body.knowledgeMd !== undefined ? String(body.knowledgeMd) : undefined,
    enabledChannels: body.enabledChannels !== undefined ? String(body.enabledChannels) : undefined,
    handoffRules: body.handoffRules !== undefined ? String(body.handoffRules) : undefined,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
  });
  if (!agent) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const agent = await deleteAgent(id, session.workspaceId);
  if (!agent) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
