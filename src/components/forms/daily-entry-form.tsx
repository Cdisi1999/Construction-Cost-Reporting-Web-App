"use client";

import { FormEvent, useMemo, useState } from "react";
import { PROJECT_COST_CODES } from "@/lib/cost-codes";

const UNIT_OF_MEASURE_OPTIONS = ["CY", "LF", "SF", "EA", "TON", "HR", "LS"];

type LaborRow = {
  id: number;
  laborer_name: string;
  hours: string;
};

type EquipmentRow = {
  id: number;
  equipment_name: string;
  hours: string;
};

const EMPTY_LABOR_ROW = (): LaborRow => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  laborer_name: "",
  hours: ""
});

const EMPTY_EQUIPMENT_ROW = (): EquipmentRow => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  equipment_name: "",
  hours: ""
});

const initialState = {
  entry_date: "",
  foreman_name: "",
  crew_name: "",
  cost_code: "",
  cost_code_description: "",
  scope_of_work: "",
  location_area: "",
  quantity_installed: "",
  unit_of_measure: "EA",
  delay_flag: false,
  delay_reason: "",
  out_of_scope_flag: false,
  notes: ""
};

export function DailyEntryForm() {
  const [form, setForm] = useState(initialState);
  const [laborRows, setLaborRows] = useState<LaborRow[]>([EMPTY_LABOR_ROW()]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentRow[]>([EMPTY_EQUIPMENT_ROW()]);
  const [status, setStatus] = useState("");

  const laborHours = useMemo(
    () => laborRows.reduce((sum, row) => sum + Number(row.hours || 0), 0),
    [laborRows]
  );

  const headcount = useMemo(
    () => laborRows.filter((row) => row.laborer_name.trim() || Number(row.hours || 0) > 0).length,
    [laborRows]
  );

  const equipmentHours = useMemo(
    () => equipmentRows.reduce((sum, row) => sum + Number(row.hours || 0), 0),
    [equipmentRows]
  );

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    const equipmentEntries = equipmentRows
      .map((row) => ({
        equipment_name: row.equipment_name.trim(),
        hours: Number(row.hours || 0)
      }))
      .filter((row) => row.equipment_name || row.hours > 0);

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity_installed: Number(form.quantity_installed || 0),
        labor_hours: laborHours,
        headcount,
        equipment_entries: equipmentEntries,
        equipment_hours: equipmentHours,
        overtime_hours: 0
      })
    });

    if (response.ok) {
      setStatus("Daily entry saved successfully.");
      setForm(initialState);
      setLaborRows([EMPTY_LABOR_ROW()]);
      setEquipmentRows([EMPTY_EQUIPMENT_ROW()]);
      return;
    }

    setStatus("Unable to save daily entry. Check required fields.");
  }

  return (
    <form onSubmit={submitForm} className="space-y-5 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Daily Field Entry</h2>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Work Info</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="entry_date">Date *</label>
            <input
              id="entry_date"
              type="date"
              value={form.entry_date}
              onChange={(event) => setForm((prev) => ({ ...prev, entry_date: event.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="foreman_name">Foreman / Superintendent name *</label>
            <input
              id="foreman_name"
              type="text"
              value={form.foreman_name}
              onChange={(event) => setForm((prev) => ({ ...prev, foreman_name: event.target.value }))}
              placeholder="e.g., Alex Martinez"
              required
            />
          </div>

          <div>
            <label htmlFor="crew_name">Crew / Subcontractor *</label>
            <input
              id="crew_name"
              type="text"
              value={form.crew_name}
              onChange={(event) => setForm((prev) => ({ ...prev, crew_name: event.target.value }))}
              placeholder="e.g., Site Crew A"
              required
            />
          </div>

          <div>
            <label htmlFor="cost_code">Cost Code *</label>
            <select
              id="cost_code"
              value={form.cost_code}
              onChange={(event) => {
                const selectedCode = event.target.value;
                const selected = PROJECT_COST_CODES.find((option) => option.code === selectedCode);
                setForm((prev) => ({
                  ...prev,
                  cost_code: selectedCode,
                  cost_code_description: selected?.description ?? ""
                }));
              }}
              required
            >
              <option value="">Select cost code</option>
              {PROJECT_COST_CODES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cost_code_description">Cost Code Description</label>
            <input
              id="cost_code_description"
              type="text"
              value={form.cost_code_description}
              readOnly
              placeholder="Auto-filled from selected cost code"
            />
          </div>

          <div>
            <label htmlFor="scope_of_work">Scope of Work *</label>
            <input
              id="scope_of_work"
              type="text"
              value={form.scope_of_work}
              onChange={(event) => setForm((prev) => ({ ...prev, scope_of_work: event.target.value }))}
              placeholder="e.g., Install underground utility conduit"
              required
            />
          </div>

          <div>
            <label htmlFor="location_area">Location / Area</label>
            <input
              id="location_area"
              type="text"
              value={form.location_area}
              onChange={(event) => setForm((prev) => ({ ...prev, location_area: event.target.value }))}
              placeholder="Grid B4 to C4"
            />
          </div>

          <div>
            <label htmlFor="quantity_installed">Quantity Installed</label>
            <input
              id="quantity_installed"
              type="number"
              value={form.quantity_installed}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity_installed: event.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="unit_of_measure">Unit of Measure</label>
            <select
              id="unit_of_measure"
              value={form.unit_of_measure}
              onChange={(event) => setForm((prev) => ({ ...prev, unit_of_measure: event.target.value }))}
            >
              {UNIT_OF_MEASURE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Labor</h3>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setLaborRows((prev) => [...prev, EMPTY_LABOR_ROW()])}
          >
            + Add Laborer
          </button>
        </div>

        <div className="space-y-2">
          {laborRows.map((row, index) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
              <input
                type="text"
                value={row.laborer_name}
                onChange={(event) =>
                  setLaborRows((prev) =>
                    prev.map((item) =>
                      item.id === row.id ? { ...item, laborer_name: event.target.value } : item
                    )
                  )
                }
                placeholder="Laborer Name"
                aria-label={`Laborer ${index + 1} name`}
              />
              <input
                type="number"
                min="0"
                step="0.25"
                value={row.hours}
                onChange={(event) =>
                  setLaborRows((prev) =>
                    prev.map((item) => (item.id === row.id ? { ...item, hours: event.target.value } : item))
                  )
                }
                placeholder="Hours"
                aria-label={`Laborer ${index + 1} hours`}
              />
              <button
                type="button"
                className="rounded-md border border-rose-200 px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={laborRows.length === 1}
                onClick={() =>
                  setLaborRows((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== row.id)))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="labor_hours">Labor Hours</label>
            <input id="labor_hours" type="number" value={laborHours.toFixed(2)} readOnly />
          </div>
          <div>
            <label htmlFor="headcount">Headcount</label>
            <input id="headcount" type="number" value={headcount} readOnly />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Equipment</h3>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setEquipmentRows((prev) => [...prev, EMPTY_EQUIPMENT_ROW()])}
          >
            + Add Equipment
          </button>
        </div>

        <div className="space-y-2">
          {equipmentRows.map((row, index) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
              <input
                type="text"
                value={row.equipment_name}
                onChange={(event) =>
                  setEquipmentRows((prev) =>
                    prev.map((item) =>
                      item.id === row.id ? { ...item, equipment_name: event.target.value } : item
                    )
                  )
                }
                placeholder="Equipment Name"
                aria-label={`Equipment ${index + 1} name`}
              />
              <input
                type="number"
                min="0"
                step="0.25"
                value={row.hours}
                onChange={(event) =>
                  setEquipmentRows((prev) =>
                    prev.map((item) => (item.id === row.id ? { ...item, hours: event.target.value } : item))
                  )
                }
                placeholder="Hours"
                aria-label={`Equipment ${index + 1} hours`}
              />
              <button
                type="button"
                className="rounded-md border border-rose-200 px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={equipmentRows.length === 1}
                onClick={() =>
                  setEquipmentRows((prev) =>
                    prev.length === 1 ? prev : prev.filter((item) => item.id !== row.id)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="equipment_hours">Equipment Hours</label>
            <input id="equipment_hours" type="number" value={equipmentHours.toFixed(2)} readOnly />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Issues / Notes</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            <input
              className="h-4 w-4"
              type="checkbox"
              checked={form.delay_flag}
              onChange={(event) => {
                const checked = event.target.checked;
                setForm((prev) => ({
                  ...prev,
                  delay_flag: checked,
                  delay_reason: checked ? prev.delay_reason : ""
                }));
              }}
            />
            Delay / Disruption Flag
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            <input
              className="h-4 w-4"
              type="checkbox"
              checked={form.out_of_scope_flag}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, out_of_scope_flag: event.target.checked }))
              }
            />
            Out-of-Scope Flag
          </label>
        </div>

        {form.delay_flag ? (
          <div>
            <label htmlFor="delay_reason">Delay / Disruption Reason</label>
            <input
              id="delay_reason"
              type="text"
              value={form.delay_reason}
              onChange={(event) => setForm((prev) => ({ ...prev, delay_reason: event.target.value }))}
              placeholder="Waiting on access from adjacent crew"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="Access blocked for 2 hours by adjacent crew"
          />
        </div>
      </section>

      <button className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark" type="submit">
        Save Entry
      </button>

      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
