import { PageHeader } from "@/components/admin/AdminShell";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";
import { getEnquiries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries().catch(() => []);

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Everything sent through the contact form on the website. Replying opens your normal email app."
      />
      <EnquiriesManager initial={enquiries} />
    </>
  );
}
