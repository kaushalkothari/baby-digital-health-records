/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

/**
 * Rollout guard for thin API/BFF path.
 * - `true`: frontend uses `/api/*` thin layer.
 * - `false` (default): fallback to legacy direct Supabase client path.
 */
export function isThinApiEnabled(): boolean {
  return import.meta.env.VITE_USE_THIN_API === 'true';
}

