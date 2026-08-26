/**
 * One-shot copy update: lengthens the pod descriptions/features and a few
 * homepage content blocks with detail grounded in the 2026-08-26 photo batch
 * (panel heater, TV corner, BBQ hut fairy lights and tableware, grazing
 * stock), and adds the 'nearby' content key for the new /whats-nearby page.
 *
 *   node scripts/update-copy.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
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

const sql = neon(process.env.DATABASE_URL);

await sql`
  UPDATE pods SET
    description = 'The Rose Pod has sole access to our Scandinavian BBQ hut, so you can cook outdoors whatever the sky is doing — even a rainy Highland evening feels like an adventure with the charcoal going and a roof overhead. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower. Step outside and you are straight onto your own south-facing decking, looking out over the fields we still work as a family.',
    features = '["Exclusive use of the BBQ hut (addable to your stay)","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Electric frying pan, kettle and toaster","South-facing decking","Dog friendly, with farm walks from the door"]'::jsonb,
    updated_at = now()
  WHERE slug = 'rose'
`;

await sql`
  UPDATE pods SET
    description = 'The Thistle Pod has its own hot tub and sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it — book a stay here and the hardest decision most evenings is hot tub or sauna first. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower. The tub is up to temperature and waiting before you arrive, so you can be in it within minutes of pulling up.',
    features = '["Own hot tub and exclusive access to the sauna","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Two-ring cooker top, air fryer, kettle and toaster","South-facing decking","Dog friendly, with farm walks from the door"]'::jsonb,
    updated_at = now()
  WHERE slug = 'thistle'
`;

const contentUpdates = [
  {
    key: "pod",
    body: "All pods have their own electricity and water supply. Fully furnished, with a double bed and a double pull-out sofa bed. Each pod has an en-suite bathroom with a walk-in shower. Each one is lined in warm timber from floor to curved ceiling, with an electric panel heater to keep the chill off, so they are just as cosy on a wet October evening as they are in July.",
  },
  {
    key: "inside",
    body: "The kitchen comes with everything you need: an air fryer, kettle and toaster, plus a two-ring cooker top in the Thistle Pod or an electric frying pan in the Rose Pod. All crockery and utensils are supplied in each pod. Bedding, towels, robes and slippers are included in your stay. There is a flat-screen TV in the corner for a lazy evening in, and a proper dining table if you would rather sit down to eat than balance a plate on your knee.",
  },
  {
    key: "bbq",
    body: "A Scandinavian-inspired BBQ hut, available exclusively to the Rose Pod. A central charcoal grill with a built-in chimney sits under a circular wooden dining table, with cushioned bench seating around the edge. To the rear you will find a prep area with a fridge and all the cooking tools you need. It is a proper wooden hut with fairy lights strung along the beams, big enough for the whole party to gather round the fire while dinner cooks — plates, glasses and condiments are all provided, so all you need to bring is the food.",
  },
  {
    key: "extras",
    body: "A private hot tub and a Scandinavian-style barrel sauna, both exclusive to the Thistle Pod. Both sit out on the decking with the same open farmland view as the rest of the pod, and the tub is topped up and ready to go before you arrive — towels and robes are provided, so all you need to bring is yourself.",
  },
  {
    key: "view",
    body: "You are right out in the great outdoors. Situated in a rural setting, the pods face south so you can make the most of the sun in the beautiful Scottish countryside. Ballagan Farm still runs sheep and cattle in the fields around the pods, so do not be surprised to wake up to them grazing just beyond the fence — it is about as far from a caravan park as glamping gets.",
  },
];

for (const { key, body } of contentUpdates) {
  await sql`UPDATE site_content SET body = ${body}, updated_at = now() WHERE key = ${key}`;
  console.log("  ok   updated", key);
}

await sql`
  INSERT INTO site_content (key, heading, body)
  VALUES (
    'nearby',
    'Explore beyond the farm gate',
    'Ballagan Farm sits inside Loch Lomond and The Trossachs, Scotland''s first National Park, so you are never more than half an hour from a loch shore, a hill walk or a proper Highland view. Here is what is worth the drive, and how long it actually takes to get there.'
  )
  ON CONFLICT (key) DO UPDATE SET heading = EXCLUDED.heading, body = EXCLUDED.body, updated_at = now()
`;
console.log("  ok   added nearby content key");

console.log("\nCopy update complete.");
