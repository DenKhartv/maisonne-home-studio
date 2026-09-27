import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { searchCatalogPreview } from "@/lib/catalog-search";
import { cn } from "@/lib/utils";

type CatalogSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topOffsetPx: number;
  headerHeight: number;
};

function queryFromLocationSearch(search: unknown) {
  if (search && typeof search === "object" && "q" in search) {
    const value = (search as { q?: unknown }).q;
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
  }
  return "";
}

export function CatalogSearch({ open, onOpenChange, topOffsetPx, headerHeight }: CatalogSearchProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const [query, setQuery] = useState("");
  const preview = searchCatalogPreview(query);

  useEffect(() => {
    if (!open) return;
    setQuery(queryFromLocationSearch(location.search));
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open, location.search]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-catalog-search-trigger]")) return;
      onOpenChange(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  const goToResults = () => {
    const next = query.trim();
    if (!next) return;
    onOpenChange(false);
    void navigate({ to: "/search", search: { q: next } });
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-[48] bg-coffee/10"
        style={{ top: topOffsetPx + headerHeight }}
        aria-hidden
      />
      <div
        ref={panelRef}
        id="catalog-search"
        className="fixed inset-x-0 z-[52] max-w-[100vw] overflow-x-clip border-b border-border/60 bg-background shadow-[0_16px_40px_-28px_rgba(41,39,35,0.45)]"
        style={{ top: topOffsetPx + headerHeight }}
      >
        <div className="page-wrap min-w-0 py-4 md:py-5">
          <form
            className="flex min-w-0 items-center gap-2 border-b border-border"
            onSubmit={(event) => {
              event.preventDefault();
              goToResults();
            }}
          >
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по каталогу"
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              aria-label="Поиск по каталогу"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  goToResults();
                }
              }}
              className="min-w-0 flex-1 appearance-none bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="compactIcon"
              aria-label="Закрыть поиск"
              className="shrink-0 hover:bg-olive/10 hover:text-olive"
              onClick={() => onOpenChange(false)}
            >
              <X />
            </Button>
          </form>

          {query.trim() ? (
            <div className="mt-3 max-h-[min(60vh,28rem)] overflow-y-auto">
              {preview.items.length ? (
                <>
                  <ul className="divide-y divide-border/70">
                    {preview.items.map((product) => (
                      <li key={product.slug}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-4 py-3 transition-colors duration-300 hover:bg-secondary/50"
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-14 w-14 max-w-full shrink-0 rounded-2xl object-cover md:h-16 md:w-16"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium md:text-base">{product.name}</span>
                            <span className="font-price mt-1 block text-sm text-copy">от {product.price}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {preview.hasMore && (
                    <button
                      type="button"
                      className="mt-2 w-full py-3 text-left text-sm text-copy transition-colors duration-300 hover:text-foreground"
                      onClick={goToResults}
                    >
                      Показать все результаты
                      <span aria-hidden className="ml-1">
                        →
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <div className="py-6">
                  <p className="text-sm font-medium">Ничего не найдено</p>
                  <p className="mt-2 text-sm leading-6 text-copy">Попробуйте изменить запрос или проверить написание.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>,
    document.body,
  );
}

export function CatalogSearchTrigger({
  open,
  onOpenChange,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="compactIcon"
      data-catalog-search-trigger
      aria-label={open ? "Закрыть поиск" : "Поиск"}
      title="Поиск"
      aria-expanded={open}
      aria-controls="catalog-search"
      className={cn("hover:bg-olive/10 hover:text-olive", className)}
      onClick={() => onOpenChange(!open)}
    >
      {open ? <X /> : <Search />}
    </Button>
  );
}
