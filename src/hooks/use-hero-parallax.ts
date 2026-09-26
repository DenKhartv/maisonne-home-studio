import { useEffect, type RefObject } from "react";

/** Приближение «камеры» к кадру за полный проход героя: 1 → 1.12. */
const MEDIA_ZOOM = 0.12;
/** Вертикальный дрейф кадра — движение камеры, а не классический parallax. */
const MEDIA_DRIFT = 0.18;
/** Текст уходит вверх ощутимо быстрее изображения. */
const CONTENT_LIFT = 0.3;
/** Доля прогресса, на которой текст полностью растворяется. */
const CONTENT_FADE_END = 0.55;
/** Читаемость уступает место кадру, но не исчезает совсем. */
const SCRIM_MIN = 0.4;
const SCRIM_FADE_END = 0.7;

/** Мягкий старт и мягкое завершение движения. */
const smoothstep = (value: number) => value * value * (3 - 2 * value);

export function useHeroParallax(
  sectionRef: RefObject<HTMLElement | null>,
  mediaRef: RefObject<HTMLElement | null>,
  contentRef?: RefObject<HTMLElement | null>,
  scrimRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const sync = () => {
      frame = 0;
      const section = sectionRef.current;
      const media = mediaRef.current;
      if (!section || !media) return;

      const height = section.offsetHeight || 1;
      const rect = section.getBoundingClientRect();
      const scrolled = Math.min(Math.max(-rect.top, 0), height);
      const progress = scrolled / height;

      const zoom = 1 + smoothstep(progress) * MEDIA_ZOOM;
      media.style.transform = `translate3d(0, ${(scrolled * MEDIA_DRIFT).toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`;

      const content = contentRef?.current;
      if (content) {
        const fade = Math.min(progress / CONTENT_FADE_END, 1);
        content.style.transform = `translate3d(0, ${(-scrolled * CONTENT_LIFT).toFixed(2)}px, 0)`;
        content.style.opacity = `${(1 - fade).toFixed(3)}`;
        content.style.pointerEvents = fade >= 1 ? "none" : "";
      }

      const scrim = scrimRef?.current;
      if (scrim) {
        const fade = Math.min(progress / SCRIM_FADE_END, 1);
        scrim.style.opacity = `${(1 - fade * (1 - SCRIM_MIN)).toFixed(3)}`;
      }
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
  }, [sectionRef, mediaRef, contentRef, scrimRef]);
}
