import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import {
  assertSafeStorageFolder,
  assertSafeStorageObjectPath,
  decodeDataUrlForUpload,
  sanitizeUploadFileName,
} from '@/lib/security/uploads';

export const BABYBLOOM_BUCKET = 'babybloom';

const SIGNED_URL_TTL = 3600;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

/** Extract MIME from a `data:image/png;base64,...` URL; falls back to provided default. */
export function mimeFromDataUrl(dataUrl: string, fallback = 'application/octet-stream'): string {
  const match = dataUrl.match(/^data:([^;,]+)/);
  return match?.[1] || fallback;
}

/** Best-effort extension from a MIME type (e.g. `image/heic` → `.heic`). */
export function extForMime(mime: string): string {
  return MIME_TO_EXT[mime] || '';
}

export async function uploadDataUrl(
  client: SupabaseClient<Database>,
  userId: string,
  childId: string,
  folder: string,
  fileName: string,
  dataUrl: string,
  _fileType: string,
): Promise<{ path: string; size: number; contentType: string }> {
  assertSafeStorageFolder(folder);
  const allowPdf = folder === 'documents';
  const { binary, contentType } = decodeDataUrlForUpload(dataUrl, allowPdf);
  const safe = sanitizeUploadFileName(fileName);
  const path = `${userId}/${childId}/${folder}/${crypto.randomUUID()}-${safe}`;

  const { error } = await client.storage.from(BABYBLOOM_BUCKET).upload(path, binary, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return { path, size: binary.length, contentType };
}

export async function getSignedUrl(
  client: SupabaseClient<Database>,
  storagePath: string,
): Promise<string> {
  assertSafeStorageObjectPath(storagePath);
  const { data, error } = await client.storage
    .from(BABYBLOOM_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL);
  if (error) throw error;
  return data.signedUrl;
}
