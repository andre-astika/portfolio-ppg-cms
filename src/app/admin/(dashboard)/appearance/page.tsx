import { resolveTargetPortfolio } from "@/lib/admin-target";
import { PageHeader } from "@/components/admin/ui";
import AppearanceForm from "./AppearanceForm";

export default async function AppearanceAdminPage({
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
        title="Tampilan"
        description={
          managingOther
            ? `Mengedit tampilan portofolio milik "${targetUsername}".`
            : "Pilih template dan palet warna untuk halaman portofolio publik kamu."
        }
      />
      <AppearanceForm appearance={portfolio.appearance} username={targetUsername} />
    </div>
  );
}
