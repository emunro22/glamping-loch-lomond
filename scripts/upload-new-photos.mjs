/**
 * One-shot upload for the 2026-08-26 photo batch (Rose/Thistle pod interiors,
 * the second hot tub angle, and the BBQ hut in use). Reads each file from
 * /public, uploads it to Vercel Blob, and inserts a row in `gallery` —
 * skipping any pathname that's already there, so it's safe to re-run.
 *
 *   node scripts/upload-new-photos.mjs
 *
 * Requires DATABASE_URL and BLOB_READ_WRITE_TOKEN (both already in .env.local).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

// Load .env.local manually (no next/dotenv available outside the app).
try {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
  const envText = readFileSync(envPath, "utf8");
  for (const line of envText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env.local not found — fall through, rely on real env vars.
}

const dbUrl = process.env.DATABASE_URL;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!dbUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
if (!blobToken) {
  console.error("BLOB_READ_WRITE_TOKEN is not set.");
  process.exit(1);
}

const sql = neon(dbUrl);
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const contentTypeByExt = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

/** file (relative to /public) -> { category, alt } */
const photos = [
  { file: "thistle-pod-deck-and-view.jpg", category: "thistle", alt: "The Thistle Pod's deck with a live-edge oak bench, looking out over the farm" },
  { file: "hot-tub-open-sky.jpg", category: "hot tub", alt: "The Thistle Pod hot tub bubbling under an open sky, farmland behind" },
  { file: "hot-tub-privacy-screen.jpg", category: "hot tub", alt: "The Thistle Pod hot tub screened by young hedging and timber fencing" },
  { file: "hot-tub-with-loungers.jpg", category: "hot tub", alt: "The Thistle Pod hot tub with wooden loungers and a chiminea alongside" },
  { file: "thistle-pod-bedroom.jpg", category: "thistle", alt: "Inside the Thistle Pod: the double bed under the curved timber ceiling" },
  { file: "thistle-pod-robes.jpg", category: "thistle", alt: "Waffle robes hung on an antler hook in the Thistle Pod" },
  { file: "thistle-pod-tv-corner.jpg", category: "thistle", alt: "The wall-mounted TV and side table in the Thistle Pod" },
  { file: "thistle-pod-living-area.jpg", category: "thistle", alt: "The Thistle Pod's sofa bed, with the double bed beyond" },
  { file: "thistle-pod-decking.jpg", category: "thistle", alt: "The Thistle Pod's composite decking and entrance" },
  { file: "hot-tub-under-gazebo.jpg", category: "hot tub", alt: "The Thistle Pod hot tub under its covered gazebo, farmland beyond" },
  { file: "hot-tub-jets.jpg", category: "hot tub", alt: "Jets bubbling in the Thistle Pod hot tub" },
  { file: "thistle-pod-welcome-pack.jpg", category: "thistle", alt: "A welcome pack of Ballagan Farm coasters, cups and a guest folder" },
  { file: "thistle-pod-highland-cow-cushion.jpg", category: "thistle", alt: "A Highland cow cushion on the Thistle Pod sofa" },
  { file: "thistle-pod-towels.jpg", category: "thistle", alt: "Folded towels and a mirror in the Thistle Pod" },
  { file: "rose-pod-bedroom.jpg", category: "rose", alt: "Inside the Rose Pod: the double bed with sage green furnishings" },
  { file: "bbq-hut-prep-area.jpg", category: "bbq hut", alt: "Inside the BBQ hut: the prep counter, ready for a cookout" },
  { file: "bbq-hut-grilling.jpg", category: "bbq hut", alt: "Burgers cooking on the BBQ hut's charcoal grill" },
  { file: "bbq-hut-steaks-and-skewers.jpg", category: "bbq hut", alt: "Steaks and skewers grilling in the BBQ hut" },
];

let order = 0;
const [{ next }] = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM gallery`;
order = Number(next);

let uploaded = 0;
let skipped = 0;

for (const { file, category, alt } of photos) {
  const filePath = path.join(publicDir, file);
  if (!existsSync(filePath)) {
    console.error("  missing file:", file);
    continue;
  }

  const [existing] = await sql`SELECT id FROM gallery WHERE pathname = ${file}`;
  if (existing) {
    console.log("  skip", file, "(already in gallery)");
    skipped += 1;
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
  uploaded += 1;
}

console.log(`\nDone. ${uploaded} uploaded, ${skipped} already present.`);
