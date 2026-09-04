"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

type ChatMsg = { role: "user" | "assistant"; content: string; mode?: string };

export default function WidgetPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hola! Soy Luna de MAY-CODE. Como puedo ayudarte hoy?",
      mode: "mock",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `web-${Math.random().toString(36).slice(2, 10)}`);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userText }]);
    setLoading(true);
    try {
      const res = await fetch("/api/widget/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "No pude responder.", mode: data.mode },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Hubo un error de red. Intenta de nuevo.", mode: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luna-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Widget Luna Desk</div>
            <div className="text-[11px] text-slate-500">Embed demo · session {sessionId}</div>
          </div>
        </div>
        <Link href="/dashboard" className="text-sm text-luna-700 hover:underline">
          Ir al dashboard
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-luna-600 to-brand-600 px-4 py-3 text-white">
            <div className="font-medium">Chat con Luna</div>
            <div className="text-xs text-white/80">Respuestas IA o modo mock en espanol</div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-brand-600 px-3 py-2 text-sm text-white"
                      : "max-w-[80%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-800"
                  }
                >
                  {m.content}
                  {m.mode && m.role === "assistant" && (
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                      {m.mode}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400">Luna esta escribiendo...</div>}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <Button type="submit" disabled={loading || !input.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Para embeber: usa esta pagina en un iframe o integra{" "}
          <code className="rounded bg-white px-1">POST /api/widget/chat</code>
        </p>
      </div>
    </div>
  );
}
