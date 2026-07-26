const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Signage Control Panel API',
    description: 'REST API untuk mengelola device, konten, dan playlist digital signage. MJ Solution Indonesia.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [
    { name: 'Auth' },
    { name: 'Devices' },
    { name: 'Pairing' },
    { name: 'Playlist' },
    { name: 'Contents' },
    { name: 'Push Content' },
    { name: 'Health' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Admin: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nama: { type: 'string' },
          email: { type: 'string' },
          created_at: { type: 'string' },
        },
      },
      Device: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nama: { type: 'string' },
          lokasi: { type: 'string' },
          status: { type: 'string', enum: ['online', 'offline'] },
          mode: { type: 'string', enum: ['single', 'playlist'] },
          current_content_id: { type: 'string', nullable: true },
          ws_token: { type: 'string' },
          paired: { type: 'boolean', description: 'true jika device sudah tersambung ke sebuah aplikasi Electron' },
          last_seen: { type: 'string', nullable: true },
          contents: { $ref: '#/components/schemas/Content' },
        },
      },
      PairingCode: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          code: { type: 'string', description: 'Kode 6 digit yang ditampilkan di layar TV' },
          status: { type: 'string', enum: ['pending', 'approved', 'expired'] },
          device_id: { type: 'string', nullable: true },
          ws_token: { type: 'string', nullable: true },
          expires_at: { type: 'string' },
          created_at: { type: 'string' },
        },
      },
      Content: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          judul: { type: 'string' },
          tipe: { type: 'string', enum: ['image', 'video', 'url'] },
          payload_url: { type: 'string' },
          created_at: { type: 'string' },
        },
      },
      PlaylistItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          device_id: { type: 'string' },
          content_id: { type: 'string' },
          urutan: { type: 'integer' },
          durasi_detik: { type: 'integer' },
          contents: { $ref: '#/components/schemas/Content' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Cek status server',
        responses: { 200: { description: 'Server berjalan normal' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrasi admin baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama', 'email', 'password'],
                properties: {
                  nama: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registrasi berhasil' },
          400: { description: 'Input tidak valid' },
          409: { description: 'Email sudah terdaftar' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login berhasil, mengembalikan JWT token' },
          401: { description: 'Email atau password salah' },
        },
      },
    },
    '/devices': {
      get: {
        tags: ['Devices'],
        summary: 'Ambil semua device',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Daftar device' } },
      },
      post: {
        tags: ['Devices'],
        summary: 'Tambah device baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama', 'lokasi'],
                properties: {
                  nama: { type: 'string' },
                  lokasi: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Device berhasil ditambahkan' } },
      },
    },
    '/devices/{id}': {
      put: {
        tags: ['Devices'],
        summary: 'Update device',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama', 'lokasi'],
                properties: {
                  nama: { type: 'string' },
                  lokasi: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Device berhasil diperbarui' }, 404: { description: 'Device tidak ditemukan' } },
      },
      delete: {
        tags: ['Devices'],
        summary: 'Hapus device',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Device berhasil dihapus' } },
      },
    },
    '/devices/{deviceId}/playlist': {
      get: {
        tags: ['Playlist'],
        summary: 'Ambil playlist milik device',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Daftar item playlist' }, 404: { description: 'Device tidak ditemukan' } },
      },
      post: {
        tags: ['Playlist'],
        summary: 'Tambah konten ke playlist device',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['contentId'],
                properties: {
                  contentId: { type: 'string' },
                  durasi_detik: { type: 'integer', default: 10 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Item playlist berhasil ditambahkan' } },
      },
    },
    '/devices/{deviceId}/playlist/reorder': {
      put: {
        tags: ['Playlist'],
        summary: 'Ubah urutan item playlist',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['order'],
                properties: {
                  order: { type: 'array', items: { type: 'string' }, description: 'Array id playlist item sesuai urutan baru' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Urutan playlist berhasil diperbarui' } },
      },
    },
    '/devices/{deviceId}/playlist/{itemId}': {
      put: {
        tags: ['Playlist'],
        summary: 'Update durasi tampil item playlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['durasi_detik'],
                properties: { durasi_detik: { type: 'integer' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Durasi item playlist berhasil diperbarui' }, 404: { description: 'Item tidak ditemukan' } },
      },
      delete: {
        tags: ['Playlist'],
        summary: 'Hapus item dari playlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Item playlist berhasil dihapus' } },
      },
    },
    '/devices/{deviceId}/playlist/activate': {
      post: {
        tags: ['Playlist'],
        summary: 'Aktifkan mode playlist pada device',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Mode playlist diaktifkan' }, 400: { description: 'Playlist masih kosong' } },
      },
    },
    '/devices/{deviceId}/playlist/deactivate': {
      post: {
        tags: ['Playlist'],
        summary: 'Nonaktifkan mode playlist, kembali ke konten tunggal',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Mode playlist dinonaktifkan' } },
      },
    },
    '/pairing/request': {
      post: {
        tags: ['Pairing'],
        summary: 'Diminta oleh aplikasi Electron saat pertama kali dijalankan untuk membuat kode pairing',
        responses: {
          201: {
            description: 'Kode pairing berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    pairId: { type: 'string' },
                    code: { type: 'string' },
                    expiresAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/pairing/{pairId}/status': {
      get: {
        tags: ['Pairing'],
        summary: 'Dipoll oleh aplikasi Electron untuk mengecek apakah kode sudah disetujui admin',
        parameters: [{ name: 'pairId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Status pairing saat ini (pending / approved / expired)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    status: { type: 'string', enum: ['pending', 'approved', 'expired'] },
                    deviceId: { type: 'string' },
                    wsToken: { type: 'string' },
                  },
                },
              },
            },
          },
          404: { description: 'Kode pairing tidak ditemukan' },
        },
      },
    },
    '/pairing': {
      get: {
        tags: ['Pairing'],
        summary: 'Ambil daftar kode pairing yang masih menunggu persetujuan',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Daftar pairing pending',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    pairings: { type: 'array', items: { $ref: '#/components/schemas/PairingCode' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/pairing/{pairId}/approve': {
      post: {
        tags: ['Pairing'],
        summary: 'Setujui kode pairing dan sambungkan ke device yang sudah ada di tab Devices',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'pairId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['deviceId'],
                properties: {
                  deviceId: { type: 'string', description: 'ID device yang sudah dibuat manual di tab Devices dan belum paired' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Device berhasil dipasangkan' },
          400: { description: 'Device tujuan wajib dipilih' },
          404: { description: 'Kode pairing atau device tidak ditemukan' },
          409: { description: 'Device tersebut sudah dipasangkan ke layar lain' },
        },
      },
    },
    '/pairing/{pairId}/reject': {
      post: {
        tags: ['Pairing'],
        summary: 'Tolak kode pairing',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'pairId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Kode pairing ditolak' } },
      },
    },
    '/contents': {
      get: {
        tags: ['Contents'],
        summary: 'Ambil semua konten',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Daftar konten' } },
      },
      post: {
        tags: ['Contents'],
        summary: 'Tambah konten baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['judul', 'tipe', 'payload_url'],
                properties: {
                  judul: { type: 'string' },
                  tipe: { type: 'string', enum: ['image', 'video', 'url'] },
                  payload_url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Konten berhasil ditambahkan' } },
      },
    },
    '/contents/{id}': {
      put: {
        tags: ['Contents'],
        summary: 'Update konten, otomatis re-push ke device aktif',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['judul', 'tipe', 'payload_url'],
                properties: {
                  judul: { type: 'string' },
                  tipe: { type: 'string', enum: ['image', 'video', 'url'] },
                  payload_url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Konten berhasil diperbarui' }, 404: { description: 'Konten tidak ditemukan' } },
      },
      delete: {
        tags: ['Contents'],
        summary: 'Hapus konten',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Konten berhasil dihapus' } },
      },
    },
    '/push-content': {
      post: {
        tags: ['Push Content'],
        summary: 'Push konten tunggal ke device secara real-time via WebSocket',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['deviceId', 'contentId'],
                properties: {
                  deviceId: { type: 'string' },
                  contentId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Konten berhasil dipush' }, 404: { description: 'Konten tidak ditemukan' } },
      },
    },
  },
};

module.exports = openapiSpec;
