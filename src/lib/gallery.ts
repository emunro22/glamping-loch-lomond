import { getGallery, type GalleryImage } from "./db";
import {
  exteriorPhotos,
  insidePhotos,
  bbqHutPhotos,
  hotTubPhotos,
  saunaPhotos,
  viewPhotos,
  nearbyPhotos,
  type Photo,
} from "@/data/media";

function toGalleryImages(
  photos: Photo[],
  category: string,
  startId: number,
  startOrder: number,
): GalleryImage[] {
  return photos.map((photo, i) => ({
    id: startId + i,
    url: photo.src,
    pathname: photo.src,
    alt: photo.alt,
    category,
    sort_order: startOrder + i,
    created_at: "2026-01-01T00:00:00.000Z",
  }));
}

/** Local fallback gallery, grouped by subject, used when the database has no photos yet. */
function fallbackGallery(): GalleryImage[] {
  let id = 1;
  let order = 0;
  const groups: [Photo[], string][] = [
    [exteriorPhotos, "pods"],
    [insidePhotos, "inside"],
    [bbqHutPhotos, "bbq hut"],
    [hotTubPhotos, "hot tub"],
    [saunaPhotos, "sauna"],
    [viewPhotos, "views"],
    [nearbyPhotos, "nearby"],
  ];

  return groups.flatMap(([photos, category]) => {
    const images = toGalleryImages(photos, category, id, order);
    id += photos.length;
    order += photos.length;
    return images;
  });
}

export async function getGalleryWithFallback(category?: string): Promise<GalleryImage[]> {
  const rows = await getGallery(category).catch(() => [] as GalleryImage[]);
  if (rows.length > 0) return rows;

  const fallback = fallbackGallery();
  return category ? fallback.filter((i) => i.category === category) : fallback;
}
