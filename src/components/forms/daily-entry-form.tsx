"use client";

import { useState } from "react";

const initialState = {
  entry_date: "",
  foreman_name: "",
  crew_name: "",
  cost_code: "",
  cost_code_description: "",
  scope_of_work: "",
  location_area: "",
  quantity_installed: "",
  unit_of_measure: "",
  labor_hours: "",
  headcount: "",
  equipment_hours: "",
  overtime_hours: "",
  delay_flag: false,
  delay_reason: "",
  out_of_scope_flag: false,
  notes: ""
};

export function DailyEntryForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string>("");

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity_installed: Number(form.quantity_installed || 0),
        labor_hours: Number(form.labor_hours || 0),
        headcount: Number(form.headcount || 0),
        equipment_hours: Number(form.equipment_hours || 0),
        overtime_hours: Number(form.overtime_hours || 0)
      })
    });

    if (response.ok) {
      setStatus("Saved daily entry.");
      setForm(initialState);
      return;
    }

    setStatus("Unable to save daily entry. Check required fields.");
  }

  return (
    <form onSubmit={submitForm} className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Daily Field Entry</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["entry_date", "Date", "date"],
          ["foreman_name", "Foreman / Superintendent name", "text"],
          ["crew_name", "Crew / Subcontractor", "text"],
          ["cost_code", "Cost Code", "text"],
          ["cost_code_description", "Cost Code Description", "text"],
          ["scope_of_work", "Scope of Work", "text"],
          ["location_area", "Location / Design Unit / Area", "text"],
          ["quantity_installed", "Quantity Installed", "number"],
          ["unit_of_measure", "Unit of Measure", "text"],
          ["labor_hours", "Labor Hours", "number"],
          ["headcount", "Headcount", "number"],
          ["equipment_hours", "Equipment Hours", "number"],
          ["overtime_hours", "Overtime Hours", "number"],
          ["delay_reason", "Delay Reason", "text"]
        ].map(([name, label, type]) => (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type={type}
              value={form[name as keyof typeof form] as string}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [name]: event.target.value }))
              }
              required={
                [
                  "entry_date",
                  "foreman_name",
                  "crew_name",
                  "cost_code",
                  "cost_code_description",
                  "scope_of_work",
                  "location_area"
                ].includes(name)
              }
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.delay_flag}
            onChange={(event) => setForm((prev) => ({ ...prev, delay_flag: event.target.checked }))}
          />
          Delay/Disruption Flag
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.out_of_scope_flag}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, out_of_scope_flag: event.target.checked }))
            }
          />
          Out-of-Scope Flag
        </label>
      </div>

      <button className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark" type="submit">
        Save Entry
      </button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
