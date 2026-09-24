import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MessageCircle, Star, X } from "lucide-react";
import { useState } from "react";
import { getCategory, getProduct, images, products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/shopping-storage";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => { const product = getProduct(params.slug); if (!product) throw notFound(); return product; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.name ?? "Мебель"} — Форма` }, { name: "description", content: `${loaderData?.name ?? "Мебель"}: премиальные материалы и спокойный современный дизайн.` },
    { property: "og:title", content: `${loaderData?.name ?? "Мебель"} — Форма` }, { property: "og:description", content: "Выберите ткань и оставьте заявку на консультацию." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: ProductPage,
});

const gallery = [images.sofa, images.lifestyle, images.chair, images.bedroom];
const swatches = ["bg-fabric-1", "bg-fabric-2", "bg-fabric-3", "bg-fabric-4", "bg-fabric-5", "bg-fabric-6"];

function ProductPage() {
  const product = Route.useLoaderData();
  const category = getCategory(product.category);
  const [active, setActive] = useState(product.image);
  const [fabric, setFabric] = useState(0);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const related = products.filter((p) => p.collection === product.collection && p.slug !== product.slug);
  return <div className="page-wrap pb-28 pt-28 md:pt-36">
    <nav className="mb-8 text-xs text-muted-foreground"><Link to="/">Главная</Link> / <Link to="/category/$slug" params={{ slug: product.category }}>{category?.name ?? "Каталог"}</Link> / {product.name}</nav>
    <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
      <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
        <div className="no-scrollbar order-2 flex gap-3 overflow-auto sm:order-1 sm:flex-col">{[product.image, ...gallery.filter((x) => x !== product.image)].map((image, i) => <button key={`${image}-${i}`} onClick={() => setActive(image)} className={`aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border-2 ${active === image ? "border-primary" : "border-transparent"}`}><img src={image} alt="Вид товара" className="h-full w-full object-cover" /></button>)}</div>
        <div className="order-1 aspect-[4/3] overflow-hidden rounded-[28px] bg-secondary sm:order-2"><img src={active} alt={product.name} className="h-full w-full object-cover" /></div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Коллекция {product.collection}</p>
        <h1 className="mt-4 text-5xl font-medium md:text-6xl">{product.name}</h1>
        <div className="mt-5 flex items-center gap-2 text-sm"><span className="flex text-primary">{[1,2,3,4,5].map((n) => <Star key={n} className="size-4 fill-current" />)}</span><span className="text-muted-foreground">12 отзывов</span></div>
        <p className="font-price mt-8 text-2xl">{product.price}</p>
        <div className="mt-10 border-y border-border py-7"><p className="font-medium">Ткань и цвет</p><div className="mt-4 flex gap-3">{swatches.map((color, i) => <button key={color} onClick={() => setFabric(i)} aria-label={`Вариант ткани ${i+1}`} className={`size-10 rounded-full border-2 ${color} ${fabric === i ? "ring-2 ring-olive ring-offset-4 ring-offset-background" : "border-background"}`} />)}</div></div>
        <p className="mt-7 text-sm"><span className="text-muted-foreground">Доставка:</span> 2–4 недели</p>
        <Button
          variant="warm"
          size="lg"
          className="mt-8 w-full"
          onClick={() => {
            addToCart(product.slug);
            setOpen(true);
          }}
        >
          Оставить заявку
        </Button>
        <Button variant="outline" size="lg" className="mt-3 w-full"><MessageCircle /> Написать нам</Button>
      </aside>
    </div>
    <section className="section-pad grid gap-12 border-b border-border lg:grid-cols-2"><div><h2 className="font-display text-4xl font-medium md:font-semibold">Характеристики</h2><dl className="mt-8 divide-y divide-border text-sm">{[["Материал","Бук, мебельная ткань"],["Размеры","240 × 105 × 78 см"],["Наполнитель","Пена высокой плотности"],["Производство","Европа"]].map(([k,v]) => <div key={k} className="flex justify-between gap-8 py-4"><dt className="text-muted-foreground">{k}</dt><dd className="font-price text-right">{v}</dd></div>)}</dl></div><div><h2 className="font-display text-4xl font-medium md:font-semibold">Уход за мебелью</h2><p className="mt-8 max-w-lg text-sm leading-7 text-copy">Регулярно очищайте поверхность мягкой щёткой или пылесосом. Свежие пятна промокните чистой салфеткой без трения. Не размещайте мебель под прямыми солнечными лучами.</p></div></section>
    <section className="pt-20"><h2 className="font-display text-4xl font-medium md:font-semibold">Другие модели из этой коллекции</h2><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(related.length ? related : products.slice(0,3)).map((p) => <ProductCard key={p.slug} product={p} />)}</div></section>
    {open && <div className="fixed inset-0 z-[80] grid place-items-center bg-coffee/50 p-5 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="relative w-full max-w-lg rounded-[28px] bg-background p-7 md:p-10"><Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => {setOpen(false);setSent(false)}} aria-label="Закрыть"><X /></Button>{sent ? <div className="py-14 text-center"><Check className="mx-auto size-10 text-primary"/><h2 className="font-display mt-5 text-4xl font-medium md:font-semibold">Спасибо</h2><p className="mt-3 text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p></div> : <><h2 className="font-display text-4xl font-medium md:font-semibold">Заявка на {product.name}</h2><p className="mt-3 text-sm text-copy">Оставьте контакты — консультант уточнит детали.</p><form className="mt-8 space-y-4" onSubmit={(e) => {e.preventDefault();setSent(true)}}><input required aria-label="Имя" placeholder="Имя" className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"/><input required type="tel" aria-label="Телефон" placeholder="Телефон" className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"/><textarea aria-label="Комментарий" placeholder="Комментарий" rows={4} className="w-full resize-none rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"/><Button variant="warm" size="lg" className="w-full" type="submit">Отправить заявку</Button></form></>}</div></div>}
  </div>;
}