# Signage Control Panel — Electron Client

Aplikasi desktop yang dijalankan di tiap TV/layar fisik. Membungkus halaman Display Client (dari `client/`) dalam mode kiosk (fullscreen, tanpa menu, tanpa bisa di-klik keluar), dan menangani proses pairing otomatis saat pertama kali dinyalakan.

## Alur Kerja

1. **Belum pernah pairing** (tidak ada `device-pairing.json` tersimpan) → aplikasi otomatis meminta kode pairing ke server (`POST /api/pairing/request`) dan menampilkannya fullscreen (`pairing.html`). Aplikasi lalu polling status tiap beberapa detik menunggu admin approve dari Dashboard.
2. **Admin approve** dari tab Pairing di Dashboard (pilih device tujuan dari dropdown) → aplikasi mendapati status `approved`, menyimpan `deviceId` + `ws_token` ke disk (`app.getPath('userData')/device-pairing.json`), lalu langsung membuka jendela Display yang menampilkan konten device tersebut.
3. **Sudah pernah pairing** → konfigurasi dibaca dari disk, langsung buka jendela Display tanpa perlu pairing ulang.

## Struktur Folder

```
electron/
├── main.js                # Entry point: resolve config → buka window pairing/display, global shortcuts
├── pairing.html            # Halaman fullscreen penampil kode pairing
├── src/
│   ├── config.js           # APP_BASE_URL, API_BASE_URL, ICON_PATH, mode kiosk, override via env
│   ├── api.js               # Pemanggil REST API pairing (request & cek status)
│   ├── store.js             # Baca/tulis konfigurasi device ke disk
│   ├── pairingWindow.js     # Window + logic alur pairing (poll status, tampilkan kode/error)
│   └── displayWindow.js     # Window yang memuat halaman /display/:deviceId dari client
├── assets/
│   └── icon.ico             # Icon aplikasi & installer (taruh file .ico kamu di sini)
└── package.json
```

## Konfigurasi

Diatur lewat environment variable saat menjalankan aplikasi (lihat `src/config.js`):

| Variable | Default | Keterangan |
|---|---|---|
| `APP_BASE_URL` | `http://localhost:5173` | Alamat client (halaman Display dibuka dari sini) |
| `API_BASE_URL` | `http://localhost:5000` | Alamat server (request pairing & cek status) |
| `KIOSK_MODE` | `true` | Set `false` untuk mode windowed (tidak fullscreen) saat testing |
| `DEVICE_ID` + `DEVICE_TOKEN` | — | Kalau diisi keduanya, pairing dilewati sepenuhnya — langsung pakai device ini (berguna untuk testing manual) |

> Untuk TV produksi, `APP_BASE_URL`/`API_BASE_URL` harus menunjuk ke alamat server & client production, bukan `localhost`.

## Menjalankan (Development / Testing)

```bash
npm install
npm start                # mode kiosk (fullscreen)
npm run start:windowed   # mode windowed, enak buat testing
```

### Global Shortcuts (mode kiosk)
| Shortcut | Fungsi |
|---|---|
| `Ctrl+Shift+Q` | Keluar dari aplikasi |
| `Ctrl+Shift+R` | Reload paksa layar |
| `Ctrl+Shift+U` | Hapus konfigurasi pairing tersimpan & mulai ulang alur pairing |

## Build Installer untuk TV Produksi

Aplikasi ini di-package pakai **electron-builder** jadi installer `.exe` (Windows/NSIS) — TV target **tidak perlu** Node.js/npm sama sekali, cukup jalankan installer-nya.

```bash
npm install
npm run build:win
```

Hasilnya: `electron/dist/Signage Display Setup <versi>.exe`. Copy ke TV target, install sekali (installer akan menawarkan pilihan folder instalasi + membuat shortcut Desktop & Start Menu), lalu jalankan.

Konfigurasi packaging ada di `build` di `package.json` — icon diambil dari `assets/icon.ico`.

### Auto-launch saat Windows Startup

Versi yang sudah di-install (packaged) otomatis mendaftarkan dirinya untuk jalan sendiri saat Windows startup (`app.setLoginItemSettings`) — TV tinggal dinyalakan, aplikasi langsung tampil tanpa perlu diklik manual. Ini **tidak aktif** saat dijalankan lewat `npm start` untuk development.
