import { endOfWeek, format } from "date-fns";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function buildAiSignals(notes: string) {
  const keywords = ["rework", "access issue", "owner request", "out of scope", "waiting", "redesign"];
  const lowered = notes.toLowerCase();
  return keywords.filter((keyword) => lowered.includes(keyword));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { weekEnding?: string };
  const weekEnding = body.weekEnding ?? format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  const { error } = await supabaseAdmin.rpc("generate_weekly_report", {
    week_ending_input: weekEnding
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = await supabaseAdmin
    .from("weekly_cost_summary")
    .select("cost_code, disruptions_notes")
    .eq("week_ending_date", weekEnding);

  const aiFlags = (data ?? []).map((row) => ({
    cost_code: row.cost_code,
    likely_change_events: buildAiSignals(row.disruptions_notes ?? "")
  }));

  return NextResponse.json({ weekEnding, aiFlags });
}
