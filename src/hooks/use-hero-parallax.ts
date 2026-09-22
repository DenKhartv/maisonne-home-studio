import { useEffect, type RefObject } from "react";

const PARALLAX_FACTOR = 0.32;

export function useHeroParallax(
  sectionRef: RefObject<HTMLElement | null>,
  imageRef: RefObject<HTMLImageElement | null>,
) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const sync = () => {
      frame = 0;
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;

      const rect = section.getBoundingClientRect();
      const scrolledInHero = Math.min(Math.max(-rect.top, 0), section.offsetHeight);
      const y = scrolledInHero * PARALLAX_FACTOR;
      image.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef, imageRef]);
}
