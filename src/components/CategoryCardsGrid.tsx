import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionTitle } from "@/components/SectionTitle";
import { homeCategories } from "@/lib/catalog";
import { useCategoryCardsParallax } from "@/hooks/use-category-cards-parallax";

export function CategoryCardsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const transforms = useCategoryCardsParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="page-wrap section-pad-compact scroll-mt-28 overflow-x-clip"
    >
      <ScrollReveal>
        <SectionTitle regular="Категории" italic="продукции" />
      </ScrollReveal>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
        {homeCategories.map((cat, i) => (
          <ScrollReveal key={cat.slug} delay={i * 120} className="min-w-0">
            <Link
              to="/category/$slug"
              params={{ slug: cat.slug }}
              style={transforms[i] ? { transform: transforms[i], willChange: "transform" } : undefined}
              className="group relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-[24px] bg-[#EDE7DC] p-6 text-foreground transition-colors duration-300 ease-out hover:bg-[#8C7A63] hover:text-[#F5F1EA]"
            >
              <h3 className="font-display text-3xl">{cat.name}</h3>
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                width={1200}
                height={1008}
                className="absolute inset-x-4 bottom-4 h-[62%] w-[calc(100%-2rem)] rounded-[18px] object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
