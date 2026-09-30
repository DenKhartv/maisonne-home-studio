import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { collections, homeCategories } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type FurnitureNavDropdownProps = {
  navLinkClass: (active: boolean) => string;
  isFurnitureSection: boolean;
};

function MenuSectionTitle({ children }: { children: string }) {
  return (
    <p className="px-2 pb-3 pt-2 text-xs font-medium uppercase tracking-[0.07em] text-foreground/65 md:text-[13px]">
      {children}
    </p>
  );
}

export function FurnitureNavDropdown({ navLinkClass, isFurnitureSection }: FurnitureNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const close = () => setOpen(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const panel = (
    <div
      className={cn(
        "overflow-hidden rounded-[22px] border border-border/70 bg-background shadow-[0_20px_56px_-24px_rgba(41,39,35,0.38)]",
        "transition-[opacity,transform] duration-200 ease-out",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
      role="menu"
      aria-label="Каталог мебели"
    >
      <div className="grid md:grid-cols-2">
        <div className="p-3 pt-4 md:p-5 md:pr-3 md:pt-5">
          <MenuSectionTitle>Категории</MenuSectionTitle>
          <ul className="space-y-0.5">
            {homeCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  role="menuitem"
                  onClick={close}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-secondary"
                >
                  <span className="font-display text-base font-medium text-foreground transition group-hover:text-olive">
                    {category.name}
                  </span>
                  <img
                    src={category.image}
                    alt=""
                    width={40}
                    height={40}
                    className="ml-auto size-10 shrink-0 rounded-lg object-cover"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/80 p-3 pt-4 md:border-l md:border-t-0 md:p-5 md:pl-3 md:pt-5">
          <MenuSectionTitle>Коллекции</MenuSectionTitle>
          <ul className="space-y-0.5">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link
                  to="/collection/$slug"
                  params={{ slug: collection.slug }}
                  role="menuitem"
                  onClick={close}
                  className="block rounded-xl px-2 py-2.5 transition hover:bg-secondary"
                >
                  <span className="font-display block text-lg font-medium leading-tight text-foreground">{collection.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-copy">{collection.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const panelWrapClass =
    "absolute left-1/2 top-full z-50 w-[min(100vw-1.5rem,32rem)] -translate-x-1/2 pt-3";

  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      onMouseEnter={() => {
        if (!isMobile) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setOpen(false);
      }}
    >
      <div className="relative z-[60] inline-flex items-center gap-1">
        <Link to="/furniture" className={navLinkClass(isFurnitureSection)}>
          Мебель
        </Link>
        <button
          type="button"
          className={cn(navLinkClass(isFurnitureSection), "inline-flex items-center p-0")}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Категории мебели"
          onClick={() => {
            if (isMobile) {
              setOpen((value) => !value);
              return;
            }
            setOpen(true);
          }}
        >
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open ? "rotate-180" : "rotate-0")}
            aria-hidden
          />
        </button>
      </div>

      <div className={cn(panelWrapClass, !open && "pointer-events-none")} aria-hidden={!open}>
        {panel}
      </div>
    </div>
  );
}
