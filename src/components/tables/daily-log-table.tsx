import { DailyEntry } from "@/lib/types";

export function DailyLogTable({ entries }: { entries: DailyEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            {[
              "Date",
              "Foreman",
              "Crew",
              "Cost Code",
              "Description",
              "Scope",
              "Location",
              "Qty",
              "UoM",
              "Labor",
              "Equip",
              "OT",
              "Delay",
              "Out-of-Scope",
              "Notes"
            ].map((header) => (
              <th key={header} className="px-3 py-2 font-semibold text-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-3 py-2">{entry.entry_date}</td>
              <td className="px-3 py-2">{entry.foreman_name}</td>
              <td className="px-3 py-2">{entry.crew_name}</td>
              <td className="px-3 py-2">{entry.cost_code}</td>
              <td className="px-3 py-2">{entry.cost_code_description}</td>
              <td className="px-3 py-2">{entry.scope_of_work}</td>
              <td className="px-3 py-2">{entry.location_area}</td>
              <td className="px-3 py-2">{entry.quantity_installed}</td>
              <td className="px-3 py-2">{entry.unit_of_measure}</td>
              <td className="px-3 py-2">{entry.labor_hours}</td>
              <td className="px-3 py-2">{entry.equipment_hours}</td>
              <td className="px-3 py-2">{entry.overtime_hours}</td>
              <td className="px-3 py-2">{entry.delay_flag ? "Yes" : "No"}</td>
              <td className="px-3 py-2">{entry.out_of_scope_flag ? "Yes" : "No"}</td>
              <td className="px-3 py-2">{entry.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
