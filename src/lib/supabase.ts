import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const createSupabaseBrowserClient = () =>
  createClient(env.supabaseUrl, env.supabaseAnonKey);

export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false }
});
