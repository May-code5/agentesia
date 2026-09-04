import { NextResponse } from "next/server";
import { createInboundConversation } from "@/lib/channels/webhooks";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "luna-desk-verify";

/** Meta webhook verification */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/** Inbound stub — creates conversation from WhatsApp-like payload */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Meta-style or simplified stub
  const entry = body.entry?.[0]?.changes?.[0]?.value;
  const msg = entry?.messages?.[0];
  const contact = entry?.contacts?.[0];

  const text =
    msg?.text?.body ||
    body.text ||
    body.message ||
    "[WhatsApp] Mensaje entrante (stub)";
  const contactName =
    contact?.profile?.name || body.contactName || body.from_name || "Contacto WhatsApp";
  const contactHandle =
    msg?.from || body.from || body.contactHandle || "+51 900 000 000";

  const conversation = await createInboundConversation({
    channel: "WHATSAPP",
    contactName: String(contactName),
    contactHandle: String(contactHandle),
    body: String(text),
  });

  return NextResponse.json({
    ok: true,
    conversationId: conversation.id,
    channel: "WHATSAPP",
  });
}
