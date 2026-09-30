import { useEffect, useState } from "react";

/**
 * Visible on first paint (all pages). Scroll down hides; scroll up shows.
 * Home at scrollY=0 still follows direction so the bar can hide as soon as the user starts scrolling down.
 */
export function usePromoBarVisible(isHome: boolean): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(window.scrollY <= 0);

    let lastScrollY = window.scrollY;

    const sync = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;

      if (isHome && y <= 0) {
        if (delta > 0) {
          setVisible(false);
        } else if (delta < 0) {
          setVisible(true);
        }
        lastScrollY = y;
        return;
      }

      if (!isHome && y <= 0) {
        setVisible(true);
        lastScrollY = y;
        return;
      }

      if (delta > 0) {
        setVisible(false);
      } else if (delta < 0) {
        setVisible(true);
      }

      lastScrollY = y;
    };

    const onWheel = (event: WheelEvent) => {
      if (!isHome || window.scrollY > 0) return;
      if (event.deltaY < 0) {
        setVisible(true);
      } else if (event.deltaY > 0) {
        setVisible(false);
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("wheel", onWheel);
    };
  }, [isHome]);

  return visible;
}
