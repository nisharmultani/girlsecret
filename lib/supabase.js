import { createClient } from '@supabase/supabase-js';

// Lazy initialization, mirroring the pattern lib/airtable.js used - avoids
// throwing at import time if env vars aren't set yet (e.g. during build).
let client = null;

export function getSupabase() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Server-side only: the service role key bypasses row-level security,
    // so it must never be exposed with a NEXT_PUBLIC_ prefix or sent to
    // the browser.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.warn('Supabase not configured');
      return null;
    }

    client = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
