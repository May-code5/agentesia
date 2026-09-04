import { NextResponse } from "next/server";
import { loginDemo } from "@/lib/auth";

export async function POST() {
  try {
    const session = await loginDemo();
    return NextResponse.json({ ok: true, user: session });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error demo" },
      { status: 500 }
    );
  }
}
