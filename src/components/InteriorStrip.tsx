import { ScrollReveal } from "@/components/ScrollReveal";
import { portfolioWorks, type PortfolioWork } from "@/lib/portfolio";

const defaultDescription =
  "Интерьеры наших клиентов и проекты в сотрудничестве с российскими архитекторами.";

export type InteriorStripProps = {
  eyebrow?: string;
  /** Первая строка заголовка (или legacy `title`) */
  title?: string;
  /** Вторая строка курсивом (или legacy `italic`) */
  italic?: string;
  description?: string;
  works?: PortfolioWork[];
};

export function InteriorStrip({
  eyebrow = "Наши работы",
  title = "Дома, где",
  italic = "живёт Форма",
  description = defaultDescription,
  works = portfolioWorks,
}: InteriorStripProps) {
  return (
    <ScrollReveal
      as="section"
      id="works"
      className="section-pad-compact overflow-x-clip bg-stage-dark text-primary-foreground"
    >
      <div className="page-wrap mb-10 grid gap-6 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[var(--stage-dark-accent)] lg:pt-1">
          {eyebrow}
        </p>
        <h2 className="font-display text-[clamp(2.25rem,5vw,5rem)] font-medium leading-[1.08] md:font-semibold">
          {title}
          <br />
          <em className="font-accent text-[var(--stage-dark-accent)]">{italic}</em>
        </h2>
        <p className="max-w-[23rem] text-sm leading-7 text-primary-foreground/78 lg:justify-self-end">{description}</p>
      </div>

      <div className="page-wrap no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-4 lg:overflow-visible">
        {works.map((work, index) => (
          <ScrollReveal key={work.id} delay={index * 80} className="min-w-[87vw] shrink-0 snap-start lg:min-w-0">
            <figure className={index === 1 ? "lg:mb-20" : undefined}>
              <img
                src={work.image}
                alt={work.alt}
                width={1600}
                height={1056}
                loading="lazy"
                className="aspect-[1.35/1] w-full rounded-[24px] object-cover"
              />
              <figcaption className="flex items-baseline justify-between gap-4 pt-4 text-[0.78rem]">
                <span>{work.title}</span>
                <small className="shrink-0 text-primary-foreground/55">{work.meta}</small>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </ScrollReveal>
  );
}
