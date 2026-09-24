import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Форма" },
      {
        name: "description",
        content: "Как Форма обрабатывает персональные данные и использует cookie.",
      },
      { property: "og:title", content: "Политика конфиденциальности — Форма" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="page-wrap min-h-[70vh] pb-32 pt-28 md:pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-olive">Документы</p>
      <h1 className="font-display mt-4 text-5xl font-semibold md:text-7xl">Политика конфиденциальности</h1>
      <div className="mt-10 max-w-2xl space-y-6 text-sm leading-7 text-copy">
        <p>
          Мы используем необходимые cookie для работы сайта и сохранения ваших настроек. Аналитические cookie
          помогают понимать, как посетители пользуются сайтом — их можно отключить в баннере при первом
          визите.
        </p>
        <p>
          По вопросам обработки данных:{" "}
          <a href="mailto:hello@maisonne.ru" className="text-foreground underline underline-offset-4">
            hello@maisonne.ru
          </a>
          .
        </p>
      </div>
    </div>
  );
}
