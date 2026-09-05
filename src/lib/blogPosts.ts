import type { Photo } from "@/data/media";
import {
  exteriorPhotos,
  thistleHotTubPhotos,
  viewPhotos,
  nearbyPhotos,
} from "@/data/media";

export type BlogBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  metaDescription: string;
  /** ISO date string (YYYY-MM-DD). */
  publishDate: string;
  excerpt: string;
  heroImage: Photo;
  body: BlogBodyBlock[];
};

/**
 * Every fact referenced here (pod features, drive times, farm history) already
 * lives in src/data/site.ts, src/data/content.ts or src/components/site/ThingsToDo.tsx.
 * Nothing below is invented: no guest counts, review quotes or founding dates
 * beyond what those files already state.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "rose-pod-or-thistle-pod",
    title: "Rose Pod or Thistle Pod: How to Choose",
    category: "Our pods",
    metaDescription:
      "Both pods at Ballagan Farm sleep four and have their own hot tub. Here's how the Rose Pod and the Thistle Pod actually differ, from the BBQ hut to the barrel sauna.",
    publishDate: "2026-06-08",
    excerpt:
      "Both pods sleep four and come with their own hot tub, so the real choice comes down to what's sitting next to it: a Scandinavian BBQ hut, or a barrel sauna.",
    heroImage: exteriorPhotos[0],
    body: [
      {
        type: "paragraph",
        text: "This is the question we get asked more than any other, and the good news is you can't get it wrong. Both pods at Ballagan Farm sleep four, with a proper double bed and a double pull-out sofa bed, an en-suite with a walk-in shower, and their own electricity and water supply. Where they part ways is what's just outside the door.",
      },
      {
        type: "heading",
        text: "The Rose Pod: BBQ hut and an open-air hot tub",
      },
      {
        type: "paragraph",
        text: "The Rose Pod's hot tub sits right out on its own decking, open to the sky, with an umbrella and a chiminea alongside for the evenings when the weather isn't quite playing along. It also comes with exclusive use of our Scandinavian-style BBQ hut: a central charcoal grill with a built-in chimney, a circular dining table, cushioned bench seating for the whole party, and a prep area with a fridge and all the cooking tools you need. Inside, the kitchen has an electric frying pan alongside the kettle and toaster.",
      },
      {
        type: "heading",
        text: "The Thistle Pod: a barrel sauna and a gazebo-covered hot tub",
      },
      {
        type: "paragraph",
        text: "The Thistle Pod's hot tub is set under a covered gazebo with rattan seating beside it, so it's ready to use whatever the forecast says. The Thistle Pod also has sole access to our Scandinavian barrel sauna, tucked into a quiet corner with an uninterrupted run of countryside in front of it. Its kitchen swaps the frying pan for a two-ring cooker top and an air fryer.",
      },
      {
        type: "heading",
        text: "So which one's for you?",
      },
      {
        type: "paragraph",
        text: "If the appeal is cooking outdoors over charcoal with everyone gathered round while dinner spits and crackles, that's the Rose Pod. If you'd rather finish the day working through a proper sauna session before bed, and want your hot tub sheltered under cover, take the Thistle Pod. Both are dog friendly with no extra charge for up to two dogs, and both have farm walks straight from the door.",
      },
      {
        type: "list",
        items: [
          "Rose Pod: open-air hot tub, exclusive BBQ hut, electric frying pan",
          "Thistle Pod: gazebo-covered hot tub, exclusive barrel sauna, two-ring cooker top and air fryer",
          "Both: sleeps 4, en-suite walk-in shower, dog friendly, farm walks from the door",
        ],
      },
    ],
  },
  {
    slug: "half-hour-from-ballagan-farm",
    title: "Everything Within Half an Hour of Ballagan Farm",
    category: "Local area",
    metaDescription:
      "From Balloch Marina five minutes away to Ben Lomond in forty-five, here's what's actually worth the drive from Ballagan Farm, and how long it takes to get there.",
    publishDate: "2026-05-14",
    excerpt:
      "Ballagan Farm sits inside Loch Lomond and The Trossachs, Scotland's first National Park, so almost everything on this list is closer than you'd think.",
    heroImage: nearbyPhotos[0],
    body: [
      {
        type: "paragraph",
        text: "Ballagan Farm sits inside Loch Lomond and The Trossachs, Scotland's first National Park, so you're never more than half an hour from a loch shore, a hill walk or a proper Highland view. Here's what's actually close, and how long it takes to get there in the car.",
      },
      {
        type: "heading",
        text: "Five to seven minutes: the quick options",
      },
      {
        type: "paragraph",
        text: "Balloch Marina is five minutes away, with boat trips out onto the loch and its thirty-odd islands. A minute further on is Loch Lomond Shores, which covers pedal boats, canoe hire, crazy golf, SEA LIFE and the Bird of Prey Centre. Duncryne Hill (known locally as The Dumpling) is a short climb near Gartocharn with an outsized view for the effort, and RSPB Loch Lomond has dog-friendly trails, herons and swans, free parking and somewhere to sit, both about seven minutes out.",
      },
      {
        type: "heading",
        text: "Twenty to forty-five minutes: worth the extra drive",
      },
      {
        type: "paragraph",
        text: "Conic Hill above Balmaha is twenty minutes away and gives you the classic panorama down the length of the loch. Luss village, twenty-five minutes out, has conservation cottages, a pebble beach and a pier café. Further afield, Ben Lomond is forty-five minutes' drive and the most southerly Munro, so it's a full day out rather than an afternoon.",
      },
      {
        type: "heading",
        text: "On foot from the farm",
      },
      {
        type: "paragraph",
        text: "The West Highland Way runs right past, so you can walk a section or keep going; it runs all the way north. The villages of Balloch, Luss and Balmaha all have pubs, cafés and independent shops, and most of the walks around here are dog friendly, so bring them along.",
      },
    ],
  },
  {
    slug: "what-to-pack-for-your-stay",
    title: "What to Pack for a Stay at Ballagan Farm (and What We Already Provide)",
    category: "Practical guides",
    metaDescription:
      "Bedding, towels, robes and a fully equipped kitchen are already in the pod. Here's what's provided at Ballagan Farm and what's worth bringing yourself.",
    publishDate: "2026-04-02",
    excerpt:
      "Bedding, towels, robes and slippers are all included, so most of what's left to pack is about the farm itself rather than the pod.",
    heroImage: thistleHotTubPhotos[0],
    body: [
      {
        type: "heading",
        text: "What's already in the pod",
      },
      {
        type: "paragraph",
        text: "Bedding, towels, robes and slippers are all included in your stay, so there's no need to pack any of that. The kitchen comes with an air fryer, kettle and toaster in both pods, plus a two-ring cooker top in the Thistle Pod or an electric frying pan in the Rose Pod, and all the crockery and utensils you'll need. Each pod is lined in warm timber with an electric panel heater, so they're just as cosy on a wet evening as they are in midsummer, and there's a flat-screen TV and a proper dining table if you'd rather sit down to eat than balance a plate on your knee.",
      },
      {
        type: "heading",
        text: "Worth bringing",
      },
      {
        type: "list",
        items: [
          "Food and drink, especially if you've booked the BBQ hut: plates, glasses and condiments are provided, so it's just the food and charcoal-friendly extras you need",
          "Swimwear for the hot tub, and flip-flops for the walk out to it",
          "Sturdy shoes or wellies for the farm walks that start right at the door",
          "A warm layer for the evenings. Ballagan Farm is open countryside, so it cools down quickly after dark",
          "A torch or phone light if you're heading back from the hot tub or BBQ hut after dark",
          "Anything your dog needs: a bed, lead and bowls, if you're bringing one",
        ],
      },
      {
        type: "paragraph",
        text: "Beyond that, it's really just what you'd pack for any trip to the Scottish countryside: layers, something waterproof, and an appetite for whatever's cooking in the BBQ hut.",
      },
    ],
  },
  {
    slug: "dog-friendly-glamping-loch-lomond",
    title: "Bringing Your Dog to Ballagan Farm",
    category: "Dog friendly",
    metaDescription:
      "Both pods at Ballagan Farm are dog friendly with no extra charge, and the farm walks start right at the door. Here's what to know before you bring the dog.",
    publishDate: "2026-03-10",
    excerpt:
      "Both pods are dog friendly, up to two dogs each, with no extra charge and farm walks straight from your door.",
    heroImage: viewPhotos[0],
    body: [
      {
        type: "paragraph",
        text: "Both pods at Ballagan Farm are dog friendly, with no extra charge, for up to two dogs per pod. There are farm walks straight from the door, so there's no need to get back in the car before the first walk of the stay.",
      },
      {
        type: "heading",
        text: "On the farm",
      },
      {
        type: "paragraph",
        text: "Ballagan Farm still runs sheep and cattle in the fields around the pods, so you'll want your dog on a lead and under control whenever you're near the grazing land. That's really the only rule: the rest of the farm walks are there to be used, whatever the weather's doing.",
      },
      {
        type: "heading",
        text: "Further afield",
      },
      {
        type: "paragraph",
        text: "Most of the walking around here is dog friendly. RSPB Loch Lomond, about seven minutes from the farm, has dog-friendly trails alongside herons and swans, plus free parking and somewhere to sit. The West Highland Way passes close by too, so you can walk a section with the dog and turn back whenever suits, or keep going as far as you like. The villages of Balloch, Luss and Balmaha all have pubs and cafés that welcome dogs as well, so a day out doesn't have to mean leaving them behind.",
      },
    ],
  },
  {
    slug: "three-generations-one-farm",
    title: "Three Generations, One Farm: The Story Behind the Pods",
    category: "About us",
    metaDescription:
      "Glamping Loch Lomond sits on Ballagan Farm, a working family farm with three generations still living and working on it. Here's how the pods came to be.",
    publishDate: "2026-02-06",
    excerpt:
      "Seven years of planning, building and dreaming went into the first pod, on a farm that's still home to three generations and a working herd.",
    heroImage: exteriorPhotos[3],
    body: [
      {
        type: "paragraph",
        text: "Glamping Loch Lomond is tucked away on our family-run Ballagan Farm, with three generations still living and working here. That's not incidental to the pods; it's the reason they exist in the first place, and it shapes almost everything about how they're run.",
      },
      {
        type: "heading",
        text: "Seven years in the making",
      },
      {
        type: "paragraph",
        text: "After seven years of planning, building and dreaming, we opened the first of our two pods. It's the kind of timeline that only makes sense on a working farm, where a new venture has to fit around the existing one rather than replace it.",
      },
      {
        type: "heading",
        text: "Still a working farm",
      },
      {
        type: "paragraph",
        text: "Ballagan Farm still runs sheep and cattle in the fields around the pods, so it's genuinely normal to wake up and find them grazing just beyond the fence. The pods themselves face south to make the most of the sun in the Scottish countryside, and they sit inside Loch Lomond and The Trossachs, Scotland's first National Park, rather than on the edge of it.",
      },
      {
        type: "paragraph",
        text: "It's about as far from a caravan park as glamping gets, and that's by design. Whether it's a romantic break or a relaxed family getaway, the idea was always to bring people onto a working farm rather than build a resort next to one.",
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

/** Newest first, by publishDate. */
export const getBlogPostsSorted = () =>
  [...blogPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
