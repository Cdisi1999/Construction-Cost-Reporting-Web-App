import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== env.cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(new URL("/api/weekly-report", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  const body = await response.json();
  return NextResponse.json({ ok: response.ok, body });
}
