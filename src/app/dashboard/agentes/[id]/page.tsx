import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAgent } from "@/lib/agents/service";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { AgentForm } from "@/components/agents/agent-form";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const agent = await getAgent(id, session.workspaceId);
  if (!agent) notFound();

  return (
    <div className="h-full overflow-y-auto p-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <h1 className="text-lg font-semibold">Editar agente</h1>
          <p className="text-sm text-slate-500">{agent.name}</p>
        </CardHeader>
        <CardBody>
          <AgentForm
            initial={{
              id: agent.id,
              name: agent.name,
              systemPrompt: agent.systemPrompt,
              tone: agent.tone,
              knowledgeMd: agent.knowledgeMd,
              enabledChannels: agent.enabledChannels,
              handoffRules: agent.handoffRules,
              isActive: agent.isActive,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
