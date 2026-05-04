/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import type { Child } from '../src/types';
import { buildRequestContext } from './_server/context';
import { fail, methodNotAllowed, ok, readBody, readQueryId } from './_server/http';

type Req = Parameters<typeof readBody>[0];
type Res = Parameters<typeof ok>[0];

export default async function handler(req: Req, res: Res) {
  try {
    const { userId, repo } = await buildRequestContext(req);
    switch (req.method) {
      case 'GET': {
        const data = await repo.listChildren(userId);
        return ok(res, data);
      }
      case 'POST': {
        const child = readBody<Child>(req);
        const data = await repo.createChild(userId, child);
        return ok(res, data, 201);
      }
      case 'PUT': {
        const child = readBody<Child>(req);
        const data = await repo.updateChild(userId, child);
        return ok(res, data);
      }
      case 'DELETE': {
        const id = readQueryId(req);
        if (!id) return fail(res, 400, 'VALIDATION_ERROR', 'Missing id.');
        await repo.deleteChild(userId, id);
        return ok(res, undefined);
      }
      default:
        return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Request failed.';
    const unauthorized = msg === 'Unauthorized.' || msg === 'Missing bearer token.';
    return fail(res, unauthorized ? 401 : 500, unauthorized ? 'UNAUTHORIZED' : 'INTERNAL_ERROR', msg);
  }
}

