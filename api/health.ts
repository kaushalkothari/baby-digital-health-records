/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { hasServerSupabaseEnv } from './_server/supabase';
import { methodNotAllowed, ok } from './_server/http';

type Req = { method?: string };
type Res = Parameters<typeof ok>[0];

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  return ok(res, {
    status: 'ok',
    supabaseConfigured: hasServerSupabaseEnv(),
    timestamp: new Date().toISOString(),
  });
}

