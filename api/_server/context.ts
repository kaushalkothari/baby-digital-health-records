/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { createAuthedSupabaseClient } from './supabase';
import { readAuthBearer } from './http';
import { SupabaseDomainRepository } from './supabase-domain-repository';

type RequestLike = {
  headers?: Record<string, string | string[] | undefined>;
};

export async function buildRequestContext(req: RequestLike): Promise<{
  userId: string;
  repo: SupabaseDomainRepository;
}> {
  const token = readAuthBearer(req);
  if (!token) throw new Error('Missing bearer token.');
  const client = createAuthedSupabaseClient(token);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user?.id) throw new Error('Unauthorized.');
  return {
    userId: data.user.id,
    repo: new SupabaseDomainRepository(client),
  };
}

