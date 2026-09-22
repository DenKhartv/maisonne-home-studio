import { useEffect, useState } from "react";

/**
 * Home: hidden on first paint at top; scroll down hides; scroll up shows (including at scrollY=0).
 * Other pages: visible at top; scroll down hides, scroll up shows.
 */
export function usePromoBarVisible(isHome: boolean): boolean {
  const [visible, setVisible] = useState(() => (isHome ? false : true));

  useEffect(() => {
    if (isHome) {
      setVisible(false);
    } else {
      setVisible(window.scrollY <= 0);
    }

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
