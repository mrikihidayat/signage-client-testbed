export default function SlideDots({ total, activeIndex, onSelect }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Slide ${index + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/25 hover:bg-white/40'
          }`}
        />
      ))}
    </div>
  );
}
