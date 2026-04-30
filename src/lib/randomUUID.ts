/**
 * `crypto.randomUUID()` is not available in some environments:
 * - HTTP (insecure) contexts
 * - Older browsers / webviews
 *
 * We still need stable client-generated IDs for offline-first records.
 */
export function randomUUID(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && 'randomUUID' in c && typeof (c as Crypto & { randomUUID: () => string }).randomUUID === 'function') {
    return (c as Crypto & { randomUUID: () => string }).randomUUID();
  }

  // RFC 4122 v4 fallback using crypto.getRandomValues where available.
  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Last resort: Math.random (not cryptographically strong, but unique-enough for local IDs).
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${s4()}${s4()}-${s4()}-4${s4().slice(1)}-${((8 + Math.random() * 4) | 0).toString(16)}${s4().slice(1)}-${s4()}${s4()}${s4()}`;
}

