import { Menu, Send } from 'lucide-react';
import ThemeToggle from '../../../components/ThemeToggle';

export default function Topbar({ setSidebarOpen, onPushClick }) {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-secondary/10 dark:border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-secondary dark:text-white" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-semibold text-secondary dark:text-white text-lg">
            Dashboard Admin
          </h1>
          <p className="text-xs text-inktext-muted dark:text-slate-400">Kelola device & konten signage secara real-time</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={onPushClick}
          className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-card"
        >
          <Send size={16} />
          Push Content
        </button>
      </div>
    </header>
  );
}
