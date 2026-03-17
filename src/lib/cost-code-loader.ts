import { readFile } from "fs/promises";
import path from "path";
import { CostCodeOption } from "@/lib/cost-codes";

function parseCsvLine(line: string) {
  const parts = line.split(",");
  const code = (parts[0] ?? "").trim().replace(/^"|"$/g, "");
  const description = parts.slice(1).join(",").trim().replace(/^"|"$/g, "");
  return { code, description };
}

export async function loadCostCodesFromCsv(): Promise<CostCodeOption[]> {
  const csvPath = path.join(process.cwd(), "Cost Codes.csv");

  try {
    const raw = await readFile(csvPath, "utf-8");
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    const rows = lines
      .slice(1)
      .map(parseCsvLine)
      .filter((row) => row.code && row.description);

    return rows;
  } catch {
    return [];
  }
}
