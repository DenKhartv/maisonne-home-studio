import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CatalogSortSelect } from "@/components/CatalogSortSelect";
import { ProductCard } from "@/components/ProductCard";
import { products, sortProducts, type CatalogSort } from "@/lib/catalog";

export const Route = createFileRoute("/furniture")({
  head: () => ({
    meta: [
      { title: "Мебель — Форма" },
      { name: "description", content: "Весь ассортимент мебели Форма: диваны, кровати, кресла и другие предметы." },
      { property: "og:title", content: "Мебель — Форма" },
      { property: "og:description", content: "Спокойный современный дизайн для дома." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FurniturePage,
});

function FurniturePage() {
  const [sort, setSort] = useState<CatalogSort>("default");
  const items = useMemo(() => sortProducts(products, sort), [sort]);

  return (
    <div className="page-wrap pb-20 pt-32 md:pb-24 md:pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Каталог мебели</p>
      <h1 className="font-display mt-3 text-6xl font-semibold md:mt-4 md:text-8xl">Мебель</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-copy md:mt-5">
        Весь ассортимент — диваны, кровати, кресла и другие предметы в спокойном современном дизайне.
      </p>
      <div className="mt-8 mb-6 flex flex-wrap items-center justify-end border-y border-border py-3 text-sm">
        <CatalogSortSelect value={sort} onChange={setSort} />
      </div>
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link to="/" className="text-sm underline underline-offset-4">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
