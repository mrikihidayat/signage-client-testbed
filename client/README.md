# Signage Control Panel — Client

Frontend React (Vite) untuk Signage Control Panel. Berisi dua bagian yang benar-benar terpisah secara fungsi meski satu codebase: **Dashboard Admin** (dipakai admin lewat browser) dan **Display Client** (halaman yang ditampilkan di TV, dibuka lewat browser biasa atau dibungkus Electron).

## Tech Stack

- **React 18** + **Vite** — build tool & dev server cepat
- **Tailwind CSS** — styling
- **React Router** — routing (`/login`, `/register`, `/`, `/display/:deviceId`)
- **Axios** — HTTP client ke server
- **Lucide Icons**

## Struktur Folder

```
client/
├── src/
│   ├── api/axios.js                # Instance axios + WS_BASE_URL, auto-attach JWT
│   ├── components/                 # Komponen shared (Modal, Toast, ThemeToggle, dst)
│   ├── context/ThemeContext.jsx    # Dark/light mode
│   ├── pages/
│   │   ├── Login.jsx / Register.jsx
│   │   ├── Dashboard/              # Dashboard Admin (lihat detail di bawah)
│   │   │   ├── index.jsx           # Perakitan halaman: wiring semua hooks + komponen
│   │   │   ├── constants.js
│   │   │   ├── components/         # Bagian UI: DevicesSection, ContentsSection, PairingSection, dst
│   │   │   │   └── modals/         # Semua modal (AddDevice, EditDevice, ApprovePairing, Playlist, dst)
│   │   │   └── hooks/              # Logic per domain, dipakai index.jsx
│   │   │       ├── useAdminSession.js
│   │   │       ├── useDevices.js
│   │   │       ├── useContents.js
│   │   │       ├── usePairing.js
│   │   │       ├── usePlaylist.js
│   │   │       ├── usePushContent.js
│   │   │       └── useDeviceSocket.js   # Koneksi WS dashboard, sinkron state realtime
│   │   └── DisplayClient/          # Halaman yang tampil di layar TV
│   │       ├── index.jsx
│   │       ├── components/         # ContentStage, ConnectionBadge, PlaylistBadge
│   │       └── hooks/              # useDisplaySocket, useDisplayContent, useCrossfadeLayers, dst
│   ├── App.jsx                     # Routing
│   └── main.jsx
├── env.example
└── package.json
```

Pola tiap fitur Dashboard: **1 hook (logic + state + API call) + 1-beberapa komponen (UI murni, terima props)**, dirakit di `Dashboard/index.jsx`. Modular per domain (Devices, Contents, Pairing, Playlist, Push Content) — nambah fitur baru cukup tambah hook + komponen baru, tanpa mengubah yang lain.

## Instalasi

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Opsional — buat `client/.env` (lihat `env.example`) kalau server tidak berjalan di `localhost:5000`:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_BASE_URL=ws://localhost:5000
```

## Halaman & Rute

| Rute | Halaman | Keterangan |
|---|---|---|
| `/login`, `/register` | Auth | Login/registrasi admin |
| `/` | Dashboard | Perlu login (JWT di localStorage), tab Devices / Konten / Pairing |
| `/display/:deviceId?token=...` | Display Client | Halaman yang dibuka di TV — menampilkan konten aktif device, terhubung ke WebSocket untuk update realtime tanpa refresh |

## Dashboard — Ringkasan Tab

- **Devices** — daftar semua TV: status online/offline, konten aktif, aksi (salin link display, edit, kelola playlist, push content, hapus).
- **Konten** — CRUD konten (image/video/url) dengan preview.
- **Pairing** — daftar kode pairing yang diminta TV baru. Approve = pilih device tujuan dari dropdown (device yang belum terpasang), bukan mengetik nama/lokasi ulang — device-nya sendiri dibuat lebih dulu di tab Devices.

Semua tab sinkron realtime lewat `useDeviceSocket` — device baru, status online/offline, dan pairing masuk/keluar langsung ter-refresh di UI tanpa reload halaman.

## Build Production

```bash
npm run build
```
Hasil ada di `client/dist/`, siap di-deploy ke static hosting apa pun (Vercel, Netlify, Nginx, dsb). Pastikan `VITE_API_BASE_URL` dan `VITE_WS_BASE_URL` sudah menunjuk ke alamat server production sebelum build.
