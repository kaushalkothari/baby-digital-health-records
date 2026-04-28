/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './config';
import type { Database } from './database.types';

let browserClient: SupabaseClient<Database> | null = null;

/** Single browser client (publishable or legacy anon key). */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  if (!env) return null;
  if (!browserClient) {
    browserClient = createClient<Database>(env.url, env.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}
