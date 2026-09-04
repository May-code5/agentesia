import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { AgentForm } from "@/components/agents/agent-form";

export default function NewAgentPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <h1 className="text-lg font-semibold">Nuevo agente IA</h1>
          <p className="text-sm text-slate-500">Define identidad, conocimiento y handoff.</p>
        </CardHeader>
        <CardBody>
          <AgentForm />
        </CardBody>
      </Card>
    </div>
  );
}
