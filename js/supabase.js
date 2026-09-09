import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Replace both placeholder values with Project URL and anon public key from Supabase.
const SUPABASE_URL = 'https://eimkdorxntjhkpqqzaht.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jeMkOTWE4Zmf6BP50RrB-g_s9biBtA-';

export const isConfigured = !SUPABASE_URL.includes('PASTE_') && !SUPABASE_ANON_KEY.includes('PASTE_');
export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
