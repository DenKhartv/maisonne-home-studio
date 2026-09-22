import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, Package, ShieldCheck, SwatchBook } from "lucide-react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CategoryCardsGrid } from "@/components/CategoryCardsGrid";
import { collections, images } from "@/lib/catalog";
import { SectionTitle } from "@/components/SectionTitle";
import { FabricChoiceSection } from "@/components/FabricChoiceSection";
import { InteriorStrip } from "@/components/InteriorStrip";
import { Button } from "@/components/ui/button";
import { useHeroParallax } from "@/hooks/use-hero-parallax";
import { smoothScrollToId } from "@/lib/smooth-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAISONNE — дизайнерская мебель для дома" },
      { name: "description", content: "Диваны, кровати и кресла MAISONNE в спокойном современном дизайне." },
      { property: "og:title", content: "MAISONNE — дизайнерская мебель для дома" },
      { property: "og:description", content: "Тактильная мебель для спокойной и красивой жизни." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  useHeroParallax(heroRef, heroImageRef);

  return (
    <>
      <section
        ref={heroRef}
        className="relative flex min-h-svh items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0 md:pt-0"
      >
        <div className="hero-media-layer absolute inset-0 overflow-hidden" aria-hidden>
          <img
            ref={heroImageRef}
            src={images.sofa}
            alt="Светлый диван MAISONNE в тёплом современном интерьере"
            width={1600}
            height={1008}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/62 via-background/32 via-50% to-transparent"
          aria-hidden
        />
        <div className="page-wrap relative z-10 w-full max-w-2xl md:max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-foreground/75">
            Авторская мебель · Москва
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.5rem,12vw,8.5rem)] font-medium leading-[0.92] tracking-[0.08em] text-foreground">
            MAISONNE
          </h1>
          <p className="mt-10 max-w-md text-base leading-relaxed text-foreground/80 md:text-lg">
            Мебель, с которой хочется остаться дома
          </p>
          <a
            href="#categories"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-olive/50 bg-background/40 px-6 py-3 text-sm font-medium tracking-wide text-foreground backdrop-blur-[2px] transition hover:border-olive hover:bg-background/60 hover:text-olive"
            onClick={(event) => {
              event.preventDefault();
              smoothScrollToId("categories", { durationMs: 720, extraDown: 24 });
            }}
          >
            Перейти к коллекциям
            <ArrowDown className="size-4 text-olive transition group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      <CategoryCardsGrid />

      <ScrollReveal as="section" className="section-pad-compact bg-surface-soft">
        <div className="page-wrap">
          <div className="flex items-center gap-6">
            <SectionTitle regular="Коллекции" italic="мебели" />
            <span className="hidden h-px flex-1 bg-olive/25 md:block" />
          </div>
          <div className="mt-8 grid items-center gap-5 md:grid-cols-[1fr_1.16fr_1fr]">
            {collections.map((collection, i) => (
              <ScrollReveal key={collection.slug} delay={i * 120}>
                <Link
                  to="/collection/$slug"
                  params={{ slug: collection.slug }}
                  className={`group relative block overflow-hidden rounded-[26px] ${i === 1 ? "aspect-[4/5] md:-mt-8" : "aspect-[4/4.5]"}`}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    loading="lazy"
                    width={1200}
                    height={1008}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(to_top,rgba(0,0,0,0.4)_0%,transparent_40%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:px-6 md:pb-6 md:pt-10">
                    <h3 className="font-display text-[clamp(1.875rem,2.8vw,2.25rem)] leading-tight text-[#F5F1EA]">
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="page-wrap section-pad-compact grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle regular="Там, где страсть" italic="встречается с опытом" />
          <p className="mt-7 max-w-xl text-sm leading-7 text-copy">
            Мы создаём мебель, в которой продуманы ощущения, пропорции и каждый материал. Спокойный дизайн помогает
            ей естественно жить в самых разных интерьерах.
          </p>
          <div className="mt-9 space-y-5">
            {[
              [SwatchBook, "Бесплатные образцы тканей"],
              [Package, "Бесплатная доставка"],
              [ShieldCheck, "25 лет опыта производства"],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof SwatchBook;
              return (
                <ScrollReveal key={label as string} delay={i * 100}>
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-full bg-olive text-primary-foreground">
                      <I className="size-5" />
                    </span>
                    <span className="text-sm">{label as string}</span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal delay={320} className="mt-10">
            <Button variant="warm" size="lg" asChild>
              <Link to="/about">Узнать больше о MAISONNE</Link>
            </Button>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={120} className="flex justify-center lg:justify-end">
          <img
            src={images.lifestyle}
            alt="Дом с мебелью MAISONNE"
            loading="lazy"
            width={1200}
            height={1008}
            className="aspect-[4/5] w-[92%] max-w-full rounded-[28px] object-cover sm:w-[90%] lg:ml-auto lg:w-[86%]"
          />
        </ScrollReveal>
      </ScrollReveal>

      <FabricChoiceSection />

      <InteriorStrip />
    </>
  );
}
