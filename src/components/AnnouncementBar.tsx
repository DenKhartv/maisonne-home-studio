import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const ANNOUNCEMENT_BAR_HEIGHT_PX = 40;

const MESSAGES = [
  "Зарегистрируйтесь и получите скидку 10% на первый заказ",
  "Бесплатная доставка по Москве при заказе от 150 000 ₽",
  "Новая коллекция Puffy — уже в каталоге",
] as const;

const ROTATE_MS = 4500;
const FADE_MS = 300;

type AnnouncementBarProps = {
  visible: boolean;
  isHome?: boolean;
};

export function AnnouncementBar({ visible, isHome = false }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);
  const [messageVisible, setMessageVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = window.setInterval(() => {
      setMessageVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setMessageVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(interval);
      if (fadeTimeout) window.clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Акции и новости"
      className={cn(
        isHome ? "announcement-bar-home" : "announcement-bar-glass",
        "fixed inset-x-0 top-0 z-[55] overflow-hidden text-foreground transition-transform duration-300 ease-out",
        !visible && "-translate-y-full pointer-events-none",
      )}
      style={{ height: ANNOUNCEMENT_BAR_HEIGHT_PX }}
    >
      <div className="page-wrap relative flex h-full items-center justify-center px-10 sm:px-12">
        <p
          className={cn(
            "max-w-[min(100%,42rem)] text-balance text-center font-sans text-[11px] font-normal leading-snug tracking-[0.06em] text-foreground/85 transition-opacity duration-300 ease-out sm:text-xs",
            !messageVisible && "opacity-0",
          )}
        >
          {MESSAGES[index]}
        </p>
        <p className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[10px] tabular-nums tracking-wide text-foreground/45 sm:text-[11px]">
          {index + 1} / {MESSAGES.length}
        </p>
      </div>
    </div>
  );
}
