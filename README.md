# InfrastrukturKu 🇮🇩

**Lapor Masalahnya. Pantau Prosesnya. Buktikan Hasilnya.**

InfrastrukturKu adalah prototype website untuk pelaporan kerusakan infrastruktur dan pemantauan transparansi penanganan laporan masyarakat.

## Fitur Utama
- Dashboard statistik laporan.
- Pelaporan kerusakan infrastruktur.
- Pemantauan status dan riwayat laporan.
- BuktiTuntas: dokumentasi sebelum dan sesudah perbaikan.
- Pengaduan publik, perizinan, dan bantuan sosial.
- Peta interaktif lokasi laporan.
- Dashboard petugas dan transparansi publik.

*Fitur yang tersedia bergantung pada implementasi dan konfigurasi aplikasi.*

## Tech Stack
- HTML, CSS, JavaScript
- Supabase dan PostgreSQL (SQL)
- Leaflet.js dan OpenStreetMap
- Chart.js
- LocalStorage untuk penyimpanan lokal prototype

## Database
File `sql/schema.sql` berisi struktur tabel, kebijakan Row Level Security (RLS), dan contoh data untuk database Supabase.

Tabel utama meliputi `profiles`, `reports`, `report_updates`, `complaints`, `permits`, dan `bansos_submissions`.

## Cara Menjalankan
1. Clone atau download repository.
2. Buka folder project di Visual Studio Code.
3. Klik kanan `index.html` dan pilih **Open with Live Server**.
4. Konfigurasikan Supabase jika fitur database online diperlukan.

## Status
Prototype dalam pengembangan. Fitur yang membutuhkan backend bergantung pada konfigurasi dan pengujian Supabase.

## 👥 Informasi Project
- **Kompetisi:** MIA 2026 — Web In Action
- **Tim:** Coding Pemersatu Bangsa
- **Anggota:** Adila Huzaifa Syahdinubrata Al Bukhari Haque, Akram Ammar Ariban, Razin Abdilbar
- **Repository:** https://github.com/abdilbarrrazin-bot/miacomp.io/tree/main
- **Demo:** -

----------------------------------------------------------------------------------------------------

*InfrastrukturKu adalah prototype independen, bukan kanal(saluran) pengaduan resmi pemerintah.*