"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsForm({
  initial,
}: {
  initial: { name: string; businessName: string; timezone: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [businessName, setBusinessName] = useState(initial.businessName);
  const [timezone, setTimezone] = useState(initial.timezone);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, businessName, timezone }),
    });
    setSaving(false);
    if (!res.ok) {
      setMsg("No se pudo guardar");
      return;
    }
    setMsg("Guardado");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Nombre del workspace</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Nombre comercial</span>
        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Zona horaria</span>
        <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="America/Lima" />
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar ajustes"}
        </Button>
        {msg && <span className="text-sm text-emerald-600">{msg}</span>}
      </div>
    </form>
  );
}
