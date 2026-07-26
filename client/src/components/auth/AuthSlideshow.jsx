import { useEffect, useState } from 'react';
import SlideDots from './SlideDots';
import { AUTH_SLIDES } from './slides';

const AUTO_ADVANCE_MS = 5000;

export default function AuthSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const activeSlide = AUTH_SLIDES[activeIndex];
  const Illustration = activeSlide.illustration;

  return (
    <div className="relative z-10 max-w-sm">
      <div key={activeSlide.key} className="animate-fade-in">
        <div className="mb-7">
          <Illustration />
        </div>
        <h2 className="text-3xl font-bold leading-snug mb-3 min-h-[5.5rem]">{activeSlide.title}</h2>
        <p className="text-sm text-white/60 mb-7 min-h-[3.5rem]">{activeSlide.description}</p>
      </div>

      <SlideDots total={AUTH_SLIDES.length} activeIndex={activeIndex} onSelect={setActiveIndex} />
    </div>
  );
}
