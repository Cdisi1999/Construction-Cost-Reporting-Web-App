export type CostCodeOption = {
  code: string;
  description: string;
};

// Temporary project cost code catalog for UI development.
// Replace this list with the project's official cost code schedule when available.
export const PROJECT_COST_CODES: CostCodeOption[] = [
  { code: "01-100", description: "Mobilization" },
  { code: "02-200", description: "Earthwork / Excavation" },
  { code: "03-300", description: "Concrete" },
  { code: "04-400", description: "Masonry" },
  { code: "05-500", description: "Structural Steel" },
  { code: "31-100", description: "Site Utilities" }
];
