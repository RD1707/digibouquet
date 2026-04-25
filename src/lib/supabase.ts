import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : (null as never);

export type BouquetRow = {
  id: string;
  mode: "color" | "mono";
  flowers: string[];
  greens: string[];
  bush: string;
  created_at: string;
};
