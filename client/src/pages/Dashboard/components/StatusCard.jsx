export default function StatusCard({ label, value, icon: Icon, accent }) {
  const accentClasses = {
    primary: 'bg-primary/10 text-primary-dark',
    secondary: 'bg-secondary/10 text-secondary',
    muted: 'bg-inktext/5 text-inktext-muted',
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-5 flex items-center gap-4 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-inktext dark:text-white">{value}</p>
        <p className="text-xs text-inktext-muted dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
