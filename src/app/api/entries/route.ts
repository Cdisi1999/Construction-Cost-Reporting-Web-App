import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type EntryPayload = {
  labor_entries?: Array<{ laborer_name: string; hours: number }>;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as EntryPayload;
  const { labor_entries, ...dbPayload } = payload;

  const { error } = await supabaseAdmin.from("daily_entries").insert(dbPayload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, labor_entries_received: labor_entries?.length ?? 0 });
}
