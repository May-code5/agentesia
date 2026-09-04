import { NextResponse } from "next/server";
import { createInboundConversation } from "@/lib/channels/webhooks";

export async function GET() {
  return NextResponse.json({ ok: true, channel: "VOICE", hint: "POST call event stub" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const summary =
    body.summary ||
    body.transcript ||
    body.message ||
    "[Llamada] Evento de voz entrante (stub)";
  const contactName = body.contactName || body.caller_name || "Llamada entrante";
  const contactHandle = body.from || body.phone || body.contactHandle || "+51 900 000 001";

  const conversation = await createInboundConversation({
    channel: "VOICE",
    contactName: String(contactName),
    contactHandle: String(contactHandle),
    subject: body.subject || "Llamada entrante",
    body: String(summary),
  });

  return NextResponse.json({ ok: true, conversationId: conversation.id, channel: "VOICE" });
}
