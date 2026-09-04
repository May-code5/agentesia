"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CHANNELS = ["WEB", "WHATSAPP", "INSTAGRAM", "EMAIL", "VOICE"] as const;
const TONES = ["amigable", "formal", "entusiasta", "conciso"] as const;

export type AgentFormValues = {
  id?: string;
  name: string;
  systemPrompt: string;
  tone: string;
  knowledgeMd: string;
  enabledChannels: string;
  handoffRules: string;
  isActive: boolean;
};

export function AgentForm({ initial }: { initial?: AgentFormValues }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(initial?.name ?? "");
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt ?? "");
  const [tone, setTone] = useState(initial?.tone ?? "amigable");
  const [knowledgeMd, setKnowledgeMd] = useState(initial?.knowledgeMd ?? "");
  const [handoffRules, setHandoffRules] = useState(initial?.handoffRules ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [channels, setChannels] = useState<string[]>(
    (initial?.enabledChannels || "WEB,WHATSAPP,INSTAGRAM,EMAIL,VOICE").split(",").filter(Boolean)
  );

  function toggleChannel(c: string) {
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name,
      systemPrompt,
      tone,
      knowledgeMd,
      handoffRules,
      isActive,
      enabledChannels: channels.join(","),
    };
    try {
      const url = initial?.id ? `/api/agents/${initial.id}` : "/api/agents";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo guardar");
      }
      router.push("/dashboard/agentes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Nombre</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Luna" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Tono</span>
          <select
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">System prompt</span>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          required
          rows={5}
          placeholder="Eres Luna, asistente de..."
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">FAQ / Knowledge (Markdown)</span>
        <Textarea
          value={knowledgeMd}
          onChange={(e) => setKnowledgeMd(e.target.value)}
          rows={8}
          placeholder="# FAQ..."
        />
      </label>

      <div className="space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Canales habilitados</span>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleChannel(c)}
              className={
                channels.includes(c)
                  ? "rounded-full bg-luna-600 px-3 py-1 text-xs font-medium text-white"
                  : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Reglas de handoff</span>
        <Textarea
          value={handoffRules}
          onChange={(e) => setHandoffRules(e.target.value)}
          rows={3}
          placeholder="Transferir si el cliente pide un humano..."
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Agente activo
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : initial?.id ? "Actualizar agente" : "Crear agente"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/agentes")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
