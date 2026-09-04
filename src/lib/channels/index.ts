export type Channel = "WHATSAPP" | "INSTAGRAM" | "WEB" | "EMAIL" | "VOICE";

export const CHANNEL_LABELS: Record<Channel, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  WEB: "Web",
  EMAIL: "Email",
  VOICE: "Llamada",
};

export const CHANNEL_COLORS: Record<Channel, string> = {
  WHATSAPP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  INSTAGRAM: "bg-pink-100 text-pink-800 border-pink-200",
  WEB: "bg-sky-100 text-sky-800 border-sky-200",
  EMAIL: "bg-amber-100 text-amber-800 border-amber-200",
  VOICE: "bg-violet-100 text-violet-800 border-violet-200",
};

export function isChannel(v: string): v is Channel {
  return v in CHANNEL_LABELS;
}
