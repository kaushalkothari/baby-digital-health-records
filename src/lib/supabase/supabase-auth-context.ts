/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { createContext } from 'react';
import type { SupabaseAuthContextValue } from './auth-types';

export const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null);
