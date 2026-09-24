import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS, faqIndexById } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Форма" },
      {
        name: "description",
        content: "Ответы на частые вопросы о доставке, гарантии и уходе за мебелью Форма.",
      },
      { property: "og:title", content: "FAQ — Форма" },
      { property: "og:description", content: "Всё важное о заказе мебели Форма." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function faqIdFromHash(hash: string): string | undefined {
  const id = hash.replace(/^#/, "");
  return faqIndexById(id) >= 0 ? id : undefined;
}

function FaqPage() {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | undefined>(() => {
    const fromHash = faqIdFromHash(
      typeof window !== "undefined" ? window.location.hash : location.hash ?? "",
    );
    return fromHash ?? FAQ_ITEMS[0]?.id;
  });

  useEffect(() => {
    const rawHash = location.hash ?? window.location.hash;
    const id = faqIdFromHash(rawHash);
    if (!id) {
      if (location.pathname === "/faq" && !rawHash.replace(/^#/, "")) {
        setOpenId(FAQ_ITEMS[0]?.id);
      }
      return;
    }

    setOpenId(id);
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);

    return () => window.clearTimeout(scrollTimer);
  }, [location.pathname, location.hash]);

  return (
    <div className="page-wrap min-h-[70vh] pb-28 pt-28 md:pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-olive">Поддержка</p>
      <h1 className="font-display mt-4 text-6xl font-semibold md:text-8xl">Вопросы и ответы</h1>
      <Accordion
        type="single"
        collapsible
        value={openId}
        onValueChange={(value) => setOpenId(value || undefined)}
        className="mt-16 max-w-4xl border-t border-border"
      >
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            id={`faq-${item.id}`}
            className="scroll-mt-32 border-b border-border"
          >
            <AccordionTrigger className="gap-8 py-7 text-lg font-medium hover:no-underline [&>svg]:size-5 [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-500 [&>svg]:ease-[cubic-bezier(0.22,1,0.36,1)] [&[data-state=open]>svg]:text-olive">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl pb-7 leading-7 text-copy">
                {item.answer}
                {item.id === "privacy" && (
                  <>
                    {" "}
                    <Link to="/privacy" className="text-olive underline underline-offset-4 hover:text-coffee">
                      Политика конфиденциальности
                    </Link>
                    .
                  </>
                )}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
