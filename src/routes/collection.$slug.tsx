import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCollection, products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { InteriorStrip } from "@/components/InteriorStrip";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => { const collection = getCollection(params.slug); if (!collection) throw notFound(); return collection; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.name ?? "Коллекция"} — Форма` }, { name: "description", content: loaderData?.tagline ?? "Коллекция мебели Форма." },
    { property: "og:title", content: `${loaderData?.name ?? "Коллекция"} — Форма` }, { property: "og:description", content: loaderData?.tagline ?? "Коллекция мебели Форма." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();
  const own = products.filter((p) => p.collection === collection.slug);
  return <>
    <section className="page-wrap relative mt-24 h-[66vh] min-h-[520px] overflow-hidden rounded-[28px] md:mt-28"><img src={collection.image} alt={`Коллекция ${collection.name}`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-coffee/70 via-transparent to-transparent" /><div className="absolute bottom-10 left-8 text-primary-foreground md:bottom-16 md:left-16"><p className="text-xs font-medium uppercase tracking-[0.08em]">Коллекция</p><h1 className="font-display mt-3 text-6xl font-medium md:text-8xl md:font-semibold">{collection.name}</h1><p className="mt-3 text-lg font-medium">{collection.tagline}</p></div></section>
    <section className="page-wrap section-pad"><h2 className="font-display text-4xl font-medium md:text-6xl md:font-semibold">Предметы коллекции</h2><div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{own.map((p) => <ProductCard key={p.slug} product={p} />)}</div></section>
    <InteriorStrip title="Аранжировки" italic={collection.name} />
  </>;
}