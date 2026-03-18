import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const createSupabaseBrowserClient = () =>
  createClient(env.supabaseUrl, env.supabaseAnonKey);

export const supabaseAdmin = createClient(
  env.supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.supabaseAnonKey,
  {
    auth: { persistSession: false }
  }
);
