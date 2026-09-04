import { prisma } from "@/lib/db";
import { getDefaultAgent } from "@/lib/agents/service";

export async function getDemoWorkspace() {
  return prisma.workspace.findFirst({
    where: { slug: "maycode-demo" },
    include: { settings: true },
  });
}

export async function createInboundConversation(opts: {
  channel: string;
  contactName: string;
  contactHandle?: string;
  subject?: string;
  body: string;
}) {
  const workspace = await getDemoWorkspace();
  if (!workspace) throw new Error("Workspace demo no encontrado");
  const agent = await getDefaultAgent(workspace.id);

  const conversation = await prisma.conversation.create({
    data: {
      workspaceId: workspace.id,
      agentId: agent?.id,
      channel: opts.channel,
      status: "open",
      subject: opts.subject,
      contactName: opts.contactName,
      contactHandle: opts.contactHandle,
      lastMessageAt: new Date(),
      messages: {
        create: {
          body: opts.body,
          senderType: "contact",
          senderName: opts.contactName,
        },
      },
    },
    include: { messages: true },
  });

  return conversation;
}
