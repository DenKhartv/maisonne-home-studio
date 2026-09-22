import { useEffect, type RefObject } from "react";

/** Match sticky track height to the photo collage (desktop only). */
export function useFabricStickyTrackHeight(
  collageRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const collage = collageRef.current;
    const track = trackRef.current;
    if (!collage || !track) return;

    const mq = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      if (!mq.matches) {
        track.style.height = "";
        return;
      }
      track.style.height = `${collage.offsetHeight}px`;
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(collage);
    window.addEventListener("resize", apply, { passive: true });
    mq.addEventListener("change", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      mq.removeEventListener("change", apply);
      track.style.height = "";
    };
  }, [collageRef, trackRef]);
}
