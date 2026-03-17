import { AppShell } from "@/components/app-shell";
import { DailyEntryForm } from "@/components/forms/daily-entry-form";

export default function DailyLogPage() {
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
      </section>
    </AppShell>
  );
}
