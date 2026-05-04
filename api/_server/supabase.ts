/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/supabase/database.types';

function getServerSupabaseEnv(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase server env (SUPABASE_URL + SUPABASE_ANON_KEY/PUBLISHABLE_KEY).');
  }
  return { url, key };
}

export function hasServerSupabaseEnv(): boolean {
  try {
    const env = getServerSupabaseEnv();
    return Boolean(env.url && env.key);
  } catch {
    return false;
  }
}

export function createAuthedSupabaseClient(accessToken: string) {
  const { url, key } = getServerSupabaseEnv();
  return createClient<Database>(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

