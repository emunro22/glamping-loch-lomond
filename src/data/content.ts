/** Static copy used when the database has no override yet for a given content key. */
export const fallbackContent: Record<string, { heading: string; body: string }> = {
  hero: {
    heading: "Wake up in Scotland's first National Park",
    body: "Two glamping pods on a working family farm at Loch Lomond. South-facing, properly warm, and yours from check-in to checkout.",
  },
  about: {
    heading: "Three generations, one farm",
    body: "Tucked away on our family-run Ballagan Farm, our glamping pods offer a warm, welcoming escape in the heart of one of Scotland's most stunning landscapes. With three generations living and working on the farm, Glamping Loch Lomond is truly a labour of love, and every detail reflects that.",
  },
  pod: {
    heading: "The pod",
    body: "All pods have their own electricity and water supply. Fully furnished, with a double bed and a double pull-out sofa bed. Each pod has an en-suite bathroom with a walk-in shower.",
  },
  inside: {
    heading: "Inside the pod",
    body: "The kitchen comes with everything you need: a two-ring cooker top, air fryer, kettle and toaster. All crockery and utensils are supplied in each pod. Bedding, towels, robes and slippers are included in your stay.",
  },
  bbq: {
    heading: "The BBQ hut",
    body: "A Scandinavian-inspired BBQ hut, available exclusively to the Rose Pod. A central charcoal grill with a built-in chimney sits under a circular wooden dining table, with cushioned bench seating around the edge. To the rear you'll find a prep area with a fridge and all the cooking tools you need.",
  },
  extras: {
    heading: "Hot tub & sauna",
    body: "A private hot tub session and a Scandinavian-style barrel sauna are both available to add to your stay, whichever pod you're in.",
  },
  view: {
    heading: "The view",
    body: "You are right out in the great outdoors. Situated in a rural setting, the pods face south so you can make the most of the sun in the beautiful Scottish countryside.",
  },
  contact: {
    heading: "Come and stay",
    body: "Questions about dates, the BBQ hut, or bringing the dog? Send us a note and we'll get straight back to you.",
  },
};
