import { WeeklySummaryRow } from "@/lib/types";

export function WeeklySummaryTable({ rows }: { rows: WeeklySummaryRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            {[
              "Week Ending",
              "Cost Code",
              "Description",
              "Qty",
              "Labor",
              "Equipment",
              "Overtime",
              "Entries",
              "Disruptions / Notes"
            ].map((header) => (
              <th key={header} className="px-3 py-2 font-semibold text-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={`${row.week_ending_date}-${row.cost_code}`}>
              <td className="px-3 py-2">{row.week_ending_date}</td>
              <td className="px-3 py-2">{row.cost_code}</td>
              <td className="px-3 py-2">{row.cost_code_description}</td>
              <td className="px-3 py-2">{row.total_quantity.toFixed(2)}</td>
              <td className="px-3 py-2">{row.total_labor_hours.toFixed(2)}</td>
              <td className="px-3 py-2">{row.total_equipment_hours.toFixed(2)}</td>
              <td className="px-3 py-2">{row.total_overtime_hours.toFixed(2)}</td>
              <td className="px-3 py-2">{row.entry_count}</td>
              <td className="px-3 py-2">{row.disruptions_notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
