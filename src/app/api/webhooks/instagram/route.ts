import { NextResponse } from "next/server";
import { createInboundConversation } from "@/lib/channels/webhooks";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get("hub.challenge");
  const token = searchParams.get("hub.verify_token");
  const mode = searchParams.get("hub.mode");
  const verify = process.env.INSTAGRAM_VERIFY_TOKEN || "luna-desk-verify";
  if (mode === "subscribe" && token === verify && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ ok: true, channel: "INSTAGRAM" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.message || body.entry?.[0]?.messaging?.[0]?.message?.text || "[Instagram] DM entrante (stub)";
  const contactName = body.contactName || body.username || body.sender?.username || "Contacto Instagram";
  const contactHandle = body.contactHandle || (body.username ? `@${body.username}` : "@usuario");

  const conversation = await createInboundConversation({
    channel: "INSTAGRAM",
    contactName: String(contactName),
    contactHandle: String(contactHandle),
    body: String(text),
  });

  return NextResponse.json({ ok: true, conversationId: conversation.id, channel: "INSTAGRAM" });
}
