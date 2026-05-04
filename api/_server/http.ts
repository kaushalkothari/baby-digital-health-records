/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import type { ApiErrorCode, ApiResponse } from '../../src/lib/api/contracts';

export type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type ResponseLike = {
  status: (statusCode: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export function sendJson<T>(res: ResponseLike, status: number, payload: ApiResponse<T>): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(payload);
}

export function ok<T>(res: ResponseLike, data: T, status = 200): void {
  sendJson(res, status, { ok: true, data });
}

export function fail(
  res: ResponseLike,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): void {
  sendJson(res, status, { ok: false, error: { code, message, details } });
}

export function methodNotAllowed(res: ResponseLike, allow: string[]): void {
  res.setHeader('Allow', allow.join(', '));
  fail(res, 405, 'VALIDATION_ERROR', 'Method not allowed.');
}

export function readAuthBearer(req: RequestLike): string | null {
  const h = req.headers?.authorization;
  const v = Array.isArray(h) ? h[0] : h;
  if (!v || !v.startsWith('Bearer ')) return null;
  const token = v.slice('Bearer '.length).trim();
  return token || null;
}

export function readQueryId(req: RequestLike): string | null {
  const raw = req.query?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return id?.trim() || null;
}

export function readBody<T>(req: RequestLike): T {
  const raw = req.body;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return {} as T;
    }
  }
  return (raw ?? {}) as T;
}

