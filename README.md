# E-Portofolio — Elva Arini Mardatillah

E-portofolio mahasiswi PPG Prajabatan, Universitas Mahasaraswati Denpasar,
dengan tema desain **nude & soft** (krem, coklat muda, sage, batu alam),
dibangun dengan **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 +
Framer Motion**.

## Struktur Halaman

1. **`/` — Profil**
   Hero profil mahasiswi (ilustrasi avatar SVG), marquee berjalan berisi
   kekayaan alam kampung halaman, bagian "Tentang Saya", dan bagian
   "Profil Tempat Asal — Sumbawa Barat" (pantai, bukit, air terjun, batu
   alam) dalam kartu ilustrasi dengan animasi hover.
2. **`/tugas` — Daftar Tugas**
   Daftar tugas perkuliahan dengan ikon PDF, mata kuliah, tanggal, dan
   tombol unduh, lengkap dengan animasi *reveal on scroll*.

Header dan footer bersifat global (ada di `src/app/layout.tsx`) sehingga
tampil konsisten di kedua halaman.

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

> Catatan: saat build pertama, Next.js akan mengunduh font Google
> (Fraunces & Plus Jakarta Sans) secara otomatis — pastikan komputer
> Anda terhubung ke internet.

## Mengganti Aset

- **Foto profil**: saat ini menggunakan ilustrasi SVG placeholder di
  `src/components/ProfileAvatar.tsx`. Ganti dengan foto asli dengan
  menambahkan file ke folder `public/` lalu gunakan komponen
  `next/image` di `src/app/page.tsx`.
- **Ilustrasi kampung halaman**: ada di
  `src/components/NatureIllustrations.tsx` (Pantai, Bukit, Air Terjun,
  Batu Alam). Bisa diganti foto asli dengan cara yang sama.
- **Dokumen tugas (PDF)**: taruh file PDF asli di `public/pdf/` lalu
  perbarui daftar `TASKS` di `src/app/tugas/page.tsx`.

## Palet Warna

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-cream` | `#FAF5EE` | Latar utama |
| `--color-cream-deep` | `#F1E8D9` | Latar seksi alternatif |
| `--color-stone` | `#B7A692` | Garis, border |
| `--color-clay` | `#C8A066` | Aksen utama (tombol, highlight) |
| `--color-sage` | `#8B9A78` | Aksen sekunder (bukit) |
| `--color-sea` | `#7C98A0` | Aksen tersier (air) |
| `--color-ink` | `#3D3529` | Teks utama |

## Teknologi

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animasi)
- lucide-react (ikon)
