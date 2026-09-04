import { NextResponse } from "next/server";
import { loginWithCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email y contrasena requeridos" }, { status: 400 });
  }
  const session = await loginWithCredentials(email, password);
  if (!session) {
    return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: session });
}
