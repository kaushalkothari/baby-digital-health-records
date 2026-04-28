/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

/** Prefer publishable key (`sb_publishable_...`); legacy anon JWT still supported. */
function getSupabasePublicKey(): string {
  const publishable = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (publishable) return publishable;
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';
}

/** Central Supabase env checks — use before creating the client. */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = getSupabasePublicKey();
  return Boolean(url && key);
}

/** URL + client-safe API key for `createClient` (publishable or legacy anon). */
export function getSupabaseEnv(): { url: string; supabaseKey: string } | null {
  if (!isSupabaseConfigured()) return null;
  const url = import.meta.env.VITE_SUPABASE_URL!.trim();
  if (import.meta.env.PROD) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:') {
        console.warn(
          '[BabyBloom] Use HTTPS for VITE_SUPABASE_URL in production to protect API traffic.',
        );
      }
    } catch {
      /* ignore */
    }
  }
  return {
    url,
    supabaseKey: getSupabasePublicKey(),
  };
}
