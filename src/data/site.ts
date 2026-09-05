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
  // `||` (not `??`) on purpose: Vercel project settings can have this env var
  // present but set to an empty string, which `??` would treat as "set".
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.glampinglochlomond.co.uk",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Pods", href: "/#pods" },
  { label: "Inside", href: "/#inside" },
  { label: "BBQ hut", href: "/bbq-hut" },
  { label: "Hot tub", href: "/hot-tub-sauna" },
  { label: "View", href: "/the-view" },
  { label: "Nearby", href: "/whats-nearby" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * InnStyle booking identifiers.
 * These map 1:1 to the live booking engine. Do not change without
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
      "The Rose Pod has its own hot tub right on the decking, open to the sky, plus sole access to our Scandinavian BBQ hut, so you can cook outdoors whatever the weather is doing. Inside it's the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.",
    features: [
      "Own hot tub, open-air on the decking",
      "Exclusive use of the BBQ hut (addable to your stay)",
      "Double bed plus double pull-out sofa bed",
      "En-suite with walk-in shower",
      "Electric frying pan, kettle and toaster",
      "Dog friendly, with farm walks from the door",
    ],
    highlight: "BBQ hut & hot tub",
  },
  {
    slug: "thistle",
    name: "The Thistle Pod",
    tagline: "The one with the sauna",
    bookableId: "75350",
    rateTypeId: DEFAULT_RATE_TYPE_ID,
    sleeps: 4,
    description:
      "The Thistle Pod has its own hot tub, set under a covered gazebo, and sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it. Inside it's the same story as its twin: a proper double bed, a pull-out sofa bed, and an en-suite with a walk-in shower.",
    features: [
      "Own hot tub under a covered gazebo",
      "Exclusive access to the barrel sauna",
      "Double bed plus double pull-out sofa bed",
      "En-suite with walk-in shower",
      "Two-ring cooker top, air fryer, kettle and toaster",
      "Dog friendly, with farm walks from the door",
    ],
    highlight: "Hot tub & sauna",
  },
];

export const podBySlug = (slug: string) => pods.find((p) => p.slug === slug);
