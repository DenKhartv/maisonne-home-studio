import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Leaf } from "lucide-react";
import { images } from "@/lib/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О бренде — Форма" },
      { name: "description", content: "История, ценности и подход мебельного бренда Форма." },
      { property: "og:title", content: "О бренде — Форма" },
      { property: "og:description", content: "Мебель для спокойной и красивой жизни." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="page-wrap pb-28 pt-28 md:pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-olive">Наша история</p>
      <h1 className="font-display mt-4 max-w-4xl text-6xl font-semibold leading-[1.05] md:text-8xl">
        Дом начинается с ощущения
      </h1>
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <img
          src={images.lifestyle}
          alt="Интерьер Форма"
          className="h-full max-h-[720px] w-full rounded-[28px] object-cover"
        />
        <div className="flex flex-col justify-center lg:px-12">
          <p className="font-accent text-3xl leading-snug text-foreground">
            Мы создаём мебель, с которой повседневная жизнь становится мягче и спокойнее.
          </p>
          <p className="mt-8 text-sm leading-7 text-copy">
            Форма родилась из любви к тихим интерьерам, честным материалам и предметам, которые не теряют
            актуальности. В каждой модели мы соединяем выразительную форму, комфорт и внимание к деталям.
          </p>
          <p className="mt-5 text-sm leading-7 text-copy">
            Мы работаем с надёжными производствами и тщательно отбираем ткани, наполнители и древесину. Поэтому
            наша мебель рассчитана не на один сезон, а на долгую жизнь дома.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              [Heart, "Забота"],
              [Leaf, "Материалы"],
              [Award, "Опыт"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Heart;
              return (
                <div key={label as string} className="rounded-[22px] bg-secondary p-5">
                  <I className="size-5" />
                  <p className="mt-4 text-sm font-medium">{label as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-20 grid gap-10 rounded-[28px] bg-secondary p-8 md:grid-cols-2 md:p-14">
        <h2 className="font-display text-4xl font-medium md:font-semibold">Поговорим о вашем интерьере</h2>
        <div className="text-sm leading-7">
          <p className="font-price">+7 900 000-00-00</p>
          <p>hello@maisonne.ru</p>
          <p className="mt-3 text-muted-foreground">Ежедневно, 10:00–20:00</p>
        </div>
      </div>
    </div>
  );
}
