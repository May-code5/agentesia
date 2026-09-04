"use client";

import { useRouter } from "next/navigation";
import { ConversationList, type ConvItem } from "@/components/inbox/conversation-list";

export function InboxClient({
  items,
  channelFilter,
}: {
  items: ConvItem[];
  channelFilter: string;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full">
      <div className="w-full max-w-md border-r border-slate-200 bg-white">
        <ConversationList
          items={items}
          channelFilter={channelFilter}
          onFilter={(v) => {
            const q = v === "ALL" ? "" : `?channel=${v}`;
            router.push(`/dashboard${q}`);
          }}
        />
      </div>
      <div className="hidden flex-1 items-center justify-center bg-slate-50 p-8 lg:flex">
        <div className="max-w-sm text-center">
          <div className="text-lg font-semibold text-slate-800">Selecciona una conversacion</div>
          <p className="mt-2 text-sm text-slate-500">
            Revisa hilos de WhatsApp, Instagram, Web, Email y Llamadas. Responde como humano o deja
            que Luna gestione.
          </p>
        </div>
      </div>
    </div>
  );
}
