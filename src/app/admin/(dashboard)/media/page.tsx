import { resolveTargetPortfolio } from "@/lib/admin-target";
import { PageHeader } from "@/components/admin/ui";
import MediaLibrary from "./MediaLibrary";
import { MAX_UPLOAD_MB } from "@/lib/upload";

export default async function MediaAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const { portfolio, targetUsername, managingOther } = await resolveTargetPortfolio(
    await searchParams
  );

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={
          (managingOther ? `Mengedit media milik "${targetUsername}". ` : "") +
          `Unggah dan kelola gambar & dokumen. Ukuran maksimal per file: ${MAX_UPLOAD_MB} MB.`
        }
      />
      <MediaLibrary media={portfolio.media} maxMb={MAX_UPLOAD_MB} username={targetUsername} />
    </div>
  );
}
