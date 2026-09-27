import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { getCategory, getCollection, getProduct, images, products, type Product } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Мебель"} — Форма` },
      { name: "description", content: `${loaderData?.name ?? "Мебель"}: премиальные материалы и спокойный современный дизайн.` },
      { property: "og:title", content: `${loaderData?.name ?? "Мебель"} — Форма` },
      { property: "og:description", content: "Выберите ткань и оставьте заявку на консультацию." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const fabricSwatches = ["bg-fabric-1", "bg-fabric-2", "bg-fabric-3", "bg-fabric-4", "bg-fabric-5", "bg-fabric-6"] as const;

const productSpecs = [
  ["Размер", "240 × 105 × 78 см"],
  ["Материал", "Бук, мебельная ткань"],
  ["Наполнитель", "Пена высокой плотности"],
  ["Производство", "Европа"],
] as const;

const productDescription = [
  "Премиальные материалы и спокойный современный дизайн.",
  "Продуманные формы, глубокий комфорт и спокойная палитра для интерьеров, в которых хочется оставаться.",
  "Для каждой модели доступны тщательно подобранные ткани и оттенки. Сравните варианты и найдите тот, который естественно дополнит ваш дом.",
];

const careText =
  "Регулярно очищайте поверхность мягкой щёткой или пылесосом. Свежие пятна промокните чистой салфеткой без трения. Не размещайте мебель под прямыми солнечными лучами.";

const deliveryDetails =
  "Обычный срок изготовления и доставки — от 2 до 4 недель. Для отдельных тканей срок может отличаться. Доставку по городу согласуем при оформлении заказа. На каркас и механизмы действует гарантия 18 месяцев при соблюдении рекомендаций по эксплуатации.";

function galleryFor(product: Product) {
  const unique = [product.image];
  for (const src of [images.sofa, images.lifestyle, images.chair, images.bedroom]) {
    if (!unique.includes(src)) unique.push(src);
  }
  return unique;
}

function ProductPage() {
  const product = Route.useLoaderData();
  return <ProductView key={product.slug} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const collection = getCollection(product.collection);
  const gallery = useMemo(() => galleryFor(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fabric, setFabric] = useState(0);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [addedAt, setAddedAt] = useState(0);
  const { addToCart } = useCart();
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const related = products.filter((p) => p.collection === product.collection && p.slug !== product.slug);
  const activeImage = gallery[activeIndex] ?? product.image;

  const selectImage = (index: number) => {
    setActiveIndex(index);
    const scroller = mobileScrollerRef.current;
    const slide = scroller?.children[index];
    if (scroller && slide instanceof HTMLElement) {
      scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const slides = [...scroller.children] as HTMLElement[];
      if (!slides.length) return;
      const next = slides.reduce((closest, slide, index) => {
        const distance = Math.abs(slide.offsetLeft - scroller.scrollLeft);
        return distance < closest.distance ? { index, distance } : closest;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setActiveIndex(next.index);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!addedAt) return;
    const id = window.setTimeout(() => setAddedAt(0), 2800);
    return () => window.clearTimeout(id);
  }, [addedAt]);

  return (
    <div className="page-wrap overflow-x-clip pb-28 pt-32 md:pt-40">
      <nav className="mb-10 text-xs text-muted-foreground">
        <Link to="/">Главная</Link>
        {" / "}
        <Link to="/category/$slug" params={{ slug: product.category }}>{category?.name ?? "Каталог"}</Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:gap-x-16 xl:gap-x-20">
        <ProductGallery
          name={product.name}
          gallery={gallery}
          activeIndex={activeIndex}
          activeImage={activeImage}
          mobileScrollerRef={mobileScrollerRef}
          onSelect={selectImage}
        />

        <aside className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">{product.name}</h1>
            <FavoriteButton slug={product.slug} name={product.name} variant="inline" className="mt-1" />
          </div>
          {collection && (
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Коллекция {collection.name}
            </p>
          )}
          <p className="font-price mt-8 text-3xl tracking-tight">{product.price}</p>
          {collection?.tagline && (
            <p className="mt-6 max-w-md text-sm leading-7 text-copy">{collection.tagline}</p>
          )}
          <p className="mt-3 max-w-md text-sm leading-7 text-copy">{productDescription[0]}</p>

          <div className="mt-10 border-y border-border py-8">
            <p className="text-sm font-medium">Ткань и цвет</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {fabricSwatches.map((color, i) => {
                const selected = fabric === i;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFabric(i)}
                    aria-label={`Вариант ткани ${i + 1}`}
                    aria-pressed={selected}
                    className={cn(
                      "size-10 rounded-full border border-foreground/10 transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      color,
                      selected
                        ? "ring-1 ring-foreground/35 ring-offset-2 ring-offset-background"
                        : "hover:ring-1 hover:ring-foreground/15 hover:ring-offset-2 hover:ring-offset-background",
                    )}
                  />
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Выбрано: вариант {fabric + 1}</p>
          </div>

          <div className="mt-8 space-y-2 text-sm leading-6">
            <p>
              <span className="text-muted-foreground">Доставка</span>
              <span className="mx-3 text-olive/40" aria-hidden>·</span>
              2–4 недели
            </p>
            <p className="text-copy">Бесплатные образцы тканей</p>
            <p className="text-copy">Бесплатная доставка</p>
          </div>

          <Button
            variant="warm"
            size="lg"
            className="mt-10 w-full"
            onClick={() => {
              addToCart({ productId: product.slug, fabric });
              setAddedAt(Date.now());
            }}
          >
            Добавить в корзину
          </Button>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-copy">
            {addedAt ? "Добавлено в корзину" : ""}
          </p>
          <Button variant="outline" size="lg" className="mt-2 w-full" onClick={() => setOpen(true)}>
            Оставить заявку
          </Button>

          <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {productSpecs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
                <dd className="font-price mt-2 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <section className="mt-20 border-t border-border md:mt-28">
        <Accordion type="single" collapsible defaultValue="description" className="w-full">
          <AccordionItem value="description" className="border-border">
            <AccordionTrigger className="py-6 font-display text-xl font-medium hover:no-underline md:text-2xl">
              Описание
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl space-y-4 pb-8 text-sm leading-7 text-copy">
              {collection?.tagline && <p>{collection.tagline}</p>}
              {productDescription.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs" className="border-border">
            <AccordionTrigger className="py-6 font-display text-xl font-medium hover:no-underline md:text-2xl">
              Характеристики
            </AccordionTrigger>
            <AccordionContent className="pb-8">
              <dl className="max-w-xl divide-y divide-border text-sm">
                {productSpecs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-8 py-4">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-price text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care" className="border-border">
            <AccordionTrigger className="py-6 font-display text-xl font-medium hover:no-underline md:text-2xl">
              Уход
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-8 text-sm leading-7 text-copy">
              {careText}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery" className="border-border">
            <AccordionTrigger className="py-6 font-display text-xl font-medium hover:no-underline md:text-2xl">
              Доставка и условия
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl space-y-4 pb-8 text-sm leading-7 text-copy">
              <p>{deliveryDetails}</p>
              <p>Мы бесплатно подберём и отправим образцы доступных тканей после консультации.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="pt-20 md:pt-28">
        <h2 className="font-display text-4xl font-medium md:text-5xl md:font-semibold">Другие модели из этой коллекции</h2>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(related.length ? related : products.slice(0, 3)).map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-coffee/50 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-lg rounded-[28px] bg-background p-7 md:p-10">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setOpen(false);
                setSent(false);
              }}
              aria-label="Закрыть"
            >
              <X />
            </Button>
            {sent ? (
              <div className="py-14 text-center">
                <Check className="mx-auto size-10 text-primary" />
                <h2 className="font-display mt-5 text-4xl font-medium md:font-semibold">Спасибо</h2>
                <p className="mt-3 text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-4xl font-medium md:font-semibold">Заявка на {product.name}</h2>
                <p className="mt-3 text-sm text-copy">Оставьте контакты — консультант уточнит детали.</p>
                <p className="mt-2 text-sm text-muted-foreground">Ткань и цвет: вариант {fabric + 1}</p>
                <form
                  className="mt-8 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <input required aria-label="Имя" placeholder="Имя" className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring" />
                  <input required type="tel" aria-label="Телефон" placeholder="Телефон" className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring" />
                  <textarea aria-label="Комментарий" placeholder="Комментарий" rows={4} className="w-full resize-none rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring" />
                  <Button variant="warm" size="lg" className="w-full" type="submit">Отправить заявку</Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductGallery({
  name,
  gallery,
  activeIndex,
  activeImage,
  mobileScrollerRef,
  onSelect,
}: {
  name: string;
  gallery: string[];
  activeIndex: number;
  activeImage: string;
  mobileScrollerRef: RefObject<HTMLDivElement | null>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="min-w-0 overflow-x-clip">
      <div
        ref={mobileScrollerRef}
        className="no-scrollbar flex w-full max-w-full snap-x snap-mandatory overflow-x-auto md:hidden"
      >
        {gallery.map((image, index) => (
          <div
            key={image}
            className="w-full min-w-full max-w-full shrink-0 snap-start overflow-hidden rounded-[24px] bg-secondary"
          >
            <img src={image} alt={name} className="aspect-[4/5] w-full max-w-full object-cover" />
            <span className="sr-only">
              Фото {index + 1} из {gallery.length}
            </span>
          </div>
        ))}
      </div>

      <div className="group relative hidden overflow-hidden rounded-[24px] bg-secondary md:block md:h-[min(78vh,46rem)]">
        <img
          key={activeImage}
          src={activeImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-4 flex justify-center gap-2 md:hidden">
        {gallery.map((image, index) => (
          <button
            key={`dot-${image}`}
            type="button"
            aria-label={`Показать фото ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => onSelect(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              activeIndex === index ? "w-6 bg-foreground/70" : "w-1.5 bg-foreground/20",
            )}
          />
        ))}
      </div>

      <div className="mt-4 hidden gap-3 md:flex">
        {gallery.map((image, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={image}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-2xl transition-[box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:w-20",
                selected ? "ring-1 ring-foreground/25 ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100",
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
