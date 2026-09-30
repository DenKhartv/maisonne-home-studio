import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getCategory, products, sofaSeatFilters, sortProducts, type CatalogSort, type SofaSeats } from "@/lib/catalog";
import { CatalogSortSelect } from "@/components/CatalogSortSelect";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sofaSeatsValues = sofaSeatFilters.map((item) => item.id);

function parseSeatsSearch(search: Record<string, unknown>): { seats?: SofaSeats } {
  const raw = search.seats;
  const seats = typeof raw === "number" ? String(raw) : raw;
  if (typeof seats === "string" && sofaSeatsValues.includes(seats as SofaSeats)) {
    return { seats: seats as SofaSeats };
  }
  return {};
}

export const Route = createFileRoute("/category/$slug")({
  validateSearch: parseSeatsSearch,
  loader: ({ params }) => { const category = getCategory(params.slug); if (!category) throw notFound(); return category; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.name ?? "Категория"} — Форма` },
    { name: "description", content: `Премиальная мебель Форма: ${loaderData?.name ?? "каталог"}.` },
    { property: "og:title", content: `${loaderData?.name ?? "Категория"} — Форма` },
    { property: "og:description", content: "Тёплый современный дизайн и материалы, выбранные для долгой жизни." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: CategoryPage,
});

function CategoryPage() {
  const category = Route.useLoaderData();
  const { seats } = Route.useSearch();
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<CatalogSort>("default");
  const items = useMemo(() => {
    const matching = products.filter((p) => p.category === category.slug);
    const filtered =
      category.slug === "sofas" && seats ? matching.filter((p) => p.seats === seats) : matching;
    return sortProducts(filtered, sort);
  }, [category.slug, sort, seats]);
  return (
    <div className="page-wrap pb-20 pt-32 md:pb-24 md:pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Каталог мебели</p>
      <h1 className="font-display mt-3 text-6xl font-semibold md:mt-4 md:text-8xl">{category.name}</h1>
      <div className="mt-4 max-w-2xl text-sm leading-7 text-copy md:mt-5">
        <p>Продуманные формы, глубокий комфорт и спокойная палитра для интерьеров, в которых хочется оставаться.</p>
        {expanded && (
          <p className="mt-3">
            Каждая модель создаётся с вниманием к пропорциям, долговечности и тактильным ощущениям. Выберите подходящую ткань и оттенок.
          </p>
        )}
        <Button variant="link" className="mt-1 h-auto px-0 py-0" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Свернуть" : "Читать далее"}
        </Button>
      </div>
      {category.slug === "sofas" && (
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:snap-none">
          {sofaSeatFilters.map((filter) => {
            const active = seats === filter.id;
            return (
              <Link
                key={filter.id}
                to="/category/$slug"
                params={{ slug: "sofas" }}
                search={active ? {} : { seats: filter.id }}
                replace
                aria-current={active ? "true" : undefined}
                className="group w-[min(72vw,18rem)] shrink-0 snap-start md:w-auto md:min-w-0"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-[24px] transition-[box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "ring-1 ring-foreground/25 ring-offset-2 ring-offset-background" : seats ? "opacity-70" : "opacity-100",
                  )}
                >
                  <img
                    src={filter.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <span
                  className={cn(
                    "mt-3 block text-sm tracking-[0.02em] transition-colors duration-500",
                    active ? "font-medium text-foreground" : "text-copy",
                  )}
                >
                  {filter.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
      <div className="mt-8 mb-6 flex flex-wrap items-center justify-end border-y border-border py-3 text-sm">
        <CatalogSortSelect value={sort} onChange={setSort} />
      </div>
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/" className="text-sm underline underline-offset-4">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
