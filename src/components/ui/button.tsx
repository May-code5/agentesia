import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "default", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-500 disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-luna-600 text-white hover:bg-luna-700 shadow-sm",
        variant === "secondary" && "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
        variant === "outline" && "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800",
        variant === "ghost" && "hover:bg-slate-100 text-slate-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
