function animateScrollTo(end: number, durationMs: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: end, left: 0, behavior: "auto" });
    return;
  }

  const start = window.scrollY;
  const distance = end - start;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();

  const scrollNow = (y: number) => {
    window.scrollTo({ top: y, left: 0, behavior: "instant" });
  };

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / durationMs, 1);
    const eased = 1 - (1 - progress) ** 3;
    scrollNow(start + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/** Плавный скролл наверх (главная). */
export function smoothScrollToTop(durationMs = 720) {
  animateScrollTo(0, durationMs);
}

/** Плавный скролл (rAF); extraDown — «нырок» чуть ниже якоря. */
export function smoothScrollToId(
  id: string,
  options?: { durationMs?: number; topGap?: number; extraDown?: number },
) {
  const { durationMs = 720, topGap = 88, extraDown = 56 } = options ?? {};
  const target = document.getElementById(id);
  if (!target) return;

  const end = target.getBoundingClientRect().top + window.scrollY - topGap + extraDown;
  animateScrollTo(end, durationMs);
}
