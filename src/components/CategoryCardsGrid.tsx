import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionTitle } from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import { countProductsInCategory, homeCategoryShowcase } from "@/lib/catalog";
import { useCategoryCardsParallax } from "@/hooks/use-category-cards-parallax";

function formatModelCount(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  let word = "моделей";
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "модель";
    else if (mod10 >= 2 && mod10 <= 4) word = "модели";
  }
  return `${count} ${word}`;
}

const layoutClass: Record<(typeof homeCategoryShowcase)[number]["slug"], string> = {
  sofas: "md:col-start-1 md:row-span-2 md:row-start-1",
  beds: "md:col-start-2 md:row-start-1",
  armchairs: "md:col-start-2 md:row-start-2",
};

/**
 * Высота кадров задана явно: секция остаётся в пределах одного экрана,
 * а левая карточка по высоте уравновешивает две правые.
 */
const photoSizeClass: Record<(typeof homeCategoryShowcase)[number]["slug"], string> = {
  sofas: "h-48 sm:h-56 md:h-[22rem] lg:h-[27rem] xl:h-[29rem]",
  beds: "h-44 sm:h-48 md:h-[12.25rem] lg:h-[13.5rem] xl:h-[14.5rem]",
  armchairs: "h-40 sm:h-44 md:h-[11rem] lg:h-[12.25rem] xl:h-[13rem]",
};

export function CategoryCardsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const transforms = useCategoryCardsParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="section-pad-compact mx-auto w-full max-w-[1720px] scroll-mt-28 overflow-x-clip px-[clamp(1.25rem,5.5vw,6.5rem)]"
    >
      <ScrollReveal className="relative z-10 -translate-y-1 md:-translate-y-1.5">
        <SectionTitle regular="Категории" italic="продукции" />
      </ScrollReveal>

      <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-5">
        {homeCategoryShowcase.map((cat, i) => {
          const subtitle = `${formatModelCount(countProductsInCategory(cat.slug))} ${cat.sense}`;

          return (
            <ScrollReveal
              key={cat.slug}
              delay={i * 100}
              className={cn("min-w-0", layoutClass[cat.slug])}
            >
              <Link
                to="/category/$slug"
                params={{ slug: cat.slug }}
                style={transforms[i] ? { transform: transforms[i], willChange: "transform" } : undefined}
                className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-[#EDE7DC] text-foreground transition-[background-color] duration-300 ease-out hover:bg-[#E8E2D8] md:rounded-[24px]"
              >
                <div
                  className={cn(
                    "shrink-0 pb-2 pt-4 md:pb-3 md:pt-5",
                    cat.slug === "sofas" ? "px-5 md:px-7 lg:px-8" : "px-4 md:px-5 lg:px-6",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "font-display font-medium leading-tight",
                        cat.slug === "sofas"
                          ? "text-[clamp(1.625rem,2.5vw,2.125rem)]"
                          : "text-[clamp(1.375rem,2vw,1.625rem)]",
                      )}
                    >
                      {cat.name}
                    </h3>
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-foreground/20 bg-background/30 text-foreground/50 transition duration-300 ease-out group-hover:border-olive group-hover:bg-olive group-hover:text-primary-foreground"
                      aria-hidden
                    >
                      <ArrowUpRight className="size-3.5 stroke-[2]" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-copy">{subtitle}</p>
                  <span className="mt-2 block overflow-hidden text-[0.6875rem] font-medium uppercase tracking-[0.07em] text-olive transition-all duration-300 ease-out max-h-5 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-5 md:group-hover:opacity-100 md:group-focus-visible:max-h-5 md:group-focus-visible:opacity-100">
                    Смотреть коллекцию
                  </span>
                </div>

                <div
                  className={cn(
                    "relative mb-4 shrink-0 overflow-hidden rounded-[16px] bg-secondary/40 md:rounded-[18px]",
                    cat.slug === "sofas"
                      ? "mx-5 mb-5 md:mx-7 md:mb-7 lg:mx-8"
                      : "mx-4 mb-4 md:mx-5 md:mb-5 lg:mx-6",
                    photoSizeClass[cat.slug],
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-10 bg-black/0 transition duration-300 ease-out group-hover:bg-black/12"
                    aria-hidden
                  />
                  {cat.imageTone === "dark" && (
                    <div
                      className="pointer-events-none absolute inset-0 z-[1] bg-black/18"
                      aria-hidden
                    />
                  )}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={1008}
                    className={cn(
                      "absolute inset-0 h-full w-full transition duration-500 ease-out group-hover:scale-[1.035]",
                      cat.imageClass,
                    )}
                  />
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
