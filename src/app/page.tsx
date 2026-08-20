import { redirect } from "next/navigation";
import { Sparkles, FolderOpen, Palette } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import LoginCard from "@/components/LoginCard";

const FEATURES = [
  { icon: Sparkles, text: "Profil & cerita kampung halaman yang bisa kamu susun sendiri" },
  { icon: FolderOpen, text: "Arsip tugas kuliah yang rapi dan mudah dibagikan" },
  { icon: Palette, text: "8 pilihan tema warna untuk halaman portofoliomu" },
];

/**
 * There is no public "home" page for this CMS — only individual user
 * portfolios at /<username> and the admin dashboard. Logged-in visitors are
 * sent straight to their dashboard; everyone else sees a short welcome and
 * the login form right here.
 */
export default async function RootPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      <div className="grid w-full max-w-4xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            <Sparkles size={13} strokeWidth={2} />
            E-Portfolio PPG
          </span>
          <h1 className="mt-5 font-display text-3xl leading-tight text-gray-900 sm:text-4xl">
            Selamat datang, Mahasiswa/i PPG Prajabatan
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Platform e-portofolio untuk menampilkan profil, cerita kampung
            halaman, dan arsip tugas kuliahmu di halaman publik sendiri —
            masuk dengan akun yang diberikan admin untuk mulai mengelola
            kontenmu.
          </p>

          <ul className="mt-8 space-y-3.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <Icon size={14} strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center md:justify-end">
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
