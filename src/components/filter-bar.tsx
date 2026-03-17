"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  "foreman_name",
  "crew_name",
  "location_area",
  "cost_code",
  "cost_code_description"
];

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
      {filters.map((filter) => (
        <div key={filter}>
          <label htmlFor={filter}>{filter.replaceAll("_", " ")}</label>
          <input
            id={filter}
            defaultValue={params.get(filter) ?? ""}
            onBlur={(event) => {
              const nextParams = new URLSearchParams(params.toString());
              const value = event.target.value.trim();
              if (value) {
                nextParams.set(filter, value);
              } else {
                nextParams.delete(filter);
              }
              router.replace(`?${nextParams.toString()}`);
            }}
          />
        </div>
      ))}
    </div>
  );
}
