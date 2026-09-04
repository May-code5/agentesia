"use client";

import { useRouter } from "next/navigation";
import { ConversationList, type ConvItem } from "@/components/inbox/conversation-list";
import { ThreadView, type Msg } from "@/components/inbox/thread-view";

export function ThreadClient({
  items,
  channelFilter,
  conversation,
  messages,
}: {
  items: ConvItem[];
  channelFilter: string;
  conversation: {
    id: string;
    channel: string;
    contactName: string;
    contactHandle: string | null;
    subject: string | null;
    status: string;
  };
  messages: Msg[];
}) {
  const router = useRouter();

  async function onReply(body: string) {
    const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, senderType: "human" }),
    });
    if (!res.ok) throw new Error("No se pudo enviar");
    router.refresh();
  }

  return (
    <div className="flex h-full">
      <div className="hidden w-full max-w-md border-r border-slate-200 bg-white md:block">
        <ConversationList
          items={items}
          activeId={conversation.id}
          channelFilter={channelFilter}
          onFilter={(v) => {
            const q = v === "ALL" ? "" : `?channel=${v}`;
            router.push(`/dashboard/c/${conversation.id}${q}`);
          }}
        />
      </div>
      <div className="flex-1 bg-white">
        <ThreadView conversation={conversation} messages={messages} onReply={onReply} />
      </div>
    </div>
  );
}
