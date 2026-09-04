import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
    include: { settings: true },
  });
  if (!workspace) redirect("/login");

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const webhooks = [
    { name: "WhatsApp", url: `${base}/api/webhooks/whatsapp` },
    { name: "Instagram", url: `${base}/api/webhooks/instagram` },
    { name: "Email", url: `${base}/api/webhooks/email` },
    { name: "Voice / Llamadas", url: `${base}/api/webhooks/voice` },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Ajustes</h1>
        <p className="text-sm text-slate-500">Workspace, zona horaria y conexiones.</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-5">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Negocio</h2>
          </CardHeader>
          <CardBody>
            <SettingsForm
              initial={{
                name: workspace.name,
                businessName: workspace.businessName || "",
                timezone: workspace.timezone,
              }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">URLs de webhooks</h2>
            <p className="text-sm text-slate-500">
              Configura estos endpoints en Meta u otros proveedores.
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {webhooks.map((w) => (
              <div key={w.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs font-medium text-slate-500">{w.name}</div>
                <code className="break-all text-sm text-slate-800">{w.url}</code>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">API keys (placeholders)</h2>
            <p className="text-sm text-slate-500">
              Configura las variables en el archivo .env del servidor. No se guardan en el navegador.
            </p>
          </CardHeader>
          <CardBody className="space-y-2 text-sm text-slate-600">
            <div>
              <code className="rounded bg-slate-100 px-1.5 py-0.5">OPENAI_API_KEY</code>{" "}
              {process.env.OPENAI_API_KEY ? "— configurada" : "— no configurada (modo mock)"}
            </div>
            <div>
              <code className="rounded bg-slate-100 px-1.5 py-0.5">ANTHROPIC_API_KEY</code>{" "}
              {process.env.ANTHROPIC_API_KEY ? "— configurada" : "— no configurada"}
            </div>
            <div>
              <code className="rounded bg-slate-100 px-1.5 py-0.5">DEMO_SECRET / NEXTAUTH_SECRET</code>{" "}
              — para firmar la sesion demo
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
