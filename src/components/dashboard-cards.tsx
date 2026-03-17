import { WeeklySummaryRow } from "@/lib/types";

export function DashboardCards({ rows }: { rows: WeeklySummaryRow[] }) {
  const totals = rows.reduce(
    (acc, row) => ({
      quantity: acc.quantity + row.total_quantity,
      labor: acc.labor + row.total_labor_hours,
      equipment: acc.equipment + row.total_equipment_hours,
      overtime: acc.overtime + row.total_overtime_hours
    }),
    { quantity: 0, labor: 0, equipment: 0, overtime: 0 }
  );

  const cards = [
    { label: "Total Quantity", value: totals.quantity.toFixed(2) },
    { label: "Labor Hours", value: totals.labor.toFixed(2) },
    { label: "Equipment Hours", value: totals.equipment.toFixed(2) },
    { label: "Overtime Hours", value: totals.overtime.toFixed(2) }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-dark">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
