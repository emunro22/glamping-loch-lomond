import { PageHeader } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";
import { sql, type ContentBlock } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rows = await sql`SELECT * FROM site_content ORDER BY key ASC`.catch(
    () => [],
  );

  return (
    <>
      <PageHeader
        title="Page text"
        description="The headings, paragraphs and photos for each section of the homepage. Changes appear on the site within a minute."
      />
      <ContentManager initial={rows as ContentBlock[]} />
    </>
  );
}
