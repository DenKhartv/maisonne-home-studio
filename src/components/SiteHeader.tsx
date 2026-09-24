import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { useShoppingCounts } from "@/hooks/use-shopping-counts";
import { FurnitureNavDropdown } from "@/components/FurnitureNavDropdown";
import { smoothScrollToId, smoothScrollToTop } from "@/lib/smooth-scroll";

const SCROLL_THRESHOLD = 16;

function IconBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-olive px-1 text-[10px] font-semibold leading-none text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

type SiteHeaderProps = {
  topOffsetPx?: number;
};

export function SiteHeader({ topOffsetPx = 0 }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const router = useRouter();
  const { favoritesCount, cartCount } = useShoppingCounts();
  const isHome = location.pathname === "/";
  const atHero = isHome && !scrolled;

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const next = window.scrollY > SCROLL_THRESHOLD;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, [location.pathname]);

  const navLinkClass = (active: boolean) =>
    [
      "font-sans font-medium uppercase tracking-[0.06em] transition-[color,font-size] duration-300 ease-out",
      scrolled ? "text-[10px] md:text-[11px]" : "text-[11px] md:text-xs",
      active
        ? "text-olive underline decoration-olive/45 underline-offset-[6px]"
        : "text-foreground hover:text-olive",
    ].join(" ");

  const isFurnitureSection =
    location.pathname.startsWith("/category") ||
    location.pathname.startsWith("/product") ||
    location.pathname.startsWith("/collection");

  const goToContacts = (event: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      event.preventDefault();
      smoothScrollToId("contacts", { durationMs: 720, extraDown: 32 });
    }
  };

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      event.preventDefault();
      smoothScrollToTop(720);
    }
  };

  return (
    <header
      style={{ top: topOffsetPx }}
      className={`fixed inset-x-0 z-50 transition-[top,background-color,box-shadow,border-color] duration-300 ease-out ${
        atHero
          ? "hero-header-glass"
          : scrolled
            ? "border-b border-border/60 bg-background shadow-[0_8px_30px_-20px_rgba(41,39,35,0.35)]"
            : "border-b border-border/40 bg-background shadow-none"
      }`}
    >
      <div
        className={`page-wrap grid grid-cols-[1fr_auto_1fr] items-center transition-[height,padding] duration-300 ease-out ${
          scrolled ? "h-[64px]" : "h-[88px] md:h-[96px]"
        }`}
      >
        <Link
          to="/"
          onClick={goHome}
          className={`font-logo w-fit font-semibold transition-[font-size,opacity] duration-300 ease-out hover:opacity-60 ${
            scrolled ? "text-[15px]" : "text-[17px] md:text-[18px]"
          }`}
        >
          Форма
          <span className="relative -top-2 ml-px text-[7px] font-semibold tracking-normal">®</span>
        </Link>

        <nav
          className="flex items-center justify-center gap-4 overflow-visible px-2 md:gap-8 lg:gap-10"
          aria-label="Основная навигация"
        >
          <Link to="/about" className={navLinkClass(location.pathname === "/about")}>
            О бренде
          </Link>
          <FurnitureNavDropdown navLinkClass={navLinkClass} isFurnitureSection={isFurnitureSection} />
          <Link to="/faq" className={navLinkClass(location.pathname === "/faq")}>
            FAQ
          </Link>
          <a href="/#contacts" onClick={goToContacts} className={navLinkClass(false)}>
            Контакты
          </a>
        </nav>

        <div className="flex items-center justify-end gap-0.5 md:gap-1">
          <Button
            variant="ghost"
            size="compactIcon"
            aria-label="Поиск"
            title="Поиск"
            className="hover:bg-olive/10 hover:text-olive"
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="compactIcon"
            aria-label={`Избранное${favoritesCount ? `, ${favoritesCount}` : ""}`}
            title="Избранное"
            className="relative hover:bg-olive/10 hover:text-olive"
            onClick={() => router.navigate({ to: "/category/$slug", params: { slug: "sofas" } })}
          >
            <Heart />
            <IconBadge count={favoritesCount} />
          </Button>
          <Button
            variant="ghost"
            size="compactIcon"
            aria-label={`Мои заявки${cartCount ? `, ${cartCount}` : ""}`}
            title="Мои заявки"
            className="relative hover:bg-olive/10 hover:text-olive"
            onClick={() => router.navigate({ to: "/category/$slug", params: { slug: "sofas" } })}
          >
            <ShoppingBag />
            <IconBadge count={cartCount} />
          </Button>
        </div>
      </div>
    </header>
  );
}
