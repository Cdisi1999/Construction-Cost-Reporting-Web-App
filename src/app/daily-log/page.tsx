import { AppShell } from "@/components/app-shell";
import { FilterBar } from "@/components/filter-bar";
import { DailyEntryForm } from "@/components/forms/daily-entry-form";
import { DailyLogTable } from "@/components/tables/daily-log-table";
import { supabaseAdmin } from "@/lib/supabase";
import { DailyEntry } from "@/lib/types";

async function getEntries(searchParams: Record<string, string | string[] | undefined>) {
  let query = supabaseAdmin.from("daily_entries").select("*").order("entry_date", { ascending: false }).limit(100);

  const keys = ["foreman_name", "crew_name", "location_area", "cost_code", "cost_code_description"] as const;

  keys.forEach((key) => {
    const raw = searchParams[key];
    const value = typeof raw === "string" ? raw : "";
    if (value) {
      query = query.ilike(key, `%${value}%`);
    }
  });

  const { data } = await query;
  return (data as DailyEntry[] | null) ?? [];
}

export default async function DailyLogPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const entries = await getEntries(searchParams);

  return (
    <AppShell currentPath="/daily-log">
      <section className="space-y-4">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-lg font-semibold">Daily Field Report</h2>
          <p className="text-sm text-slate-600">
            Submit one field report per cost code/work area for accurate weekly rollups.
          </p>
        </div>

        <DailyEntryForm />
        <FilterBar />
        <DailyLogTable entries={entries} />
      </section>
    </AppShell>
  );
}
