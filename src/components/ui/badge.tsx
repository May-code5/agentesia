import { cn } from "@/lib/utils";
import { CHANNEL_COLORS, CHANNEL_LABELS, type Channel, isChannel } from "@/lib/channels";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ChannelBadge({ channel }: { channel: string }) {
  const key = isChannel(channel) ? channel : "WEB";
  return (
    <Badge className={CHANNEL_COLORS[key as Channel]}>
      {CHANNEL_LABELS[key as Channel] || channel}
    </Badge>
  );
}
