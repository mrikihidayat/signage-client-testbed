export default function PairedBadge({ paired }) {
  if (paired) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
      Belum dipasangkan
    </span>
  );
}
