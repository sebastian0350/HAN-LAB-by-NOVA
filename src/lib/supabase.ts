import { createClient } from '@supabase/supabase-js';

const supabaserUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaserAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaserUrl || !supabaserAnonKey) {
  console.warn('Supabase credentials not found. Running in guest mode only.');
}

export const supabase = supabaserUrl && supabaserAnonKey
  ? createClient(supabaserUrl, supabaserAnonKey)
  : null;
