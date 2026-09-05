import { PageHeader } from "@/components/admin/AdminShell";
import { PodsManager } from "@/components/admin/PodsManager";
import { sql, type PodRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PodsPage() {
  const rows = await sql`SELECT * FROM pods ORDER BY sort_order ASC, id ASC`.catch(
    () => [],
  );

  return (
    <>
      <PageHeader
        title="Pods"
        description="Names, descriptions, features and photos. The bookable ID is what links each pod to InnStyle, so only change it if InnStyle changes."
      />
      <PodsManager initial={rows as PodRecord[]} />
    </>
  );
}
