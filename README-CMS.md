# CMS — E-Portfolio (Multi-User)

Platform e-portofolio multi-pengguna. Admin membuat akun untuk setiap
mahasiswa; setiap akun otomatis mendapat halaman portofolio publik di
`/<username>` (profil + tempat asal) dan `/<username>/tugas` (daftar tugas),
serta dashboard sendiri untuk mengelola kontennya — tanpa menyentuh kode.

Tidak ada halaman "beranda" publik. `/` hanya mengarahkan ke halaman login
atau dashboard admin. Yang bersifat publik hanyalah halaman per-pengguna.

## ⚠️ Butuh server Node.js yang hidup

CMS ini **tidak bisa** di-deploy sebagai situs statis (GitHub Pages, dst).
Login, penyimpanan data, dan upload file semuanya butuh server yang berjalan
terus. Pilihan hosting yang cocok:

- **Railway** / **Render** — gratis untuk mulai, tinggal hubungkan repo.
- **Vercel** — App Router penuh didukung, tapi **jangan simpan upload di
  filesystem lokal** di Vercel (storage-nya ephemeral, hilang saat redeploy).
  Ganti `saveUploadedFile()` di `src/lib/upload.ts` untuk memakai object
  storage (Vercel Blob, Cloudflare R2, S3, dst) bila deploy ke Vercel.
- **VPS / Docker** — paling fleksibel; `npm run build && npm start`, data
  (`/data/*.json`) dan upload (`/public/uploads/`) tersimpan permanen di disk.

## Setup

```bash
npm install
cp .env.example .env.local   # lalu ubah ADMIN_USERNAME, ADMIN_PASSWORD & ADMIN_SECRET
npm run dev                  # buka http://localhost:3000
```

Saat pertama kali dijalankan (folder `data/` masih kosong), akun admin
pertama dibuat otomatis dari `ADMIN_USERNAME` / `ADMIN_PASSWORD` di `.env`.
Login langsung di `http://localhost:3000` — halaman ini adalah landing +
form login sekaligus (tidak ada halaman beranda publik terpisah).

## Model peran (role)

| Role | Bisa apa |
|---|---|
| **admin** | Membuat/menghapus/edit username user, reset kata sandi siapa pun, mengelola portofolio *user mana pun* lewat Manajemen User. **Admin tidak punya portofolio publik sendiri** — menu Profil/Tempat Asal/Tugas/Media/Tampilan baru muncul setelah admin memilih satu user untuk dikelola. |
| **user** | Hanya mengelola portofolionya sendiri: profil, tempat asal, tugas, media, tampilan |

### Menambahkan mahasiswa baru

1. Masuk sebagai admin → menu **Manajemen User** → **Tambah User**.
2. Isi username (mis. `elva`), nama tampilan, kata sandi, role `user`.
3. Selesai — halaman `/elva` dan `/elva/tugas` langsung aktif (dengan konten
   placeholder), dan `elva` bisa login sendiri (di `/`) untuk mengisi
   kontennya di `/admin`.

### Mengganti username (mis. `/elva` → `/elva-arini-mardatillah`)

Dari **Manajemen User**, klik **Edit** pada user yang dituju, lalu ubah
kolom Username. Ini otomatis memindahkan file portofolio, folder upload di
disk, dan semua URL gambar/berkas yang tersimpan supaya tetap valid setelah
URL publik berubah.

### Admin mengelola portofolio user lain

Dari **Manajemen User**, klik **Kelola Portofolio** pada user manapun. Ini
membuka `/admin/profile?as=<username>` — semua halaman admin (Profil, Tempat
Asal, Tugas, Media, Tampilan) akan otomatis mengelola portofolio user
tersebut selama parameter `?as=` masih menempel di URL (sidebar
mempertahankannya secara otomatis saat berpindah menu).

## Deploy production

```bash
npm run build
npm start
```

Pastikan `.env` produksi memakai `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan
`ADMIN_SECRET` yang kuat & unik (bukan nilai default) — `ADMIN_USERNAME`/
`ADMIN_PASSWORD` hanya dipakai sekali saat `data/users.json` belum ada.

## Struktur konten

Semua konten disimpan sebagai file JSON di `/data` (tanpa database server):

| File | Isi |
|---|---|
| `data/users.json` | Daftar akun: username, nama tampilan, hash kata sandi, role |
| `data/portfolios/<username>.json` | Seluruh portofolio satu user: profil, tempat asal, tugas, tampilan, media |

Upload file tersimpan di `public/uploads/<username>/images|documents/...`
(terpisah per pengguna).

## Tema & palet warna

Halaman portofolio publik punya 8 preset template siap pakai (lihat
`src/lib/templates.ts`), masing-masing bisa dikombinasikan dengan palet
warna solid, gradasi, atau gambar latar:

| Template | Nuansa |
|---|---|
| Nature | Nude/soft pink — hangat & organik |
| Minimal | Netral lavender-abu — bersih, fokus konten |
| Midnight | Gelap ungu — elegan, kontras tinggi |
| Ocean | Biru toska — segar, cocok tema laut/pantai |
| Sunset | Jingga keemasan — hangat, penuh energi |
| Forest | Hijau daun — alami, cocok tema bukit/pegunungan |
| Lavender | Ungu pastel — lembut & feminin |
| Charcoal | Abu-abu gelap monokrom — netral & tegas |

Setiap portofolio bisa memilih template & palet sendiri lewat menu
**Tampilan** di dashboard-nya masing-masing.

## Keamanan

- Kata sandi di-hash per-user dengan `scrypt` (bukan disimpan polos, bukan
  MD5/SHA biasa).
- Session cookie ditandatangani (HMAC) berisi username — server selalu
  memvalidasi ulang dari `data/users.json` sehingga akun yang dihapus atau
  role yang berubah langsung berlaku di request berikutnya.
- Setiap server action & endpoint upload memverifikasi kepemilikan
  (`canManagePortfolio`) sebelum mengizinkan perubahan — user biasa tidak
  bisa mengedit atau mengunggah ke portofolio user lain.
