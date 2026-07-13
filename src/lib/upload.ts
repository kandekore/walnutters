import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB per file (per the brief)

export type SavedFile = { publicPath: string } | null;

/** Persist an uploaded image to /public/uploads and return its public path.
 *  Returns null for empty/oversized/wrong-type files. Throws only on IO errors. */
export async function saveUpload(file: File | null): Promise<SavedFile> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (!ALLOWED.has(file.type)) {
    throw new Error("Only JPEG, PNG or WebP images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Each file must be 5MB or smaller.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return { publicPath: `/uploads/${name}` };
}
