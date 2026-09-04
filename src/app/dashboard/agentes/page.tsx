import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listAgents } from "@/lib/agents/service";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteAgentButton } from "./delete-button";

export default async function AgentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const agents = await listAgents(session.workspaceId);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Agentes IA</h1>
          <p className="text-sm text-slate-500">Configura prompts, tono, FAQ y canales.</p>
        </div>
        <Link href="/dashboard/agentes/nuevo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nuevo agente
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900">{a.name}</div>
                <div className="mt-1 text-xs capitalize text-slate-500">Tono: {a.tone}</div>
              </div>
              <Badge className={a.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}>
                {a.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </CardHeader>
            <CardBody>
              <p className="line-clamp-3 text-sm text-slate-600">{a.systemPrompt}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {a.enabledChannels.split(",").filter(Boolean).map((c) => (
                  <Badge key={c} className="border-slate-200 bg-slate-50 text-slate-600">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/dashboard/agentes/${a.id}`}>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </Link>
                <DeleteAgentButton id={a.id} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
