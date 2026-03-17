"use client";

import { useMemo, useState } from "react";
import { PROJECT_COST_CODES } from "@/lib/cost-codes";

const UNIT_OF_MEASURE_OPTIONS = ["CY", "LF", "SF", "EA", "TON", "HR", "LS"];

type LaborerRow = {
  id: string;
  name: string;
  hours: string;
};

const requiredFields = [
  "Date",
  "Foreman / Superintendent name",
  "Crew / Subcontractor",
  "Cost Code",
  "Scope of Work",
  "Location / Design Unit / Area"
];

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
  equipment_hours: "",
  overtime_hours: "",
  delay_flag: false,
  delay_reason: "",
  out_of_scope_flag: false,
  notes: ""
};

function FieldLabel({ htmlFor, label, required = false }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor}>
      {label}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );
}

export function DailyEntryForm() {
  const [form, setForm] = useState(initialState);
  const [laborers, setLaborers] = useState<LaborerRow[]>([{ id: crypto.randomUUID(), name: "", hours: "" }]);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const laborTotals = useMemo(() => {
    const totalHours = laborers.reduce((sum, laborer) => sum + Number(laborer.hours || 0), 0);
    const headcount = laborers.filter((laborer) => laborer.name.trim().length > 0).length;
    return { totalHours, headcount };
  }, [laborers]);

  function updateLaborer(id: string, key: "name" | "hours", value: string) {
    setLaborers((rows) => rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function addLaborer() {
    setLaborers((rows) => [...rows, { id: crypto.randomUUID(), name: "", hours: "" }]);
  }

  function removeLaborer(id: string) {
    setLaborers((rows) => (rows.length === 1 ? rows : rows.filter((row) => row.id !== id)));
  }

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity_installed: Number(form.quantity_installed || 0),
        labor_hours: laborTotals.totalHours,
        headcount: laborTotals.headcount,
        equipment_hours: Number(form.equipment_hours || 0),
        overtime_hours: Number(form.overtime_hours || 0)
      })
    });

    if (response.ok) {
      setStatus({ kind: "success", message: "Daily entry saved successfully." });
      setForm(initialState);
      setLaborers([{ id: crypto.randomUUID(), name: "", hours: "" }]);
      return;
    }

    setStatus({ kind: "error", message: "Unable to save daily entry. Check required fields and try again." });
  }

  return (
    <form onSubmit={submitForm} className="space-y-5 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Daily Field Entry</h2>
          <p className="text-sm text-slate-600">Fields marked with * are required.</p>
        </div>
      </div>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Work Info</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel htmlFor="entry_date" label="Date" required />
            <input
              id="entry_date"
              type="date"
              value={form.entry_date}
              onChange={(event) => setForm((prev) => ({ ...prev, entry_date: event.target.value }))}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="foreman_name" label="Foreman / Superintendent name" required />
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
            <FieldLabel htmlFor="crew_name" label="Crew / Subcontractor" required />
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
            <FieldLabel htmlFor="cost_code" label="Cost Code" required />
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
                  {option.code} - {option.description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="cost_code_description" label="Cost Code Description" />
            <input
              id="cost_code_description"
              type="text"
              value={form.cost_code_description}
              readOnly
              placeholder="Auto-filled from selected cost code"
            />
          </div>
          <div>
            <FieldLabel htmlFor="scope_of_work" label="Scope of Work" required />
            <input
              id="scope_of_work"
              type="text"
              value={form.scope_of_work}
              onChange={(event) => setForm((prev) => ({ ...prev, scope_of_work: event.target.value }))}
              placeholder="Excavation at Track 4 drainage trench"
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="location_area" label="Location / Design Unit / Area" required />
            <input
              id="location_area"
              type="text"
              value={form.location_area}
              onChange={(event) => setForm((prev) => ({ ...prev, location_area: event.target.value }))}
              placeholder="DU-3 / Platform East"
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Production</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel htmlFor="quantity_installed" label="Quantity Installed" />
            <input
              id="quantity_installed"
              type="number"
              value={form.quantity_installed}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, quantity_installed: event.target.value }))
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="unit_of_measure" label="Unit of Measure" />
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Labor</h3>
          <button
            type="button"
            onClick={addLaborer}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Add Laborer
          </button>
        </div>

        <div className="space-y-3">
          {laborers.map((laborer, index) => (
            <div key={laborer.id} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_140px_auto]">
              <div>
                <FieldLabel htmlFor={`laborer_name_${laborer.id}`} label={`Laborer Name ${index + 1}`} />
                <input
                  id={`laborer_name_${laborer.id}`}
                  type="text"
                  value={laborer.name}
                  onChange={(event) => updateLaborer(laborer.id, "name", event.target.value)}
                  placeholder="e.g., J. Ramirez"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`laborer_hours_${laborer.id}`} label="Hours" />
                <input
                  id={`laborer_hours_${laborer.id}`}
                  type="number"
                  value={laborer.hours}
                  onChange={(event) => updateLaborer(laborer.id, "hours", event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeLaborer(laborer.id)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={laborers.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-md bg-slate-50 p-3 sm:grid-cols-2">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Derived Total Labor Hours:</span> {laborTotals.totalHours.toFixed(2)}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Derived Headcount:</span> {laborTotals.headcount}
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Equipment</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="equipment_hours" label="Equipment Hours" />
            <input
              id="equipment_hours"
              type="number"
              value={form.equipment_hours}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, equipment_hours: event.target.value }))
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="overtime_hours" label="Overtime Hours" />
            <input
              id="overtime_hours"
              type="number"
              value={form.overtime_hours}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, overtime_hours: event.target.value }))
              }
            />
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
            <FieldLabel htmlFor="delay_reason" label="Delay Reason" />
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
          <FieldLabel htmlFor="notes" label="Notes" />
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

      {status ? (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            status.kind === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-red-300 bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <p className="text-xs text-slate-500">Required fields: {requiredFields.join(", ")}.</p>
    </form>
  );
}
