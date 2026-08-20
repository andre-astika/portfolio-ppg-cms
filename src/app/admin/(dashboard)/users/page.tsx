import { requireAdmin } from "@/lib/auth";
import { getUsers } from "@/lib/data";
import { PageHeader } from "@/components/admin/ui";
import UsersManager from "./UsersManager";

export default async function UsersAdminPage() {
  const admin = await requireAdmin();
  const users = await getUsers();
  // Never send password hashes to the client.
  const safeUsers = users.map(({ username, displayName, role, createdAt }) => ({
    username,
    displayName,
    role,
    createdAt,
  }));

  return (
    <div>
      <PageHeader
        title="Manajemen User"
        description="Tambahkan pengguna baru agar mereka bisa masuk dan mengelola portofolionya sendiri. Menambah user otomatis membuat halaman publik /<username>."
      />
      <UsersManager users={safeUsers} currentUsername={admin.username} />
    </div>
  );
}
