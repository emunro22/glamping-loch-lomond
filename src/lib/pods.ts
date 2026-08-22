import { getPods, type PodRecord } from "./db";
import { pods as fallbackPods } from "@/data/site";
import { podHeroPhoto } from "@/data/media";

/** Pod records fall back to the static definitions if the table is empty or unreachable. */
export async function getPodsWithFallback(): Promise<PodRecord[]> {
  const records = await getPods().catch(() => [] as PodRecord[]);
  if (records.length > 0) return records;

  return fallbackPods.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    features: [...p.features],
    bookable_id: p.bookableId,
    rate_type_id: p.rateTypeId,
    hero_image: podHeroPhoto[p.slug]?.src ?? null,
    sleeps: p.sleeps,
    price_from: null,
    is_active: true,
    sort_order: i,
  }));
}

export async function getPodBySlug(slug: string): Promise<PodRecord | undefined> {
  const records = await getPodsWithFallback();
  return records.find((p) => p.slug === slug && p.is_active);
}
