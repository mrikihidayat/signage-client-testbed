import HeroIllustration from './illustrations/HeroIllustration';
import BroadcastIllustration from './illustrations/BroadcastIllustration';
import PlaylistIllustration from './illustrations/PlaylistIllustration';
import MonitorIllustration from './illustrations/MonitorIllustration';

export const AUTH_SLIDES = [
  {
    key: 'hero',
    title: 'Kendalikan seluruh layar digital signage Anda dari satu tempat.',
    description:
      'Dashboard terpusat untuk mengelola konten, playlist, dan status perangkat secara real-time dibangun untuk kebutuhan operasional perusahaan.',
    illustration: HeroIllustration,
  },
  {
    key: 'push',
    title: 'Push konten ke banyak layar secara real-time.',
    description:
      'Kirim gambar, video, atau URL ke satu layar atau ratusan sekaligus — tampil instan tanpa perlu menyentuh TV-nya satu per satu.',
    illustration: BroadcastIllustration,
  },
  {
    key: 'playlist',
    title: 'Atur playlist & jadwal tayang otomatis.',
    description:
      'Susun urutan konten dan durasi tayangnya, biarkan sistem memutar semuanya secara otomatis dan berulang di setiap layar.',
    illustration: PlaylistIllustration,
  },
  {
    key: 'monitor',
    title: 'Pantau status online/offline tiap device.',
    description:
      'Ketahui kondisi setiap layar secara real-time langsung terlihat begitu ada perangkat yang terputus.',
    illustration: MonitorIllustration,
  },
];
