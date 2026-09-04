"use client";

import Link from "next/link";
import { ChannelBadge } from "@/components/ui/badge";
import { formatRelativeEs, cn } from "@/lib/utils";

export type ConvItem = {
  id: string;
  channel: string;
  contactName: string;
  contactHandle: string | null;
  subject: string | null;
  status: string;
  lastMessageAt: string;
  preview?: string | null;
};

export function ConversationList({
  items,
  activeId,
  channelFilter,
  onFilter,
}: {
  items: ConvItem[];
  activeId?: string;
  channelFilter: string;
  onFilter: (v: string) => void;
}) {
  const channels = ["ALL", "WHATSAPP", "INSTAGRAM", "WEB", "EMAIL", "VOICE"];
  const labels: Record<string, string> = {
    ALL: "Todos",
    WHATSAPP: "WhatsApp",
    INSTAGRAM: "Instagram",
    WEB: "Web",
    EMAIL: "Email",
    VOICE: "Llamada",
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-3">
        <div className="mb-2 text-sm font-semibold text-slate-900">Conversaciones</div>
        <div className="flex flex-wrap gap-1">
          {channels.map((c) => (
            <button
              key={c}
              onClick={() => onFilter(c)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                channelFilter === c
                  ? "bg-luna-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {labels[c]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">No hay conversaciones.</div>
        )}
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/c/${c.id}`}
            className={cn(
              "block border-b border-slate-100 px-4 py-3 hover:bg-slate-50",
              activeId === c.id && "bg-luna-50"
            )}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="truncate text-sm font-medium text-slate-900">{c.contactName}</div>
              <div className="shrink-0 text-[11px] text-slate-400">
                {formatRelativeEs(c.lastMessageAt)}
              </div>
            </div>
            <div className="mb-1.5 flex items-center gap-2">
              <ChannelBadge channel={c.channel} />
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wide",
                  c.status === "open" && "text-emerald-600",
                  c.status === "pending" && "text-amber-600",
                  c.status === "closed" && "text-slate-400"
                )}
              >
                {c.status}
              </span>
            </div>
            <div className="truncate text-xs text-slate-500">
              {c.preview || c.subject || c.contactHandle || "Sin mensajes"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
