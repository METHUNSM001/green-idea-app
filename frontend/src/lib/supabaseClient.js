import { createClient } from "@supabase/supabase-js";

// This client only ever uses the public anon/publishable key, which is
// safe to ship to the browser (it's what Storage RLS policies exist to
// constrain). Never put the service_role key here - that one belongs on
// the backend only, and is never used by this app anyway since the
// Flask API talks to Postgres directly.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const BUCKET = "equipment-images";

// Uploads a File to the equipment-images bucket and returns its public
// URL. Replaces the old approach of base64-encoding the image and
// stuffing it into the image_url column directly, which silently broke
// (or errored) for any real photo - a data URL for even a small photo
// is tens of KB of text, far past what that column was ever meant to
// hold, whereas a Storage URL is ~100 characters.
export async function uploadEquipmentImage(file) {
  if (!supabase) {
    throw new Error("Image upload isn't configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
  }

  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Image upload failed");

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
