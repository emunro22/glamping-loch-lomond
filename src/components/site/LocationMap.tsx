import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { fullAddress, mapEmbedUrl, googleMapsDirectionsUrl, appleMapsDirectionsUrl } from "@/lib/maps";

type Props = {
  tone?: "dark" | "light";
  className?: string;
};

/** An embedded map of the farm plus one-tap directions, no API key required. */
export function LocationMap({ tone = "dark", className }: Props) {
  const isLight = tone === "light";

  return (
    <div className={className}>
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 sm:aspect-[16/10]",
          isLight ? "ring-loch-900/10" : "ring-oat-50/12",
        )}
      >
        <iframe
          title={`Map showing ${fullAddress()}`}
          src={mapEmbedUrl()}
          loading="lazy"
          className="h-full w-full grayscale-[0.15]"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ButtonLink
          href={googleMapsDirectionsUrl()}
          external
          variant={isLight ? "outline" : "light"}
          size="sm"
        >
          Directions · Google Maps
        </ButtonLink>
        <ButtonLink
          href={appleMapsDirectionsUrl()}
          external
          variant={isLight ? "outline" : "light"}
          size="sm"
        >
          Directions · Apple Maps
        </ButtonLink>
      </div>
    </div>
  );
}
