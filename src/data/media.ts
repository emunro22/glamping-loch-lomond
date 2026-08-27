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
  { src: "/bbq-hut-prep-area.jpg", alt: "Inside the BBQ hut: the prep counter, ready for a cookout" },
  { src: "/bbq-hut-grilling.jpg", alt: "Burgers cooking on the BBQ hut's charcoal grill" },
  { src: "/bbq-hut-steaks-and-skewers.jpg", alt: "Steaks and skewers grilling in the BBQ hut" },
];

/** Rose has its own hot tub, open to the sky. */
export const roseHotTubPhotos: Photo[] = [
  { src: "/hot-tub-open-sky.jpg", alt: "The Rose Pod hot tub bubbling under an open sky, farmland behind" },
  { src: "/hot-tub-privacy-screen.jpg", alt: "The Rose Pod hot tub screened by young hedging and timber fencing" },
  { src: "/hot-tub-with-loungers.jpg", alt: "The Rose Pod hot tub with wooden loungers and a chiminea alongside" },
  { src: "/rose-pod-hot-tub-1.jpg", alt: "The Rose Pod's hot tub with the umbrella and chiminea on the patio" },
];

/** Thistle has its own hot tub, set under a covered gazebo. */
export const thistleHotTubPhotos: Photo[] = [
  { src: "/1000018196.jpg", alt: "The Thistle Pod hot tub, bubbling, with open farmland behind it" },
  { src: "/14140.jpg", alt: "Bench seating beside the Thistle Pod hot tub on the patio" },
  { src: "/hot-tub-under-gazebo.jpg", alt: "The Thistle Pod hot tub under its covered gazebo, farmland beyond" },
  { src: "/hot-tub-jets.jpg", alt: "Jets bubbling in the Thistle Pod hot tub" },
  { src: "/thistle-pod-hot-tub-1.jpg", alt: "The Thistle Pod hot tub under its gazebo, with rattan seating alongside" },
  { src: "/thistle-pod-hot-tub-2.jpg", alt: "Jets arcing across the Thistle Pod hot tub under the gazebo" },
  { src: "/thistle-pod-hot-tub-3.jpg", alt: "The Thistle Pod hot tub and gazebo, with the second pod behind" },
  { src: "/thistle-pod-hot-tub-4.jpg", alt: "Water jets arcing across the Thistle Pod hot tub" },
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

/** Photos specific to each named pod — its own bedroom, living area and small details. */
export const rosePodPhotos: Photo[] = [
  { src: "/rose-pod-patio-chiminea.jpg", alt: "The Rose Pod's patio with a chiminea, live-edge bench and farmland view" },
  { src: "/thistle-pod-bedroom.jpg", alt: "Inside the Rose Pod: the double bed under the curved timber ceiling" },
  { src: "/thistle-pod-robes.jpg", alt: "Waffle robes hung on an antler hook in the Rose Pod" },
  { src: "/thistle-pod-tv-corner.jpg", alt: "The wall-mounted TV and side table in the Rose Pod" },
  { src: "/thistle-pod-living-area.jpg", alt: "The Rose Pod's sofa bed, with the double bed beyond" },
  { src: "/thistle-pod-welcome-pack.jpg", alt: "A welcome pack of Ballagan Farm coasters, cups and a guest folder" },
  { src: "/thistle-pod-highland-cow-cushion.jpg", alt: "A Highland cow cushion on the Rose Pod sofa" },
  { src: "/thistle-pod-towels.jpg", alt: "Folded towels and a mirror in the Rose Pod" },
];

export const thistlePodPhotos: Photo[] = [
  { src: "/rose-pod-bedroom.jpg", alt: "Inside the Thistle Pod: the double bed with sage green furnishings" },
  { src: "/thistle-pod-decking.jpg", alt: "The Thistle Pod's composite decking and entrance" },
];

export const heroPhoto = exteriorPhotos[0];

/** One representative exterior photo per pod, so the two cards don't repeat. */
export const podHeroPhoto: Record<string, Photo> = {
  rose: rosePodPhotos[0],
  thistle: exteriorPhotos[0],
};

export const logo = { src: "/logo.jpeg", alt: "Ballagan Farm Glamping Pods" };
