"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@maycode.pe");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Credenciales invalidas");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function demo() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (!res.ok) throw new Error("No se pudo iniciar el demo");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luna-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Luna Desk</div>
              <div className="text-xs text-slate-500">by MAY-CODE</div>
            </div>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <h1 className="text-lg font-semibold">Iniciar sesion</h1>
            <p className="text-sm text-slate-500">Demo: admin@maycode.pe / demo1234</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={login} className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Email</span>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Contrasena</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              o
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <Button type="button" variant="secondary" className="w-full" onClick={demo} disabled={loading}>
              Entrar al demo
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
