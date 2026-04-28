/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

export { isSupabaseConfigured, getSupabaseEnv } from './config';
export { getSupabaseBrowserClient } from './client';
export type { Database } from './database.types';
export { SupabaseAuthProvider } from './AuthProvider';
export { useSupabaseAuth } from './useSupabaseAuth';
export type { SupabaseAuthContextValue } from './auth-types';
export { ProtectedRoute } from './ProtectedRoute';
export { testSupabaseConnection } from './connection-test';
export type { ConnectionStep, SupabaseConnectionResult } from './connection-test';
