# Signage Control Panel — MJ Solution Indonesia

Sistem manajemen digital signage berbasis web. Admin mengelola konten (gambar/video/URL) dan mendorongnya secara **real-time** ke banyak layar TV yang tersebar di berbagai lokasi, tanpa perlu menyentuh TV-nya satu per satu.

Terdiri dari 3 bagian yang saling terhubung:

| Bagian | Fungsi | Detail |
|---|---|---|
| **[server/](server/README.md)** | REST API + WebSocket engine | Express, Supabase (PostgreSQL) |
| **[client/](client/README.md)** | Dashboard Admin & halaman Display | React (Vite) + Tailwind |
| **[electron/](electron/README.md)** | Aplikasi desktop yang dijalankan di tiap TV | Electron, bisa di-package jadi installer `.exe` |

## Cara Kerja Singkat

1. **Admin** membuka Dashboard (`client/`), login, lalu menambahkan konten (gambar/video/link) dan device (representasi tiap TV) lewat tab **Devices**.
2. **TV fisik** menjalankan aplikasi Electron (`electron/`). Saat pertama kali nyala, aplikasi ini otomatis meminta kode pairing 6-digit ke server dan menampilkannya fullscreen di layar.
3. Admin melihat kode itu muncul di tab **Pairing** pada Dashboard, mencocokkannya dengan layar yang benar, lalu memilih device tujuan (dari dropdown, bukan mengetik ulang nama/lokasi) dan menekan **Setujui**.
4. Setelah disetujui, TV otomatis tersambung, menyimpan kredensialnya secara lokal, dan berpindah dari layar pairing ke layar display konten.
5. Admin bisa mendorong satu konten (**Push Content**) atau membuat rotasi beberapa konten (**Playlist**) ke device tersebut — perubahan tampil di TV secara instan lewat WebSocket, tanpa refresh manual.

## Cara Menjalankan (Development)

Urutan yang disarankan: **Database → Server → Client → Electron**.

### 1. Database (Supabase)
1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi [`schema.sql`](schema.sql) — ini membuat semua tabel (`admins`, `devices`, `contents`, `playlist_items`, `pairing_codes, `mode`, `ws_token`, `paired`)
3. Catat **Project URL** dan **service_role key** dari *Project Settings → API*.

### 2. Server
```bash
cd server
cp .env.example .env    # isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
npm install
npm run dev
```
Detail lengkap di [`server/README.md`](server/README.md).

### 3. Client
```bash
cd client
npm install
npm run dev
```
Buka `http://localhost:5173`. Detail lengkap di [`client/README.md`](client/README.md).

### 4. Electron (simulasi TV)
```bash
cd electron
npm install
npm run start:windowed
```
Kode pairing akan muncul di jendela — approve dari tab Pairing di Dashboard. Detail lengkap, termasuk cara build jadi installer `.exe` untuk TV produksi, ada di [`electron/README.md`](electron/README.md).

## Dokumentasi API

Selama server berjalan, Swagger UI interaktif tersedia di:
```
http://localhost:5000/api-docs
```

## Keamanan Koneksi WebSocket

- Setiap device punya `ws_token` unik (auto-generate, kolom `devices.ws_token`). Koneksi layar ke `/ws` wajib menyertakan `?deviceId=...&token=<ws_token>` — token ini otomatis tertanam saat proses pairing, admin tidak perlu mengelolanya manual.
- Koneksi dashboard (`role=dashboard`) wajib menyertakan JWT admin yang valid lewat `?token=<jwt>`.
- Verifikasi dilakukan sebelum WebSocket handshake terjadi (`server.on('upgrade')`) — koneksi tanpa token valid ditolak dengan `401`.

## Tech Stack

- **Database:** Supabase (PostgreSQL)
- **Backend:** Node.js, Express, ws (WebSocket), JWT, bcryptjs, Swagger
- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Axios, React Router
- **Desktop client:** Electron, dikemas dengan electron-builder untuk instalasi di TV

## Palet Warna

| Nama | Hex |
|---|---|
| Primary (Teal) | `#3BBFA2` / `#44C2A6` |
| Secondary (Dark Slate) | `#385A64` / `#2D4850` |
| Background (Ice Mint) | `#EBF5F4` / `#F0F8F7` |
| Typography (Charcoal) | `#2E3842` / `#354049` |

---

Dibuat oleh **M.Riki Hidayat**