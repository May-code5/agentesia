"use client";

import { useState } from "react";
import { ChannelBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatRelativeEs } from "@/lib/utils";
import { Bot, User, UserRound } from "lucide-react";

export type Msg = {
  id: string;
  body: string;
  senderType: string;
  senderName: string | null;
  createdAt: string;
};

export function ThreadView({
  conversation,
  messages,
  onReply,
}: {
  conversation: {
    id: string;
    channel: string;
    contactName: string;
    contactHandle: string | null;
    subject: string | null;
    status: string;
  };
  messages: Msg[];
  onReply: (body: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      await onReply(body.trim());
      setBody("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{conversation.contactName}</h2>
            <ChannelBadge channel={conversation.channel} />
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {conversation.contactHandle}
            {conversation.subject ? ` · ${conversation.subject}` : ""}
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-600">
          {conversation.status}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-5 py-4">
        {messages.map((m) => {
          const isContact = m.senderType === "contact";
          const isAi = m.senderType === "ai";
          return (
            <div
              key={m.id}
              className={cn("flex", isContact ? "justify-start" : "justify-end")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
                  isContact && "bg-white border border-slate-200",
                  isAi && "bg-luna-600 text-white",
                  m.senderType === "human" && "bg-brand-600 text-white"
                )}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-80">
                  {isAi ? <Bot className="h-3 w-3" /> : isContact ? <UserRound className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  <span>
                    {isAi ? "IA · " : isContact ? "Cliente · " : "Humano · "}
                    {m.senderName || (isContact ? conversation.contactName : "Agente")}
                  </span>
                  <span>· {formatRelativeEs(m.createdAt)}</span>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="border-t border-slate-200 bg-white p-4">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Responder como humano..."
          rows={3}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">Se guarda como mensaje humano en el hilo.</p>
          <Button type="submit" disabled={sending || !body.trim()}>
            {sending ? "Enviando..." : "Enviar respuesta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
