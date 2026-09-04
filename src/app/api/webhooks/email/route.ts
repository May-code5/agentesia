import { NextResponse } from "next/server";
import { createInboundConversation } from "@/lib/channels/webhooks";

export async function GET() {
  return NextResponse.json({ ok: true, channel: "EMAIL", hint: "POST inbound email payload" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.html || body.body || body.message || "[Email] Mensaje entrante (stub)";
  const contactName = body.from_name || body.contactName || "Remitente Email";
  const contactHandle = body.from || body.email || body.contactHandle || "cliente@ejemplo.pe";
  const subject = body.subject || "Email entrante";

  const conversation = await createInboundConversation({
    channel: "EMAIL",
    contactName: String(contactName),
    contactHandle: String(contactHandle),
    subject: String(subject),
    body: String(text),
  });

  return NextResponse.json({ ok: true, conversationId: conversation.id, channel: "EMAIL" });
}
