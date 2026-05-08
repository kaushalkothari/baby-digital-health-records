/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import CryptoJS from 'crypto-js';

const KEY_STORAGE = 'bb:local-encryption-key:v1';
const PREFIX = 'bbenc:v1:';

function base64FromBytes(bytes: Uint8Array): string {
  // btoa expects binary string
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function getOrCreateKey(): string {
  try {
    const existing = localStorage.getItem(KEY_STORAGE);
    if (existing && existing.length >= 32) return existing;
  } catch {
    // ignore
  }
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const key = base64FromBytes(bytes);
  try {
    localStorage.setItem(KEY_STORAGE, key);
  } catch {
    // ignore
  }
  return key;
}

export function encryptLocalValue(plaintext: string): string {
  const key = getOrCreateKey();
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
  return `${PREFIX}${ciphertext}`;
}

export function decryptLocalValue(maybeEncrypted: string): string | null {
  if (!maybeEncrypted.startsWith(PREFIX)) return null;
  const key = getOrCreateKey();
  const payload = maybeEncrypted.slice(PREFIX.length);
  try {
    const bytes = CryptoJS.AES.decrypt(payload, key);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext || null;
  } catch {
    return null;
  }
}

export function shouldEncryptStorageKey(key: string): boolean {
  // Encrypt app data persisted for offline mode + drafts.
  return key.startsWith('baby-tracker-') || key.startsWith('babybloom-billing-draft:');
}

