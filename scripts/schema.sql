-- Glamping Loch Lomond — database schema
-- Run against your Neon / Vercel Postgres database.

CREATE TABLE IF NOT EXISTS gallery (
  id          SERIAL PRIMARY KEY,
  url         TEXT NOT NULL,
  pathname    TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'general',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery (category, sort_order);

CREATE TABLE IF NOT EXISTS pods (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  tagline       TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  features      JSONB NOT NULL DEFAULT '[]'::jsonb,
  bookable_id   TEXT NOT NULL,
  rate_type_id  TEXT NOT NULL DEFAULT '70916',
  hero_image    TEXT,
  sleeps        INTEGER NOT NULL DEFAULT 4,
  price_from    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  heading     TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  image_url   TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  pod         TEXT,
  arrival     DATE,
  departure   DATE,
  guests      INTEGER,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status, created_at DESC);

-- ------------------------------- Seed data --------------------------------

INSERT INTO pods (slug, name, tagline, description, features, bookable_id, rate_type_id, sleeps, sort_order)
VALUES
  ('rose', 'The Rose Pod', 'The one with the BBQ hut',
   'The Rose Pod has sole access to our Scandinavian BBQ hut, so you can cook outdoors whatever the sky is doing. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.',
   '["Exclusive use of the BBQ hut (addable to your stay)","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Electric frying pan, kettle and toaster","South-facing decking"]'::jsonb,
   '75351', '70916', 4, 1),
  ('thistle', 'The Thistle Pod', 'The one with the hot tub and sauna',
   'The Thistle Pod has its own hot tub and sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it. Inside it is the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.',
   '["Own hot tub and exclusive access to the sauna","Double bed plus double pull-out sofa bed","En-suite with walk-in shower","Two-ring cooker top, air fryer, kettle and toaster","South-facing decking"]'::jsonb,
   '75350', '70916', 4, 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_content (key, heading, body) VALUES
  ('hero', 'Wake up in Scotland''s first National Park',
   'Two glamping pods on a working family farm at Loch Lomond. South-facing, properly warm, and yours from check-in to checkout.'),
  ('about', 'Three generations, one farm',
   'Tucked away on our family-run Ballagan Farm, our glamping pods offer a warm, welcoming escape in the heart of one of Scotland''s most stunning landscapes. With three generations living and working on the farm, Glamping Loch Lomond is truly a labour of love, and every detail reflects that.'),
  ('pod', 'The pod',
   'All pods have their own electricity and water supply. Fully furnished, with a double bed and a double pull-out sofa bed. Each pod has an en-suite bathroom with a walk-in shower.'),
  ('inside', 'Inside the pod',
   'The kitchen comes with everything you need: an air fryer, kettle and toaster, plus a two-ring cooker top in the Thistle Pod or an electric frying pan in the Rose Pod. All crockery and utensils are supplied in each pod. Bedding, towels, robes and slippers are included in your stay.'),
  ('bbq', 'The BBQ hut',
   'A Scandinavian-inspired BBQ hut, available exclusively to the Rose Pod. A central charcoal grill with a built-in chimney sits under a circular wooden dining table, with cushioned bench seating around the edge. To the rear you will find a prep area with a fridge and all the cooking tools you need.'),
  ('extras', 'Hot tub & sauna',
   'A private hot tub and a Scandinavian-style barrel sauna, both exclusive to the Thistle Pod.'),
  ('view', 'The view',
   'You are right out in the great outdoors. Situated in a rural setting, the pods face south so you can make the most of the sun in the beautiful Scottish countryside.'),
  ('contact', 'Come and stay',
   'Questions about dates, the BBQ hut, or bringing the dog? Send us a note and we will get straight back to you.')
ON CONFLICT (key) DO NOTHING;
