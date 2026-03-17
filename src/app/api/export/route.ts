import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase";

async function loadRows() {
  const { data } = await supabaseAdmin
    .from("weekly_cost_summary")
    .select("*")
    .order("week_ending_date", { ascending: false })
    .limit(500);

  return data ?? [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";
  const rows = await loadRows();

  if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Summary");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="weekly-summary.xlsx"'
      }
    });
  }

  if (format === "pdf") {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([841.89, 595.28]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    page.drawText("Construction Weekly Cost Summary", {
      x: 30,
      y: 560,
      size: 16,
      font,
      color: rgb(0.06, 0.3, 0.5)
    });

    let y = 535;
    rows.slice(0, 25).forEach((row) => {
      page.drawText(
        `${row.week_ending_date} | ${row.cost_code} | Qty ${Number(row.total_quantity).toFixed(
          2
        )} | Labor ${Number(row.total_labor_hours).toFixed(2)} | ${row.disruptions_notes || ""}`,
        { x: 30, y, size: 9, font }
      );
      y -= 18;
    });

    const bytes = await pdf.save();
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="weekly-summary.pdf"'
      }
    });
  }

  const columns = [
    "week_ending_date",
    "cost_code",
    "cost_code_description",
    "total_quantity",
    "total_labor_hours",
    "total_equipment_hours",
    "total_overtime_hours",
    "entry_count",
    "disruptions_notes"
  ];

  const csv = [
    columns.join(","),
    ...rows.map((row) =>
      columns
        .map((column) => `"${String(row[column] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    )
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="weekly-summary.csv"'
    }
  });
}
