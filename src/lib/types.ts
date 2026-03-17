export type DailyEntry = {
  id: string;
  entry_date: string;
  foreman_name: string;
  crew_name: string;
  cost_code: string;
  cost_code_description: string;
  scope_of_work: string;
  location_area: string;
  quantity_installed: number;
  unit_of_measure: string;
  labor_hours: number;
  headcount: number;
  equipment_hours: number;
  overtime_hours: number;
  delay_flag: boolean;
  delay_reason: string | null;
  out_of_scope_flag: boolean;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
};

export type WeeklySummaryRow = {
  cost_code: string;
  cost_code_description: string;
  week_ending_date: string;
  total_quantity: number;
  total_labor_hours: number;
  total_equipment_hours: number;
  total_overtime_hours: number;
  entry_count: number;
  disruptions_notes: string;
};
