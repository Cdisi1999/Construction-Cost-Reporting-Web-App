import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DashboardCards } from "@/components/dashboard-cards";
import { WeeklySummaryTable } from "@/components/tables/weekly-summary-table";
import { supabaseAdmin } from "@/lib/supabase";
import { WeeklySummaryRow } from "@/lib/types";

async function getLatestSummary() {
  const { data } = await supabaseAdmin
    .from("weekly_cost_summary")
    .select("*")
    .order("week_ending_date", { ascending: false })
    .limit(20);

  return (data as WeeklySummaryRow[] | null) ?? [];
}

export default async function HomePage() {
  const rows = await getLatestSummary();

  return (
    <AppShell currentPath="/">
      <div className="space-y-6">
        <section className="rounded-lg bg-brand p-5 text-white">
          <h2 className="text-2xl font-semibold">Weekly Cost Control Overview</h2>
          <p className="mt-1 text-sm text-white/90">
            Fast field capture for foremen and superintendents with cost-code-first reporting.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-white px-4 py-2 font-medium text-brand"
              href="/daily-log"
            >
              Add Daily Entry
            </Link>
            <Link
              className="rounded-md border border-white px-4 py-2 font-medium"
              href="/weekly-summary"
            >
              View Weekly Summary
            </Link>
          </div>
        </section>

        <DashboardCards rows={rows} />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Latest weekly rollups</h3>
            <Link
              className="text-sm font-medium text-brand"
              href="/api/export?format=csv"
            >
              Download CSV
            </Link>
          </div>
          <WeeklySummaryTable rows={rows} />
        </section>
      </div>
    </AppShell>
  );
}
