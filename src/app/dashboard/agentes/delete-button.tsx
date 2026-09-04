"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteAgentButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="danger"
      onClick={async () => {
        if (!confirm("Eliminar este agente?")) return;
        await fetch(`/api/agents/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Eliminar
    </Button>
  );
}
