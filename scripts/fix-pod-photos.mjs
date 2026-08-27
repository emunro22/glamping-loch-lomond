/**
 * Correction pass after client feedback on the 2026-08-26/27 photo batches:
 *
 * 1. The grey/blue-toned room (robes on an antler hook, TV corner, sofa bed,
 *    the gravel patio with the live-edge bench) is the ROSE pod, not
 *    Thistle. The sage-green bedroom is THISTLE, not Rose.
 * 2. Both pods turn out to have their own hot tub, set up differently (Rose:
 *    open sky with an umbrella; Thistle: under a covered gazebo) — not one
 *    tub photographed twice. Recategorise the existing hot-tub photos
 *    per-pod and upload the new batch that confirms it by filename.
 *
 *   node scripts/fix-pod-photos.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

try {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
  const envText = readFileSync(envPath, "utf8");
  for (const line of envText.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
} catch {
  // rely on real env vars
}

const dbUrl = process.env.DATABASE_URL;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!dbUrl || !blobToken) {
  console.error("DATABASE_URL / BLOB_READ_WRITE_TOKEN not set.");
  process.exit(1);
}

const sql = neon(dbUrl);
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

console.log("Step 1: recategorise existing gallery rows\n");

/** pathname -> new category */
const recategorise = [
  // The grey/blue room — was mistagged thistle, is actually Rose.
  ["thistle-pod-robes.jpg", "rose"],
  ["thistle-pod-bedroom.jpg", "rose"],
  ["thistle-pod-tv-corner.jpg", "rose"],
  ["thistle-pod-living-area.jpg", "rose"],
  ["thistle-pod-highland-cow-cushion.jpg", "rose"],
  ["thistle-pod-towels.jpg", "rose"],
  ["thistle-pod-welcome-pack.jpg", "rose"],
  ["thistle-pod-deck-and-view.jpg", "rose"],
  // The sage-green bedroom — was mistagged rose, is actually Thistle.
  ["rose-pod-bedroom.jpg", "thistle"],
  // Hot tub photos, split per pod instead of one shared "hot tub" bucket.
  ["hot-tub-open-sky.jpg", "rose hot tub"],
  ["hot-tub-privacy-screen.jpg", "rose hot tub"],
  ["hot-tub-with-loungers.jpg", "rose hot tub"],
  ["hot-tub-under-gazebo.jpg", "thistle hot tub"],
  ["hot-tub-jets.jpg", "thistle hot tub"],
  // Legacy fallback hot-tub photos (from src/data/media.ts, seeded pre-batch) —
  // both show the covered/gazebo tub, so they're Thistle's.
  ["1000018196.jpg", "thistle hot tub"],
  ["14140.jpg", "thistle hot tub"],
];

for (const [pathname, category] of recategorise) {
  const rows = await sql`
    UPDATE gallery SET category = ${category}
    WHERE pathname = ${pathname} OR pathname LIKE ${"%/" + pathname}
    RETURNING id
  `;
  console.log(`  ${rows.length ? "ok  " : "skip"} ${pathname} -> ${category}${rows.length ? "" : " (not found)"}`);
}

console.log("\nStep 2: upload the new hot-tub / patio batch\n");

const contentTypeByExt = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

const newPhotos = [
  { file: "rose-pod-hot-tub-1.jpg", category: "rose hot tub", alt: "The Rose Pod's hot tub with the umbrella and chiminea on the patio" },
  { file: "rose-pod-hot-tub-2.jpg", category: "rose hot tub", alt: "The Rose Pod hot tub screened by young hedging and timber fencing" },
  { file: "rose-pod-patio-chiminea.jpg", category: "rose", alt: "The Rose Pod's patio with a chiminea, live-edge bench and farmland view" },
  { file: "thistle-pod-hot-tub-1.jpg", category: "thistle hot tub", alt: "The Thistle Pod hot tub under its gazebo, with rattan seating alongside" },
  { file: "thistle-pod-hot-tub-2.jpg", category: "thistle hot tub", alt: "Jets arcing across the Thistle Pod hot tub under the gazebo" },
  { file: "thistle-pod-hot-tub-3.jpg", category: "thistle hot tub", alt: "The Thistle Pod hot tub and gazebo, with the second pod behind" },
  { file: "thistle-pod-hot-tub-4.jpg", category: "thistle hot tub", alt: "Water jets arcing across the Thistle Pod hot tub" },
];

const [{ next }] = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM gallery`;
let order = Number(next);

for (const { file, category, alt } of newPhotos) {
  const filePath = path.join(publicDir, file);
  if (!existsSync(filePath)) {
    console.error("  missing file:", file);
    continue;
  }

  const [existing] = await sql`SELECT id FROM gallery WHERE pathname = ${file}`;
  if (existing) {
    console.log("  skip", file, "(already in gallery)");
    continue;
  }

  const ext = path.extname(file).toLowerCase();
  const bytes = readFileSync(filePath);
  const blob = await put(file, bytes, {
    access: "public",
    addRandomSuffix: false,
    contentType: contentTypeByExt[ext] ?? "application/octet-stream",
    token: blobToken,
  });

  await sql`
    INSERT INTO gallery (url, pathname, alt, category, sort_order)
    VALUES (${blob.url}, ${file}, ${alt}, ${category}, ${order})
  `;
  console.log("  ok  ", file, "->", category);
  order += 1;
}

console.log("\nStep 3: update pod copy — Rose now has its own hot tub too\n");

await sql`
  UPDATE pods SET
    description = 'The Rose Pod has its own hot tub right on the decking, open to the sky, plus sole access to our Scandinavian BBQ hut, so you can cook outdoors whatever the weather is doing. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.',
    features = '["Own hot tub, open-air on the decking","Exclusive use of the BBQ hut (addable to your stay)","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Electric frying pan, kettle and toaster","Dog friendly, with farm walks from the door"]'::jsonb,
    updated_at = now()
  WHERE slug = 'rose'
`;

await sql`
  UPDATE pods SET
    tagline = 'The one with the sauna',
    description = 'The Thistle Pod has its own hot tub, set under a covered gazebo, and sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.',
    features = '["Own hot tub under a covered gazebo","Exclusive access to the barrel sauna","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Two-ring cooker top, air fryer, kettle and toaster","Dog friendly, with farm walks from the door"]'::jsonb,
    updated_at = now()
  WHERE slug = 'thistle'
`;
console.log("  ok   pods.rose, pods.thistle");

await sql`
  UPDATE site_content SET
    body = 'Both pods have their own hot tub, set up a little differently — the Rose Pod''s sits open under the sky, the Thistle Pod''s under a covered gazebo. The Thistle Pod also has sole access to our Scandinavian barrel sauna.',
    updated_at = now()
  WHERE key = 'extras'
`;
console.log("  ok   site_content.extras");

console.log("\nDone.");
