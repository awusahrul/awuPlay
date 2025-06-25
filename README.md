# awuPlay

![Versi](https://img.shields.io/badge/versi-V2025.06.25-blue)
![Framework](https://img.shields.io/badge/framework-Next.js-black?logo=next.js)
![Player](https://img.shields.io/badge/player-Plyr.js-red)
![Bahasa](https://img.shields.io/badge/bahasa-TypeScript-blue?logo=typescript)

**awuPlay** adalah sebuah proyek pemutar video berbasis web yang dirancang untuk melakukan streaming video langsung dari Google Drive dengan arsitektur proxy yang aman dan efisien.

## Daftar Isi

1.  [Ringkasan Proyek](#ringkasan-proyek)
2.  [Fitur Unggulan](#fitur-unggulan)
3.  [Arsitektur & Cara Kerja](#arsitektur--cara-kerja)
    -   [Alur Proses](#alur-proses)
    -   [Mengapa Arsitektur ini Penting?](#mengapa-arsitektur-ini-penting)
4.  [Tumpukan Teknologi](#tumpukan-teknologi)
5.  [Panduan Memulai](#panduan-memulai)
    -   [Prasyarat](#prasyarat)
    -   [Instalasi](#instalasi)
6.  [Konfigurasi Proyek (PENTING)](#konfigurasi-proyek-penting)
    -   [Kunci API Google Drive](#1-kunci-api-google-drive-google_drive_api_key)
    -   [Izin File di Google Drive](#2-izin-file-di-google-drive)
    -   [Thumbnail/Poster](#3-url-thumbnailposter)
7.  [Skrip yang Tersedia](#skrip-yang-tersedia)
8.  [Penjelasan Struktur File](#penjelasan-struktur-file)
9.  [Deployment](#deployment)

## Ringkasan Proyek

Proyek ini memecahkan masalah umum saat ingin menampilkan video dari Google Drive di sebuah website. Memberikan link langsung ke file video seringkali tidak praktis karena URL-nya bisa berubah dan mengekspos lokasi asli file. **awuPlay** mengatasi ini dengan menggunakan Next.js API Route sebagai jembatan (proxy) yang cerdas. Hasilnya adalah pemutar video yang cepat, aman, dan mudah diintegrasikan.

## Fitur Unggulan

-   ✅ **Streaming Efisien**: Video di-stream per-bagian (*byte-range requests*), bukan diunduh sekaligus.
-   ✅ **Keamanan Terjamin**: Kunci API Google Drive tersimpan aman di server, tidak pernah terekspos ke browser.
-   ✅ **Dukungan Seeking**: Pengguna dapat melompat ke menit mana pun dalam video, bahkan pada file besar.
-   ✅ **Antarmuka Modern**: Menggunakan Plyr.js untuk tampilan pemutar yang bersih dan responsif.
-   ✅ **Thumbnail Dinamis**: Poster atau thumbnail video dapat diatur secara dinamis berdasarkan ID video.
-   ✅ **Kode Terstruktur**: Dibangun dengan TypeScript untuk kode yang lebih mudah dikelola dan minim error.

## Arsitektur & Cara Kerja

Memahami arsitektur ini adalah kunci untuk menggunakan dan mengembangkan proyek ini.

### Alur Proses

1.  **Permintaan Pengguna**: Pengguna membuka halaman web di browser dengan URL, contoh: `https://domain-anda.com/video/ID_VIDEO_UNIK`.
2.  **Render Halaman**: Next.js merender halaman `/pages/video/[id].tsx`. Halaman ini berisi komponen pemutar video.
3.  **Inisialisasi Player**: Komponen `PlyrVideo` diinisialisasi. Sumber video (`src`) dari pemutar ini tidak menunjuk langsung ke Google Drive, melainkan ke API internal proyek: `/api/src/ID_VIDEO_UNIK`.
4.  **Permintaan ke API Proxy**: Pemutar video di browser kemudian membuat permintaan ke `/api/src/ID_VIDEO_UNIK`.
5.  **Proxy Bekerja**: API Route di `/pages/api/src/[id].tsx` menerima permintaan tersebut. Dari sisi server, ia:
    a. Mengambil ID video dari URL.
    b. Menambahkan kunci API Google Drive yang tersimpan aman di server.
    c. Melakukan `fetch` ke endpoint Google Drive API yang sebenarnya.
    d. Jika permintaan dari browser menyertakan header `Range` (untuk *seeking*), header tersebut juga diteruskan ke Google Drive.
6.  **Streaming ke Pengguna**: API Route tidak menunggu seluruh video selesai diunduh. Ia langsung mengalirkan (*stream*) respons dari Google Drive sedikit demi sedikit kembali ke browser pengguna, seolah-olah server inilah yang memiliki file video tersebut.

### Mengapa Arsitektur ini Penting?

-   **Keamanan**: Kunci API Anda tidak pernah bocor ke publik.
-   **Kinerja**: Streaming memungkinkan video diputar instan tanpa harus menunggu download selesai.
-   **Kontrol**: Anda bisa menambahkan logika tambahan di API Proxy di masa depan, seperti otentikasi pengguna, logging, atau analitik.

## Tumpukan Teknologi

-   **Framework**: Next.js
-   **Library UI**: React
-   **Bahasa**: TypeScript
-   **Pemutar Video**: Plyr.js
-   **API**: Google Drive API v3

## Panduan Memulai

### Prasyarat

-   Node.js (v18.x atau lebih tinggi)
-   npm atau yarn

### Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/awusahrul/awuPlay.git
    cd awuPlay
    ```

2.  **Instal semua dependensi:**
    ```bash
    npm install
    ```

## Konfigurasi Proyek (PENTING)

Ini adalah bagian terpenting untuk membuat proyek berjalan. Ada **3 hal** yang perlu Anda perhatikan dan ganti sesuai kebutuhan.

### 1. Kunci API Google Drive (`GOOGLE_DRIVE_API_KEY`)

Anda harus mendapatkan kunci API Anda sendiri dari Google Cloud Platform.

> ⚠️ **Jangan gunakan kunci API yang ada di kode contoh untuk proyek publik.** Kuota Anda bisa habis digunakan orang lain.

**Cara Mendapatkan Kunci API:**
1.  Buka [Google Cloud Console](https://console.cloud.google.com/).
2.  Buat **Proyek Baru** (atau pilih yang sudah ada).
3.  Di menu navigasi, buka **"APIs & Services" > "Library"**.
4.  Cari **"Google Drive API"** dan klik **"Enable"**.
5.  Setelah aktif, buka **"APIs & Services" > "Credentials"**.
6.  Klik **"+ CREATE CREDENTIALS"** dan pilih **"API key"**.
7.  Salin kunci yang baru dibuat.
8.  **SANGAT DIREKOMENDASIKAN**: Klik pada kunci API Anda, dan di bawah **"API restrictions"**, pilih untuk membatasi kunci agar hanya bisa digunakan untuk "Google Drive API" untuk keamanan ekstra.

Setelah mendapatkan kunci, buat file bernama `.env.local` di direktori utama proyek dan masukkan kunci Anda di sana:

```ini
# .env.local
GOOGLE_DRIVE_API_KEY=MASUKKAN_KUNCI_API_ANDA_DI_SINI
```

### 2. Izin File di Google Drive

Video yang ingin Anda putar harus memiliki izin akses yang benar.
1.  Klik kanan pada file video di Google Drive.
2.  Pilih **"Share" > "Share"**.
3.  Di bagian "General access", ubah dari "Restricted" menjadi **"Anyone with the link"** dengan peran sebagai **"Viewer"**.

Jika tidak, API Anda akan mengembalikan error `403 Forbidden` atau `404 Not Found`.

### 3. URL Thumbnail/Poster

Saat ini, URL untuk thumbnail diatur secara *hardcode* di dalam file `/pages/video/[id].tsx`.

```javascript
// di dalam file /pages/video/[id].tsx
const awusahrul_url_thumbnail = `https://lh3.googleusercontent.com/d/${awusahrul_id_dari_url}`;
```

**Anda perlu mengganti bagian ini** jika Anda memiliki layanan thumbnail sendiri atau ingin menggunakan URL dengan format yang berbeda. Ubah string `https://tum.awu.my.id/tumbnail/` sesuai dengan endpoint thumbnail Anda.

## Skrip yang Tersedia

-   `npm run dev`: Menjalankan aplikasi dalam mode pengembangan di `http://localhost:3000`.
-   `npm run build`: Membuat build aplikasi untuk produksi.
-   `npm run start`: Menjalankan server produksi dari build yang telah dibuat.

## Penjelasan Struktur File

-   `/pages/api/src/[id].tsx`: File API proxy yang menjadi inti dari proyek ini.
-   `/components/PlyrVideo.tsx`: Komponen React yang membungkus pemutar Plyr.js.
-   `/pages/video/[id].tsx`: Halaman dinamis yang menampilkan pemutar video untuk ID tertentu.
-   `/.env.local`: File untuk menyimpan rahasia seperti kunci API (tidak boleh di-commit ke Git).
-   `/public`: Folder untuk menyimpan aset statis seperti gambar atau ikon.

## Deployment

Proyek ini dirancang untuk dideploy dengan mudah di **Platfrom deploy andalanmu!**.

1.  Push kode Anda ke repositori GitHub.
2.  Impor repositori tersebut ke Platfrom deploy andalanmu!.
3.  **PENTING**: Buka pengaturan proyek Anda di Platfrom deploy andalanmu, pergi ke bagian **"Settings" > "Environment Variables"**. Tambahkan variabel `GOOGLE_DRIVE_API_KEY` dengan kunci API Anda.
4.  Deploy. Platfrom deploy andalanmu akan otomatis mendeteksi bahwa ini adalah proyek Next.js dan menanganinya dengan benar.

---

dibuat oleh **@awusahrul** dan dipublikasikan pada tanggal 25 Juni 2025 (*V2025.06.25**01***)
