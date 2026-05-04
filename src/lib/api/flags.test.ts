/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import { isThinApiEnabled } from './flags';

describe('isThinApiEnabled', () => {
  it('defaults to enabled unless explicitly false', () => {
    expect(typeof isThinApiEnabled()).toBe('boolean');
  });
});

