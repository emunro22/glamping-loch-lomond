import { PageHeader } from "@/components/admin/AdminShell";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGallery } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGallery().catch(() => []);

  return (
    <>
      <PageHeader
        title="Photos"
        description="Upload photos for the gallery on the website. Drag to reorder: the first photo appears first."
      />
      <GalleryManager initial={images} />
    </>
  );
}
