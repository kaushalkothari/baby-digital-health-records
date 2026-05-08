/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { useState, useCallback } from 'react';
import { decryptLocalValue, encryptLocalValue, shouldEncryptStorageKey } from '@/lib/security/localEncryption';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      if (shouldEncryptStorageKey(key)) {
        const decrypted = decryptLocalValue(item);
        if (decrypted != null) return JSON.parse(decrypted) as T;
        // Backward compat: older plaintext values
        return JSON.parse(item) as T;
      }
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    const raw = JSON.stringify(valueToStore);
    const payload = shouldEncryptStorageKey(key) ? encryptLocalValue(raw) : raw;
    window.localStorage.setItem(key, payload);
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
