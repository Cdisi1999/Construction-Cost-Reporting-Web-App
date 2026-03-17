# Construction Cost Reporting Web App

Internal web application starter for construction field cost tracking using **Next.js + TypeScript + Supabase + Tailwind**.

## Features included

- Supabase magic-link authentication page
- Daily field entry form with all required production/cost fields
- Daily log table with filters (foreman, crew, location, cost code, description)
- Weekly summary grouped by cost code + description + week ending
- Dashboard cards for weekly totals
- Export API for CSV, Excel, and PDF
- Friday automation entrypoint (`/api/cron/friday-summary`) and SQL cron function
- AI starter logic for keyword-based change-event flagging
- Mobile-friendly responsive layout
- Photo upload column included in DB schema for future UI upload integration

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   CRON_SECRET=your-cron-secret
   ```
3. Apply database schema in Supabase SQL editor using `supabase/schema.sql`.
4. Run app:
   ```bash
   npm run dev
   ```

## Important routes

- `/login` – user authentication
- `/daily-log` – fast daily entry and full daily log
- `/weekly-summary` – grouped weekly totals and exports
- `/api/weekly-report` – trigger weekly rollup generation
- `/api/export?format=csv|excel|pdf` – weekly exports
- `/api/cron/friday-summary` – protected cron endpoint

## Notes

- For production, use a Supabase **service role key** for secure server-side jobs/RPC operations.
- AI summarization can be plugged into `ai_summary` in `weekly_cost_summary` table.
