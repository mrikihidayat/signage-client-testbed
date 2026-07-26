# Signage Control Panel — Server

Backend REST API + WebSocket real-time engine untuk Signage Control Panel (MJ Solution Indonesia). Mengelola autentikasi admin, device (TV), konten, playlist per device, proses pairing TV baru, dan mendorong perubahan konten ke layar secara real-time.

## Tech Stack

- **Express** — REST API
- **ws** — WebSocket server (real-time push ke device & dashboard)
- **Supabase** (`@supabase/supabase-js`) — database & query layer
- **jsonwebtoken** + **bcryptjs** — autentikasi admin (JWT)
- **swagger-ui-express** — dokumentasi API interaktif

## Struktur Folder

```
server/
├── index.js                      # Entry point: bootstrap HTTP server + WS + listen
├── src/
│   ├── app.js                    # Perakitan Express app (middleware, routes, swagger, 404)
│   ├── config/
│   │   ├── env.js                # Baca & validasi environment variables
│   │   └── supabase.js           # Inisialisasi Supabase client
│   ├── docs/
│   │   ├── openapi.js            # Definisi spesifikasi OpenAPI 3.0 (semua endpoint)
│   │   └── swagger.js            # Setup Swagger UI di /api-docs
│   ├── middleware/
│   │   └── authenticateToken.js  # Middleware verifikasi JWT admin
│   ├── realtime/
│   │   ├── connectionStore.js    # State koneksi WS device & dashboard (Map/Set)
│   │   ├── broadcast.js          # Broadcast ke dashboard, push playlist, update status device
│   │   └── wsServer.js           # WebSocketServer: handshake auth + event connection
│   └── routes/
│       ├── auth.routes.js        # POST /register, /login
│       ├── devices.routes.js     # CRUD /api/devices
│       ├── pairing.routes.js     # Alur pairing TV baru (lihat bawah)
│       ├── playlist.routes.js    # CRUD & activate/deactivate /api/devices/:id/playlist
│       ├── contents.routes.js    # CRUD /api/contents
│       ├── pushContent.routes.js # POST /api/push-content
│       └── health.routes.js      # GET /api/health
├── .env.example
└── package.json
```

## Instalasi

```bash
npm install
cp .env.example .env
```

Isi `.env`:
```
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
JWT_SECRET=ganti-dengan-secret-yang-sangat-rahasia
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Jalankan:
```bash
npm run dev     # dengan nodemon, auto-restart
npm start       # tanpa nodemon
```

Server berjalan di `http://localhost:5000`, WebSocket di `ws://localhost:5000/ws`, dan dokumentasi API interaktif di `http://localhost:5000/api-docs`.

## Model Data Utama

- **admins** — akun admin, login pakai email + password (bcrypt hash).
- **devices** — representasi satu TV/layar. Field penting:
  - `status`: `online` / `offline` (di-update otomatis lewat koneksi WebSocket).
  - `mode`: `single` (menampilkan `current_content_id`) atau `playlist` (memutar `playlist_items` bergantian).
  - `ws_token`: token rahasia unik per device untuk autentikasi koneksi `/ws`.
  - `paired`: `true` jika device sudah tersambung ke sebuah aplikasi Electron. Device dengan `paired = false` adalah yang muncul di dropdown saat approve pairing.
- **contents** — konten (image/video/url) yang bisa didorong ke device.
- **playlist_items** — urutan konten + durasi tayang per device saat `mode = playlist`.
- **pairing_codes** — kode sementara (10 menit) yang diminta Electron client saat pertama kali dijalankan.

## Alur Pairing TV Baru

Berbeda dari CRUD device biasa — pairing **tidak membuat device baru**, tapi menyambungkan device yang *sudah* dibuat manual oleh admin ke sebuah aplikasi Electron fisik:

1. Admin membuat device (nama + lokasi) lebih dulu lewat `POST /api/devices` — `paired` otomatis `false`.
2. Electron client (belum punya konfigurasi tersimpan) memanggil `POST /api/pairing/request` → server membuat baris di `pairing_codes` dengan kode 6-digit, lalu broadcast `pairing_requested` ke semua dashboard yang sedang terbuka.
3. Electron client polling `GET /api/pairing/:pairId/status` tiap beberapa detik menunggu status berubah.
4. Admin melihat kode di tab Pairing, memilih device tujuan (harus `paired = false`), lalu `POST /api/pairing/:pairId/approve` dengan body `{ deviceId }`. Server menandai device tersebut `paired = true` dan mengaitkan `ws_token`-nya ke pairing code.
5. Electron client mendapati status `approved` dari polling, menyimpan `deviceId` + `ws_token` secara lokal, dan langsung membuka layar display kontennya.

Device yang sudah `paired = true` tidak akan muncul lagi di dropdown approve — mencegah satu device tersambung ke dua aplikasi Electron sekaligus.

## Realtime (WebSocket)

Endpoint: `ws://localhost:5000/ws`

Dua jenis koneksi:
- **Device/layar**: `?deviceId=<id>&token=<ws_token>` — mengirim status online/offline, menerima event `content_pushed`, `playlist_updated`, dll.
- **Dashboard**: `?role=dashboard&token=<jwt-admin>` — menerima semua broadcast (`device_created`, `device_updated`, `device_deleted`, `pairing_requested`, `pairing_approved`, `pairing_rejected`, dst).

Verifikasi token dilakukan di `server.on('upgrade')`, **sebelum** koneksi WebSocket benar-benar terbentuk — koneksi dengan token tidak valid ditolak `401` di level HTTP upgrade.

## Dokumentasi API (Swagger)

Semua endpoint (Auth, Devices, Pairing, Playlist, Contents, Push Content, Health) didokumentasikan di `src/docs/openapi.js` dan bisa dicoba langsung lewat Swagger UI di `/api-docs` selama server berjalan.
