import { useEffect, useState, type RefObject } from "react";

const FACTORS = [0, 0.15, 0.25] as const;

/**
 * Parallax for 3 category cards: index 0 static; 1 → 0.15; 2 → 0.25.
 * Active only while section intersects viewport; updates via rAF.
 */
export function useCategoryCardsParallax(sectionRef: RefObject<HTMLElement | null>): string[] {
  const [transforms, setTransforms] = useState<string[]>(() => FACTORS.map(() => ""));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let sectionTop = 0;
    let isVisible = false;
    let frame = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = window.scrollY + rect.top;
    };

    const sync = () => {
      frame = 0;
      if (!isVisible) return;

      const delta = window.scrollY - sectionTop;
      const next = FACTORS.map((factor) =>
        factor === 0 || delta <= 0
          ? ""
          : `translate3d(0, ${-delta * factor}px, 0)`,
      );

      setTransforms((prev) => (prev.join("|") === next.join("|") ? prev : next));
    };

    const onScroll = () => {
      if (!isVisible || frame) return;
      frame = requestAnimationFrame(sync);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measure();
          sync();
        } else {
          setTransforms(FACTORS.map(() => ""));
        }
      },
      { root: null, threshold: 0, rootMargin: "12% 0px 12% 0px" },
    );

    measure();
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      if (isVisible) sync();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef]);

  return transforms;
}
