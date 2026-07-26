import { LogOut, X } from 'lucide-react';

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  navItems,
  activeTab,
  setActiveTab,
  admin,
  onLogoutRequest,
}) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-secondary dark:bg-slate-800 text-white flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-sm">Signage Panel</p>
          <p className="text-[11px] text-white/50">MJ Solution Indonesia</p>
        </div>
        <button className="lg:hidden ml-auto text-white/60" onClick={() => setSidebarOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-xs text-white/50 px-2 mb-2">{admin?.nama || 'Admin'}</p>
        <button
          onClick={onLogoutRequest}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
