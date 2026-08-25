/**
 * One-shot photo migration: takes the file->blob-url mapping produced by
 * uploading every /public photo to Vercel Blob (see the sibling upload
 * step in the deployment notes) and populates the `gallery` table with
 * them, plus points pod hero images and homepage content blocks at the
 * uploaded copies instead of the static /public files.
 *
 *   DATABASE_URL="postgres://..." BLOB_MAP="/path/to/blob-urls.tsv" node scripts/seed-photos.mjs
 *
 * blob-urls.tsv is tab-separated: filename<TAB>category<TAB>blobUrl
 * Safe to run more than once — existing gallery rows are matched by
 * pathname and skipped.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL;
const mapPath = process.env.BLOB_MAP;
if (!dbUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
if (!mapPath) {
  console.error("BLOB_MAP is not set (path to the file->blob-url TSV).");
  process.exit(1);
}

const sql = neon(dbUrl);

/** file -> alt text, in the same grouping/order as src/data/media.ts */
const altByFile = {
  "1000008532.jpg": "A glamping pod on a bright day, with the barrel sauna behind it",
  "1000018229.jpg": "A pod at dusk with the hot tub and loungers out on the deck",
  "14136.jpg": "Pod decking in the sun, with a bistro table and chairs",
  "12536.jpg": "The curved roof of a pod, with cattle grazing in the field beyond",
  "img-20260517-wa0011.jpg": "The patio with a chiminea and farmland views, a pod in the background",
  "12527.jpg": "Inside a pod: the kitchen, dining table, sofa and TV corner",
  "1000008564.jpg": "Inside a pod: the kitchen, storage box, sofa bed and en-suite door",
  "1000018212.jpg": "The sofa and wall-mounted TV inside a pod",
  "14137.jpg": "The kitchenette counter with air fryer, kettle and sink",
  "1000008569.jpg": "Cushions on the pull-out sofa bed",
  "1000008558.jpg": "Mugs on the kitchen counter, with the countryside view through the doors",
  "1000021721.jpg": "The central charcoal grill inside the Scandinavian-style BBQ hut",
  "1000018196.jpg": "The hot tub, bubbling, with open farmland behind it",
  "14140.jpg": "Bench seating beside the hot tub on the patio",
  "1000018200.jpg": "Inside the barrel sauna: the wood-fired heater and stones",
  "1000018233.jpg": "Evening light over the farmland surrounding Ballagan Farm",
  "1000008597.jpg": "Coffee on the decking table, looking out over open fields",
  "cobbler.jpg": "The view over Loch Lomond and its islands from The Cobbler",
  "winnyhill.jpg": "The gate into Whinny Hill Wood, a Woodland Trust Scotland site",
};

const orderedFiles = [
  "1000008532.jpg",
  "1000018229.jpg",
  "14136.jpg",
  "12536.jpg",
  "img-20260517-wa0011.jpg",
  "12527.jpg",
  "1000008564.jpg",
  "1000018212.jpg",
  "14137.jpg",
  "1000008569.jpg",
  "1000008558.jpg",
  "1000021721.jpg",
  "1000018196.jpg",
  "14140.jpg",
  "1000018200.jpg",
  "1000018233.jpg",
  "1000008597.jpg",
  "cobbler.jpg",
  "winnyhill.jpg",
];

const rows = readFileSync(mapPath, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map((line) => {
    const [file, category, url] = line.split("\t");
    return { file, category, url };
  });

const byFile = new Map(rows.map((r) => [r.file, r]));
const blobByFile = new Map(rows.map((r) => [r.file, r.url]));

let order = 0;
for (const file of orderedFiles) {
  const row = byFile.get(file);
  if (!row) {
    console.error("  missing blob url for", file);
    continue;
  }

  const pathname = new URL(row.url).pathname.slice(1);
  const alt = altByFile[file] ?? "";

  const [existing] = await sql`SELECT id FROM gallery WHERE pathname = ${pathname}`;
  if (existing) {
    console.log("  skip", pathname, "(already in gallery)");
    order += 1;
    continue;
  }

  await sql`
    INSERT INTO gallery (url, pathname, alt, category, sort_order)
    VALUES (${row.url}, ${pathname}, ${alt}, ${row.category}, ${order})
  `;
  console.log("  ok  ", pathname);
  order += 1;
}

// Pod hero images — corrected assignment (Rose = no hot tub/sauna in shot,
// Thistle = the pod with the hot tub + sauna visible).
await sql`UPDATE pods SET hero_image = ${blobByFile.get("14136.jpg")}, updated_at = now() WHERE slug = 'rose'`;
await sql`UPDATE pods SET hero_image = ${blobByFile.get("1000008532.jpg")}, updated_at = now() WHERE slug = 'thistle'`;
console.log("  ok   pods.hero_image (rose, thistle)");

// Homepage content-block images.
const contentImages = {
  hero: "1000008532.jpg",
  pod: "14136.jpg",
  inside: "12527.jpg",
  bbq: "1000021721.jpg",
  view: "1000018233.jpg",
};
for (const [key, file] of Object.entries(contentImages)) {
  await sql`UPDATE site_content SET image_url = ${blobByFile.get(file)}, updated_at = now() WHERE key = ${key}`;
}
console.log("  ok   site_content image_url (hero, pod, inside, bbq, view)");

console.log("\nPhoto migration complete.");
