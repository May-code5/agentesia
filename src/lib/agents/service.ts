import { prisma } from "@/lib/db";

export async function listAgents(workspaceId: string) {
  return prisma.agent.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAgent(id: string, workspaceId: string) {
  return prisma.agent.findFirst({ where: { id, workspaceId } });
}

export async function createAgent(
  workspaceId: string,
  data: {
    name: string;
    systemPrompt: string;
    tone?: string;
    knowledgeMd?: string;
    enabledChannels?: string;
    handoffRules?: string;
    isActive?: boolean;
  }
) {
  return prisma.agent.create({
    data: {
      workspaceId,
      name: data.name,
      systemPrompt: data.systemPrompt,
      tone: data.tone ?? "amigable",
      knowledgeMd: data.knowledgeMd ?? "",
      enabledChannels: data.enabledChannels ?? "WEB,WHATSAPP,INSTAGRAM,EMAIL,VOICE",
      handoffRules: data.handoffRules ?? "",
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateAgent(
  id: string,
  workspaceId: string,
  data: Partial<{
    name: string;
    systemPrompt: string;
    tone: string;
    knowledgeMd: string;
    enabledChannels: string;
    handoffRules: string;
    isActive: boolean;
  }>
) {
  const existing = await getAgent(id, workspaceId);
  if (!existing) return null;
  return prisma.agent.update({ where: { id }, data });
}

export async function deleteAgent(id: string, workspaceId: string) {
  const existing = await getAgent(id, workspaceId);
  if (!existing) return null;
  await prisma.agent.delete({ where: { id } });
  return existing;
}

export async function getDefaultAgent(workspaceId: string) {
  return prisma.agent.findFirst({
    where: { workspaceId, isActive: true },
    orderBy: { createdAt: "asc" },
  });
}
