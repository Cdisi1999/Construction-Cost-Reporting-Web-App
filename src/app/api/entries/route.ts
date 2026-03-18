import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.json();
  const { equipment_entries, ...dailyEntry } = payload;
  void equipment_entries;

  const { error } = await supabaseAdmin.from("daily_entries").insert(dailyEntry);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
