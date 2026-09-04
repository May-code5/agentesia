import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, Layers, Shield, Sparkles, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Inbox unificado",
    desc: "WhatsApp, Instagram, Web, Email y Llamadas en un solo lugar.",
  },
  {
    icon: Bot,
    title: "Agentes IA configurables",
    desc: "System prompt, tono, FAQ y reglas de handoff por agente.",
  },
  {
    icon: MessageSquare,
    title: "Widget web listo",
    desc: "Embed demo con respuestas IA o modo mock en espanol.",
  },
  {
    icon: Shield,
    title: "Multi-tenant",
    desc: "Modelo de workspace listo para white-label a clientes MAY-CODE.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-luna-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Luna Desk</div>
            <div className="text-[11px] text-slate-400">by MAY-CODE</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white">
            Iniciar sesion
          </Link>
          <Link href="/login">
            <Button size="sm">Entrar al demo</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Hecho en Lima · maycodestudio.com
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Atencion al cliente multicanal con IA, lista para tu marca.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Luna Desk concentra conversaciones de WhatsApp, Instagram, Web, Email y Llamadas.
            Los agentes IA responden 24/7 y transfieren a humanos cuando hace falta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Probar el demo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/widget">
              <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Ver widget web
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <Icon className="mb-3 h-5 w-5 text-luna-300" />
                <div className="font-medium">{f.title}</div>
                <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-luna-600/20 to-brand-600/10 p-8">
          <h2 className="text-2xl font-semibold">White-label para clientes MAY-CODE</h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            Adapta branding, workspace y webhooks por cliente. Ideal como producto propio o
            como capa de atencion IA dentro de proyectos a medida.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MAY-CODE Studio · Luna Desk MVP
      </footer>
    </div>
  );
}
