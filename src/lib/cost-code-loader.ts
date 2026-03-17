import { readFile } from "fs/promises";
import path from "path";
import { CostCodeOption } from "@/lib/cost-codes";

function parseCsvRecord(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values.map((value) => value.replace(/^"|"$/g, ""));
}

export async function loadCostCodesFromCsv(): Promise<CostCodeOption[]> {
  const csvPath = path.join(process.cwd(), "Cost Codes.csv");

  try {
    const raw = await readFile(csvPath, "utf-8");
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    if (lines.length <= 1) {
      return [];
    }

    return lines
      .slice(1)
      .map((line) => {
        const [code = "", description = ""] = parseCsvRecord(line);
        return { code, description };
      })
      .filter((entry) => entry.code && entry.description);
  } catch {
    return [];
  }
}
