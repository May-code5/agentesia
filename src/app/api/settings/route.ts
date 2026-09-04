import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const workspace = await prisma.workspace.update({
    where: { id: session.workspaceId },
    data: {
      name: body.name ? String(body.name) : undefined,
      businessName: body.businessName !== undefined ? String(body.businessName) : undefined,
      timezone: body.timezone ? String(body.timezone) : undefined,
    },
  });
  return NextResponse.json({ workspace });
}
