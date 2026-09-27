import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CategoryCardsGrid } from "@/components/CategoryCardsGrid";
import { collections, images } from "@/lib/catalog";
import fabricChoiceGlow from "@/assets/fabric-section-glow.webp";
import { SectionTitle } from "@/components/SectionTitle";
import { FabricChoiceSection } from "@/components/FabricChoiceSection";
import { InteriorStrip } from "@/components/InteriorStrip";
import { Button } from "@/components/ui/button";
import { useHeroParallax } from "@/hooks/use-hero-parallax";
import { useFabricStickyTrackHeight } from "@/hooks/use-fabric-sticky-track-height";
import { smoothScrollToId } from "@/lib/smooth-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Форма — дизайнерская мебель для дома" },
      { name: "description", content: "Диваны, кровати и кресла Форма в спокойном современном дизайне." },
      { property: "og:title", content: "Форма — дизайнерская мебель для дома" },
      { property: "og:description", content: "Тактильная мебель для спокойной и красивой жизни." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroScrimRef = useRef<HTMLDivElement>(null);
  const brandImageRef = useRef<HTMLDivElement>(null);
  const brandStickyTrackRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useHeroParallax(heroRef, heroMediaRef, heroContentRef, heroScrimRef);
  useFabricStickyTrackHeight(brandImageRef, brandStickyTrackRef);

  useEffect(() => {
    const hash = location.hash?.replace(/^#/, "") || window.location.hash.replace(/^#/, "");
    if (hash !== "collections" && hash !== "categories") return;

    const frame = requestAnimationFrame(() => {
      smoothScrollToId(hash, { durationMs: 720, extraDown: 24 });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <>
      <section
        ref={heroRef}
        className="relative flex min-h-svh items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0 md:pt-0"
      >
        <div ref={heroMediaRef} className="hero-media-layer absolute inset-0 overflow-hidden" aria-hidden>
          <img
            src={images.sofa}
            alt="Светлый диван Форма в тёплом современном интерьере"
            width={1600}
            height={1008}
            decoding="async"
            fetchPriority="high"
            className="hero-media-intro h-full w-full object-cover object-center motion-reduce:animate-none"
          />
        </div>
        <div
          ref={heroScrimRef}
          className="absolute inset-0 bg-gradient-to-r from-background/62 via-background/32 via-50% to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/45 to-transparent md:hidden"
          aria-hidden
        />
        <div ref={heroContentRef} className="page-wrap relative z-10 w-full max-w-2xl md:max-w-3xl">
          <p className="hero-text-intro text-xs font-medium uppercase tracking-[0.06em] text-foreground/75 [animation-delay:340ms] motion-reduce:animate-none">
            Авторская мебель · Москва
          </p>
          <h1 className="font-display hero-text-intro mt-5 text-[clamp(3.5rem,12vw,8.5rem)] font-medium leading-[0.95] text-foreground [animation-delay:460ms] motion-reduce:animate-none md:font-semibold">
            Форма
          </h1>
          <p className="hero-text-intro mt-10 max-w-md text-base leading-relaxed text-foreground/80 [animation-delay:700ms] motion-reduce:animate-none md:text-lg">
            Мебель, с которой хочется остаться дома
          </p>
          <a
            href="#categories"
            className="group hero-text-intro mt-10 inline-flex items-center gap-3 rounded-full border border-olive/50 bg-background/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-[2px] transition [animation-delay:920ms] hover:border-olive hover:bg-background/60 hover:text-olive motion-reduce:animate-none"
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

      <ScrollReveal
        as="section"
        id="collections"
        className="section-pad-compact scroll-mt-28 bg-surface-soft"
      >
        <div className="page-wrap">
          <div className="relative z-10 -translate-y-1 flex items-center gap-6 md:-translate-y-1.5">
            <SectionTitle regular="Коллекции" italic="мебели" />
            <span className="hidden h-px flex-1 bg-olive/12 md:block" />
          </div>
          <div className="mt-10 grid items-center gap-5 md:grid-cols-[1fr_1.16fr_1fr]">
            {collections.map((collection, i) => (
              <ScrollReveal key={collection.slug} delay={i * 120}>
                <Link
                  to="/collection/$slug"
                  params={{ slug: collection.slug }}
                  className={`group relative block overflow-hidden rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${i === 1 ? "aspect-[4/5] md:-mt-5" : "aspect-[4/4.5]"}`}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    loading="lazy"
                    width={1200}
                    height={1008}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(to_top,rgba(41,39,35,0.46)_0%,rgba(41,39,35,0.18)_42%,transparent_88%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-[#F5F1EA] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:px-6 md:pb-6 md:pt-10">
                    <h3 className="font-display text-[clamp(1.875rem,2.8vw,2.25rem)] font-medium leading-tight">
                      {collection.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-[#F5F1EA]/88">
                      {collection.tagline}
                    </p>
                    <span className="mt-3 inline-flex items-center text-xs font-medium uppercase tracking-[0.07em] text-[#F5F1EA]/80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
                      Смотреть →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <section className="section-pad-compact overflow-x-clip">
        <div className="page-wrap grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start lg:gap-x-[clamp(2.5rem,5vw,5.5rem)]">
          <div ref={brandStickyTrackRef} className="relative z-[1]">
            <div className="lg:sticky lg:top-28">
              <SectionTitle regular="Там, где страсть" italic="встречается с опытом" />
              <p className="mt-10 max-w-[28rem] text-sm leading-7 text-copy">
                Мы создаём мебель, в которой продуманы ощущения, пропорции и каждый материал. Спокойный дизайн помогает
                ей естественно жить в самых разных интерьерах.
              </p>
              <div className="mt-12 max-w-[22rem]">
                <p className="font-display text-[clamp(3.75rem,8.5vw,5.5rem)] font-medium leading-[0.85] tracking-tight text-foreground">
                  25
                </p>
                <p className="mt-3 font-display text-[1.25rem] font-medium leading-snug text-foreground md:text-[1.45rem]">
                  лет опыта производства
                </p>
              </div>
              <p className="mt-10 max-w-[28rem] border-t border-foreground/10 pt-6 text-[0.68rem] font-medium uppercase leading-relaxed tracking-[0.16em] text-copy">
                Бесплатные образцы тканей
                <span className="mx-3 text-olive/40" aria-hidden>
                  ·
                </span>
                Бесплатная доставка
              </p>
              <div className="mt-10">
                <Button variant="warm" asChild>
                  <Link to="/about" className="group">
                    Узнать больше о «Форме»
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="fabric-choice-text-glow fabric-choice-text-glow-from-end motion-reduce:hidden hidden lg:block"
            >
              <img src={fabricChoiceGlow} alt="" />
            </div>
            <div ref={brandImageRef} className="group relative z-[1] overflow-hidden rounded-[14px]">
              <img
                src={images.lifestyle}
                alt="Дом с мебелью Форма"
                loading="lazy"
                width={1200}
                height={1008}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
              />
            </div>
          </div>
        </div>
      </section>

      <FabricChoiceSection />

      <InteriorStrip />
    </>
  );
}
