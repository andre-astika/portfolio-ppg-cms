import { resolveTargetPortfolio } from "@/lib/admin-target";
import ProfileForm from "./ProfileForm";
import { PageHeader } from "@/components/admin/ui";

export default async function ProfileAdminPage({
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
        title="Profil"
        description={
          managingOther
            ? `Mengedit profil milik "${targetUsername}". Nama, peran, deskripsi, dan foto profil yang tampil di halaman publik.`
            : "Nama, peran, deskripsi, dan foto profil yang tampil di halaman publik kamu."
        }
      />
      <ProfileForm profile={portfolio.profile} username={targetUsername} />
    </div>
  );
}
