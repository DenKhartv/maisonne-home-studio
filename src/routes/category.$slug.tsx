import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, getCategory, products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$slug")({
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
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState("popular");
  const items = useMemo(() => {
    const matching = products.filter((p) => p.category === category.slug);
    const base = matching.length >= 4 ? matching : [...matching, ...products.filter((p) => !matching.includes(p)).slice(0, 6 - matching.length)];
    return sort === "price" ? [...base].sort((a,b) => Number(a.price.replace(/\D/g,"")) - Number(b.price.replace(/\D/g,""))) : base;
  }, [category.slug, sort]);
  return (
    <div className="page-wrap pb-28 pt-36 md:pt-44">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Каталог мебели</p>
      <h1 className="font-display mt-4 text-6xl font-semibold md:text-8xl">{category.name}</h1>
      <div className="mt-7 max-w-2xl text-sm leading-7 text-copy"><p>Продуманные формы, глубокий комфорт и спокойная палитра для интерьеров, в которых хочется оставаться.</p>{expanded && <p className="mt-3">Каждая модель создаётся с вниманием к пропорциям, долговечности и тактильным ощущениям. Выберите подходящую ткань и оттенок.</p>}<Button variant="link" className="px-0" onClick={() => setExpanded(!expanded)}>{expanded ? "Свернуть" : "Читать далее"}</Button></div>
      <div className="no-scrollbar mt-12 flex gap-4 overflow-x-auto pb-2">
        {["2-местные", "3-местные", "4-местные", "Модульные"].map((name, i) => <div key={name} className="group relative aspect-[4/3] min-w-64 overflow-hidden rounded-[24px]"><img src={categories[i % categories.length]?.image} alt={name} className="h-full w-full object-cover transition group-hover:scale-105" /><span className="absolute inset-x-4 bottom-4 rounded-full bg-background/90 px-4 py-2 text-sm backdrop-blur">{name}</span></div>)}
      </div>
      <div className="my-12 flex flex-wrap justify-end gap-4 border-y border-border py-5 text-sm">
        <label>Сортировать по: <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent font-medium outline-none"><option value="popular">Популярные</option><option value="price">Сначала дешевле</option></select></label>
        <label>Фильтр: <select className="bg-transparent font-medium outline-none"><option>Цена</option><option>До 80 000 ₽</option></select></label>
      </div>
      <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      <div className="mt-14 text-center"><Link to="/" className="text-sm underline underline-offset-4">Вернуться на главную</Link></div>
    </div>
  );
}