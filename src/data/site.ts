export const site = {
  name: "Glamping Loch Lomond",
  legalName: "Ballagan Farm Glamping Pods",
  tagline: "Two pods, one farm, Scotland's first National Park on the doorstep.",
  phone: "07731 989987",
  phoneHref: "tel:+447731989987",
  email: "info@glampinglochlomond.co.uk",
  address: {
    line1: "Ballagan Farm",
    line2: "Gartocharn",
    region: "Loch Lomond",
    postcode: "G83 8SB",
    country: "Scotland",
  },
  // `||` (not `??`) on purpose — Vercel project settings can have this env var
  // present but set to an empty string, which `??` would treat as "set".
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.glampinglochlomond.co.uk",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const nav = [
  { label: "The pods", href: "#pods" },
  { label: "Inside", href: "#inside" },
  { label: "BBQ hut", href: "#bbq-hut" },
  { label: "The view", href: "#view" },
  { label: "Nearby", href: "#things-to-do" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * InnStyle booking identifiers.
 * These map 1:1 to the live booking engine — do not change without
 * confirming the bookable_id in InnStyle first.
 */
export const DEFAULT_RATE_TYPE_ID = "70916";

export type PodTheme = "rose" | "thistle";

export type Pod = {
  slug: PodTheme;
  name: string;
  tagline: string;
  bookableId: string;
  rateTypeId: string;
  sleeps: number;
  description: string;
  features: string[];
  highlight?: string;
};

export const pods: Pod[] = [
  {
    slug: "rose",
    name: "The Rose Pod",
    tagline: "The one with the BBQ hut",
    bookableId: "75351",
    rateTypeId: DEFAULT_RATE_TYPE_ID,
    sleeps: 4,
    description:
      "The Rose Pod has sole access to our Scandinavian BBQ hut, so you can cook outdoors whatever the sky is doing. Inside the pod it's the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.",
    features: [
      "Exclusive use of the BBQ hut (addable to your stay)",
      "Double bed plus double pull-out sofa bed",
      "En-suite with walk-in shower",
      "Electric frying pan, kettle and toaster",
      "South-facing decking",
    ],
    highlight: "BBQ hut available",
  },
  {
    slug: "thistle",
    name: "The Thistle Pod",
    tagline: "The one with the hot tub and sauna",
    bookableId: "75350",
    rateTypeId: DEFAULT_RATE_TYPE_ID,
    sleeps: 4,
    description:
      "The Thistle Pod has its own hot tub and sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it. Inside it's the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.",
    features: [
      "Own hot tub and exclusive access to the sauna",
      "Double bed plus double pull-out sofa bed",
      "En-suite with walk-in shower",
      "Two-ring cooker top, air fryer, kettle and toaster",
      "South-facing decking",
    ],
    highlight: "Hot tub & sauna included",
  },
];

export const podBySlug = (slug: string) => pods.find((p) => p.slug === slug);
