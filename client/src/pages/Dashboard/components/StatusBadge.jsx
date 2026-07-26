export default function StatusBadge({ status }) {
  const isOnline = status === 'online';
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        isOnline ? 'bg-primary/10 text-primary-dark' : 'bg-inktext/5 text-inktext-muted'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-primary animate-pulse-dot' : 'bg-inktext-muted/50'}`}
      />
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}
