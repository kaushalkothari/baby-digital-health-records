/**
 * Client- and storage-boundary checks for user-provided files (data URLs / picks).
 * Does not replace RLS or server-side policies; reduces malicious type/size abuse.
 */

/** Decoded binary ceiling for Supabase Storage uploads (above UI limits, below abuse). */
export const MAX_STORAGE_DECODED_BYTES = 52 * 1024 * 1024;

/** Match Documents page — remote vs local. */
export const MAX_DOCUMENT_BYTES_REMOTE = 50 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES_LOCAL = 5 * 1024 * 1024;

/** Match Billing / Prescriptions image UI. */
export const MAX_IMAGE_PICK_BYTES = 5 * 1024 * 1024;

const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const DOC_MIMES = new Set([...IMAGE_MIMES, 'application/pdf']);

const STORAGE_FOLDERS = new Set(['documents', 'vaccinations', 'prescriptions', 'billing']);

export function isAllowedUploadMime(mime: string, allowPdf: boolean): boolean {
  const m = mime.trim().toLowerCase();
  if (!m) return false;
  return allowPdf ? DOC_MIMES.has(m) : IMAGE_MIMES.has(m);
}

/** Infer MIME from `File` when the browser leaves `type` empty. */
export function inferPickedFileMime(file: File): string {
  if (file.type?.trim()) return file.type.trim().toLowerCase();
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return '';
}

/**
 * Validate a `File` before reading as data URL (type + size).
 * Returns an error message or `null` if OK.
 */
export function validatePickedFile(
  file: File,
  options: { maxBytes: number; allowPdf: boolean },
): string | null {
  if (file.size <= 0) return 'File is empty.';
  if (file.size > options.maxBytes) {
    const mb = Math.max(1, Math.round(options.maxBytes / (1024 * 1024)));
    return `File too large (max ${mb} MB).`;
  }
  const mime = inferPickedFileMime(file);
  if (!mime || !isAllowedUploadMime(mime, options.allowPdf)) {
    return 'File type not allowed.';
  }
  return null;
}

function base64UrlSafeByteLength(b64: string): number {
  const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
}

/**
 * Light-weight check after FileReader: structure, declared MIME, approximate size.
 * Avoids a second full decode before `uploadDataUrl` runs on the client again.
 */
export function validateClientDataUrl(
  dataUrl: string,
  maxBytes: number,
  options: { allowPdf: boolean },
): string | null {
  if (typeof dataUrl !== 'string') return 'Invalid file data.';
  if (dataUrl.length > maxBytes + 512) {
    // Rough guard: base64 expands ~4/3; header is small.
    if (dataUrl.length > maxBytes * 2 + 10_000) return 'File too large.';
  }
  if (!dataUrl.startsWith('data:')) return 'Invalid file data.';
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return 'Invalid file data.';
  const meta = dataUrl.slice(5, comma);
  if (!meta.includes('base64')) return 'Unsupported file encoding.';
  const mimePart = meta.split(';')[0]?.trim().toLowerCase() ?? '';
  if (!mimePart || !isAllowedUploadMime(mimePart, options.allowPdf)) {
    return 'File type not allowed.';
  }
  const b64 = dataUrl.slice(comma + 1).replace(/\s/g, '');
  if (!b64 || !/^[A-Za-z0-9+/=]+$/.test(b64)) return 'Invalid file data.';
  const approx = base64UrlSafeByteLength(b64);
  if (approx > maxBytes) return 'File too large.';
  if (approx <= 0) return 'File is empty.';
  return null;
}

export function assertSafeStorageFolder(folder: string): void {
  if (!STORAGE_FOLDERS.has(folder)) {
    throw new Error('Invalid upload destination.');
  }
}

/**
 * Decode a base64 data URL for upload. MIME is taken from the data URL header (not caller-supplied).
 */
export function decodeDataUrlForUpload(
  dataUrl: string,
  allowPdf: boolean,
): { binary: Uint8Array; contentType: string } {
  if (typeof dataUrl !== 'string') throw new Error('Invalid file data.');
  if (!dataUrl.startsWith('data:')) throw new Error('Invalid file data.');
  const comma = dataUrl.indexOf(',');
  if (comma < 0) throw new Error('Invalid file data.');
  const meta = dataUrl.slice(5, comma);
  if (!meta.includes('base64')) throw new Error('Unsupported file encoding.');
  const mimePart = meta.split(';')[0]?.trim().toLowerCase() ?? '';
  if (!mimePart || !isAllowedUploadMime(mimePart, allowPdf)) {
    throw new Error('File type not allowed.');
  }
  const b64 = dataUrl.slice(comma + 1).replace(/\s/g, '');
  let binary: Uint8Array;
  try {
    binary = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  } catch {
    throw new Error('Invalid file data.');
  }
  if (binary.length === 0) throw new Error('File is empty.');
  if (binary.length > MAX_STORAGE_DECODED_BYTES) throw new Error('File too large.');
  return { binary, contentType: mimePart };
}

/** Strip path segments and weird characters from a filename used in storage paths. */
export function sanitizeUploadFileName(name: string): string {
  const base = name.replace(/^[\\/]+/, '').split(/[/\\]/).pop() ?? 'file';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
}

/** Reject path traversal / odd keys before signing or fetching storage objects. */
export function assertSafeStorageObjectPath(storagePath: string): void {
  if (!storagePath || typeof storagePath !== 'string') throw new Error('Invalid storage path.');
  if (storagePath.includes('..') || storagePath.includes('\0') || storagePath.startsWith('/')) {
    throw new Error('Invalid storage path.');
  }
}
