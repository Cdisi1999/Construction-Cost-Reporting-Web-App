import Link from "next/link";
import { addDays, format, getDay } from "date-fns";
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

function getCurrentWeekEndingFriday() {
  const today = new Date();
  const day = getDay(today);
  const friday = 5;
  const daysToFriday = (friday - day + 7) % 7;
  return format(addDays(today, daysToFriday), "yyyy-MM-dd");
}

function buildSummaryCards(rows: WeeklySummaryRow[]) {
  return rows.reduce(
    (totals, row) => ({
      totalQuantity: totals.totalQuantity + row.total_quantity,
      laborHours: totals.laborHours + row.total_labor_hours,
      equipmentHours: totals.equipmentHours + row.total_equipment_hours,
      overtimeHours: totals.overtimeHours + row.total_overtime_hours,
      entryCount: totals.entryCount + row.entry_count
    }),
    {
      totalQuantity: 0,
      laborHours: 0,
      equipmentHours: 0,
      overtimeHours: 0,
      entryCount: 0
    }
  );
}

export default async function WeeklySummaryPage({
  searchParams
}: {
  searchParams: { weekEnding?: string };
}) {
  const defaultWeekEnding = getCurrentWeekEndingFriday();
  const weekEnding = searchParams.weekEnding ?? defaultWeekEnding;
  const rows = await getWeeklySummary(weekEnding);
  const totals = buildSummaryCards(rows);

  const cards = [
    { label: "Total Quantity", value: totals.totalQuantity.toFixed(2) },
    { label: "Labor Hours", value: totals.laborHours.toFixed(2) },
    { label: "Equipment Hours", value: totals.equipmentHours.toFixed(2) },
    { label: "Overtime Hours", value: totals.overtimeHours.toFixed(2) },
    { label: "Entry Count", value: String(totals.entryCount) }
  ];

  return (
    <AppShell currentPath="/weekly-summary">
      <section className="space-y-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <form action="/weekly-summary" className="flex flex-wrap items-end gap-3">
              <div className="min-w-[220px]">
                <label htmlFor="weekEnding">Week ending date</label>
                <input id="weekEnding" name="weekEnding" type="date" defaultValue={weekEnding} />
              </div>
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">Apply</button>
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
                Apply
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                href="/api/export?format=csv"
              >
                CSV
              </Link>
              <Link
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                href="/api/export?format=excel"
              >
                Excel
              </Link>
              <Link
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                href="/api/export?format=pdf"
              >
                PDF
              </Link>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <article key={card.label} className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-brand-dark">{card.value}</p>
            </article>
          ))}
        </section>

        {rows.length ? (
          <WeeklySummaryTable rows={rows} />
        ) : (
          <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand-dark">📊</div>
              <p className="text-base font-semibold text-slate-800">
                No weekly rollup data found for the selected week.
              </p>
              <p className="mt-1 text-sm text-slate-600">Submit daily entries to generate weekly summaries.</p>
            </div>
          <div className="rounded-lg border border-dashed bg-white p-8 text-center shadow-sm">
            <p className="text-base font-semibold text-slate-800">
              No weekly rollup data found for the selected week.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Submit daily entries to generate weekly summaries.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
