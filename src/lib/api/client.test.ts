/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { describe, expect, it, vi } from 'vitest';
import { ThinApiClient } from './client';

describe('ThinApiClient', () => {
  it('sends auth header and returns typed data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const api = new ThinApiClient('/api', () => 'token-123');
    const children = await api.listChildren();

    expect(children).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/children',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      }),
    );
    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('throws API message when backend returns failure payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            error: { code: 'VALIDATION_ERROR', message: 'Bad request' },
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    const api = new ThinApiClient('/api', () => 'token-123');
    await expect(api.listBilling()).rejects.toThrow('Bad request');
  });

  it('fails fast when access token is missing', async () => {
    const api = new ThinApiClient('/api', () => null);
    await expect(api.listVisits()).rejects.toThrow('Not authenticated.');
  });
});

