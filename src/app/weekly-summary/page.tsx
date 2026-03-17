import Link from "next/link";
import { endOfWeek, format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { WeeklySummaryTable } from "@/components/tables/weekly-summary-table";
import { supabaseAdmin } from "@/lib/supabase";
import { WeeklySummaryRow } from "@/lib/types";

async function getWeeklySummary(weekEnding?: string) {
  let query = supabaseAdmin
    .from("weekly_cost_summary")
    .select("*")
    .order("week_ending_date", { ascending: false });

  if (weekEnding) {
    query = query.eq("week_ending_date", weekEnding);
  }

  const { data } = await query;
  return (data as WeeklySummaryRow[] | null) ?? [];
}

export default async function WeeklySummaryPage({
  searchParams
}: {
  searchParams: { weekEnding?: string };
}) {
  const defaultWeekEnding = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnding = searchParams.weekEnding ?? defaultWeekEnding;
  const rows = await getWeeklySummary(weekEnding);

  return (
    <AppShell currentPath="/weekly-summary">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
          <div>
            <label htmlFor="weekEnding">Week ending date</label>
            <input id="weekEnding" name="weekEnding" type="date" defaultValue={weekEnding} form="filter" />
          </div>
          <form id="filter" action="/weekly-summary">
            <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">Apply</button>
          </form>
          <div className="ml-auto flex gap-2">
            <Link className="rounded-md border px-3 py-2 text-sm" href="/api/export?format=csv">
              CSV
            </Link>
            <Link className="rounded-md border px-3 py-2 text-sm" href="/api/export?format=excel">
              Excel
            </Link>
            <Link className="rounded-md border px-3 py-2 text-sm" href="/api/export?format=pdf">
              PDF
            </Link>
          </div>
        </div>
        <WeeklySummaryTable rows={rows} />
      </section>
    </AppShell>
  );
}
