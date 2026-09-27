import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { searchCatalog } from "@/lib/catalog-search";

function parseSearchQuery(search: Record<string, unknown>): { q?: string } {
  const raw = search.q;
  const q = typeof raw === "number" ? String(raw) : raw;
  if (typeof q === "string" && q.trim()) return { q: q.trim() };
  return {};
}

function countLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
}

export const Route = createFileRoute("/search")({
  validateSearch: parseSearchQuery,
  head: ({ search }) => ({
    meta: [
      { title: search.q ? `Поиск: ${search.q} — Форма` : "Поиск — Форма" },
      { name: "description", content: "Поиск по каталогу премиальной мебели Форма." },
      { property: "og:title", content: search.q ? `Поиск: ${search.q} — Форма` : "Поиск — Форма" },
      { property: "og:description", content: "Найдите диваны, кровати и кресла Форма." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const results = q ? searchCatalog(q) : [];

  useEffect(() => {
    setValue(q ?? "");
  }, [q]);

  useEffect(() => {
    const next = value.trim();
    const current = (q ?? "").trim();
    if (next === current) return;
    const id = window.setTimeout(() => {
      void navigate({
        to: "/search",
        search: next ? { q: next } : {},
        replace: true,
      });
    }, 200);
    return () => window.clearTimeout(id);
  }, [value, q, navigate]);

  return (
    <div className="page-wrap overflow-x-clip pb-28 pt-32 md:pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Поиск</p>
      <h1 className="font-display mt-4 text-4xl font-medium tracking-tight md:text-6xl md:font-semibold">
        {q ? `Результаты поиска для: ${q}` : "Поиск по каталогу"}
      </h1>

      <form
        className="mt-8 flex min-w-0 max-w-xl items-center gap-2 border-b border-border"
        onSubmit={(event) => {
          event.preventDefault();
          const next = value.trim();
          void navigate({
            to: "/search",
            search: next ? { q: next } : {},
            replace: true,
          });
        }}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Поиск по каталогу"
          autoComplete="off"
          enterKeyHint="search"
          inputMode="search"
          aria-label="Поиск по каталогу"
          className="min-w-0 flex-1 appearance-none bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </form>

      {!q ? (
        <p className="mt-8 max-w-xl text-sm leading-7 text-copy">
          Введите запрос, чтобы найти товары по названию или коллекции.
        </p>
      ) : results.length ? (
        <>
          <p className="mt-5 text-sm text-muted-foreground">
            {results.length} {countLabel(results.length)}
          </p>
          <div className="mt-10 grid min-w-0 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 max-w-xl">
          <p className="text-lg font-medium">Ничего не найдено</p>
          <p className="mt-3 text-sm leading-7 text-copy">Попробуйте изменить запрос или проверить написание.</p>
          <Link to="/" className="mt-8 inline-block text-sm underline underline-offset-4">
            Вернуться на главную
          </Link>
        </div>
      )}
    </div>
  );
}
