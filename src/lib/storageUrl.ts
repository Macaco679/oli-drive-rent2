import { supabase } from "@/integrations/supabase/client";

const PUBLIC_URL_MARKER = "/storage/v1/object/public/";

/**
 * Resolves a stored chat/inspection media reference into a working URL.
 *
 * Historically the chat-images and inspection-photos buckets were public
 * and the app stored the full public URL (getPublicUrl) in the database.
 * The buckets are now private, so a stored public URL no longer works
 * directly - it must be exchanged for a short-lived signed URL. This
 * helper accepts either the legacy full public URL or a bare storage
 * path and returns a signed URL valid for `expiresInSeconds`.
 */
export async function resolvePrivateStorageUrl(
  bucket: string,
  refValue: string | null | undefined,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!refValue) return null;

  let path = refValue;

  if (refValue.includes(PUBLIC_URL_MARKER)) {
    const marker = `${PUBLIC_URL_MARKER}${bucket}/`;
    const idx = refValue.indexOf(marker);
    if (idx === -1) return null;
    path = decodeURIComponent(refValue.slice(idx + marker.length).split("?")[0]);
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
    if (error || !data?.signedUrl) {
      console.error(`[storageUrl] Falha ao gerar URL assinada (${bucket}):`, error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error(`[storageUrl] Erro ao resolver URL (${bucket}):`, err);
    return null;
  }
}
