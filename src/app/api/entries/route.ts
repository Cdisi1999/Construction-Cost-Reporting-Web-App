import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.json();

  const { labor_entries, equipment_entries, ...dbPayload } = payload;

  const { error } = await supabaseAdmin.from("daily_entries").insert(dbPayload);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
