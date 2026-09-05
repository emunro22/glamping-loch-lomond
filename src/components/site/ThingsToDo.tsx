import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocationMap } from "./LocationMap";
import { googleMapsDirectionsUrl, appleMapsDirectionsUrl } from "@/lib/maps";

/**
 * Drive time is the organising device here: it's the thing guests actually
 * plan around, and it's genuinely true of the content rather than decoration.
 * mapQuery is the search term handed to Google/Apple Maps for directions.
 */
const places = [
  {
    drive: "5 min",
    name: "Balloch Marina",
    note: "Boat trips out onto the loch and its thirty-odd islands.",
    mapQuery: "Balloch Marina, Balloch",
  },
  {
    drive: "6 min",
    name: "Loch Lomond Shores",
    note: "Pedal boats, canoe hire, crazy golf, SEA LIFE and the Bird of Prey Centre.",
    mapQuery: "Loch Lomond Shores, Balloch",
  },
  {
    drive: "7 min",
    name: "The Dumpling",
    note: "A short climb near Gartocharn with an outsized view for the effort.",
    mapQuery: "Duncryne Hill, Gartocharn",
  },
  {
    drive: "7 min",
    name: "RSPB Loch Lomond",
    note: "Dog-friendly trails, herons and swans, free parking and somewhere to sit.",
    mapQuery: "RSPB Loch Lomond Nature Reserve",
  },
  {
    drive: "20 min",
    name: "Conic Hill, Balmaha",
    note: "The classic panorama down the length of the loch.",
    mapQuery: "Conic Hill, Balmaha",
  },
  {
    drive: "25 min",
    name: "Luss village",
    note: "Conservation cottages, a pebble beach and a pier café.",
    mapQuery: "Luss, Loch Lomond",
  },
  {
    drive: "45 min",
    name: "Ben Lomond",
    note: "The most southerly Munro, and a full day out.",
    mapQuery: "Ben Lomond",
  },
  {
    drive: "On foot",
    name: "West Highland Way",
    note: "Walk a section, or keep going: it runs all the way north.",
    mapQuery: "West Highland Way, Balloch",
  },
];

export function ThingsToDo() {
  return (
    <section id="things-to-do" className="relative bg-oat-100 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Within half an hour"
          title="What's on the doorstep"
          intro="Scotland's first National Park starts more or less at the gate. Here's what's close, and how far you'll actually be driving."
        />

        <div className="mt-14 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {places.map((place, i) => (
            <Reveal
              key={place.name}
              delay={(i % 2) * 0.06}
              className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-5 border-t border-loch-900/10 py-6 transition-colors hover:border-loch-900/30"
            >
              <span className="font-display text-sm tabular-nums text-lamp-600">
                {place.drive}
              </span>
              <div>
                <h3 className="text-lg text-loch-900">{place.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-loch-800/70">
                  {place.note}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <a
                    href={googleMapsDirectionsUrl(place.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lamp-600 underline-offset-2 transition-colors hover:text-lamp-500 hover:underline"
                  >
                    Google Maps ↗
                  </a>
                  <a
                    href={appleMapsDirectionsUrl(place.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lamp-600 underline-offset-2 transition-colors hover:text-lamp-500 hover:underline"
                  >
                    Apple Maps ↗
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-loch-800/65">
            The villages of Balloch, Luss and Balmaha all have pubs, cafés and
            independent shops, and most of the walks around here are dog friendly,
            so bring them along.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-16">
          <p className="eyebrow mb-4 text-lamp-600">Getting to the farm</p>
          <LocationMap tone="light" />
        </Reveal>
      </div>
    </section>
  );
}
