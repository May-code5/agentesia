"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Inbox, Bot, Settings, MessageCircle, LogOut, Sparkles } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Inbox", icon: Inbox },
  { href: "/dashboard/agentes", label: "Agentes IA", icon: Bot },
  { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
  { href: "/widget", label: "Widget demo", icon: MessageCircle },
];

export function Sidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-luna-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Luna Desk</div>
          <div className="text-[11px] text-slate-400">by MAY-CODE</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map((l) => {
          const active =
            l.href === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/dashboard/c/")
              : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 text-xs text-slate-400">{userName || "Usuario"}</div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </form>
      </div>
    </aside>
  );
}
