/**
 * Static photo library sorted by subject. Used as the fallback source for
 * the homepage, pod pages and gallery when the database has no override —
 * see src/lib/pods.ts and src/lib/gallery.ts.
 */

export type Photo = { src: string; alt: string };

export const exteriorPhotos: Photo[] = [
  { src: "/1000008532.jpg", alt: "A glamping pod on a bright day, with the barrel sauna behind it" },
  { src: "/1000018229.jpg", alt: "A pod at dusk with the hot tub and loungers out on the deck" },
  { src: "/14136.jpg", alt: "Pod decking in the sun, with a bistro table and chairs" },
  { src: "/12536.jpg", alt: "The curved roof of a pod, with cattle grazing in the field beyond" },
  { src: "/img-20260517-wa0011.jpg", alt: "The patio with a chiminea and farmland views, a pod in the background" },
];

export const insidePhotos: Photo[] = [
  { src: "/12527.jpg", alt: "Inside a pod: the kitchen, dining table, sofa and TV corner" },
  { src: "/1000008564.jpg", alt: "Inside a pod: the kitchen, storage box, sofa bed and en-suite door" },
  { src: "/1000018212.jpg", alt: "The sofa and wall-mounted TV inside a pod" },
  { src: "/14137.jpg", alt: "The kitchenette counter with air fryer, kettle and sink" },
  { src: "/1000008569.jpg", alt: "Cushions on the pull-out sofa bed" },
  { src: "/1000008558.jpg", alt: "Mugs on the kitchen counter, with the countryside view through the doors" },
];

export const bbqHutPhotos: Photo[] = [
  { src: "/1000021721.jpg", alt: "The central charcoal grill inside the Scandinavian-style BBQ hut" },
];

export const hotTubPhotos: Photo[] = [
  { src: "/1000018196.jpg", alt: "The hot tub, bubbling, with open farmland behind it" },
  { src: "/14140.jpg", alt: "Bench seating beside the hot tub on the patio" },
];

export const saunaPhotos: Photo[] = [
  { src: "/1000018200.jpg", alt: "Inside the barrel sauna: the wood-fired heater and stones" },
];

export const viewPhotos: Photo[] = [
  { src: "/1000018233.jpg", alt: "Evening light over the farmland surrounding Ballagan Farm" },
  { src: "/1000008597.jpg", alt: "Coffee on the decking table, looking out over open fields" },
];

export const nearbyPhotos: Photo[] = [
  { src: "/cobbler.jpg", alt: "The view over Loch Lomond and its islands from The Cobbler" },
  { src: "/winnyhill.jpg", alt: "The gate into Whinny Hill Wood, a Woodland Trust Scotland site" },
];

export const heroPhoto = exteriorPhotos[0];

/** One representative exterior photo per pod, so the two cards don't repeat. */
export const podHeroPhoto: Record<string, Photo> = {
  rose: exteriorPhotos[0],
  thistle: exteriorPhotos[2],
};

export const logo = { src: "/logo.jpeg", alt: "Ballagan Farm Glamping Pods" };
