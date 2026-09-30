import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FavoriteButton } from "@/components/FavoriteButton";
import { InteriorStrip } from "@/components/InteriorStrip";
import { CatalogSortSelect } from "@/components/CatalogSortSelect";
import { getCollectionProducts, sortProducts, type CatalogSort, type Collection, type Product } from "@/lib/catalog";

type CollectionTemplateProps = {
  collection: Collection;
};

export function CollectionTemplate({ collection }: CollectionTemplateProps) {
  const [sort, setSort] = useState<CatalogSort>("default");
  const items = useMemo(
    () => sortProducts(getCollectionProducts(collection.slug), sort),
    [collection.slug, sort],
  );

  return (
    <>
      <section className="page-wrap relative mt-24 overflow-hidden rounded-t-[28px] rounded-b-[12px] md:mt-28">
        <div className="relative h-[42vh] min-h-[280px] md:h-[48vh] md:min-h-[360px]">
          <img
            src={collection.image}
            alt={`Коллекция ${collection.name}`}
            className="h-full w-full object-cover object-[center_42%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coffee/70 via-coffee/15 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary-foreground/80">Коллекция</p>
            <h1 className="font-display mt-4 max-w-[12ch] text-6xl font-medium leading-[0.92] tracking-tight md:text-8xl md:font-semibold">
              {collection.name}
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-primary-foreground/90 md:text-lg">
              {collection.tagline}
            </p>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <h2 className="font-display text-2xl font-medium tracking-tight md:text-4xl md:font-semibold">
            Предметы коллекции
          </h2>
          <CatalogSortSelect value={sort} onChange={setSort} className="shrink-0 text-sm text-copy" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-10 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
          {items.map((product) => (
            <CollectionProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <InteriorStrip title="Аранжировки" italic={collection.name} />
    </>
  );
}

function CollectionProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative min-w-0">
      <div className="relative overflow-hidden rounded-[24px] bg-secondary aspect-[4/3] md:aspect-[5/4]">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={`Открыть ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1200}
            height={1008}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          />
        </Link>
        <span className="absolute left-4 top-4 rounded-full border border-olive/20 bg-background/80 px-3 py-1.5 text-[10px] tracking-[0.04em] text-olive/90">
          Доступны разные цвета
        </span>
        <FavoriteButton slug={product.slug} name={product.name} />
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block min-w-0">
        <h3 className="mt-5 text-xl font-medium leading-snug md:text-2xl">{product.name}</h3>
        <p className="font-price mt-2 text-sm text-copy">от {product.price}</p>
        <span className="mt-3 inline-flex items-center text-xs font-medium uppercase tracking-[0.07em] text-muted-foreground transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
          Смотреть
          <span aria-hidden className="ml-1">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
