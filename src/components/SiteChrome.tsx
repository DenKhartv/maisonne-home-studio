import { Link, useLocation } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import { Send } from "lucide-react";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteTopChrome } from "@/components/SiteTopChrome";
import { SiteHeader } from "@/components/SiteHeader";

export { SiteHeader };

export function SiteFooter() {
  return (
    <ScrollReveal
      as="footer"
      id="contacts"
      className="-mt-px rounded-t-[36px] border-t border-border/60 bg-background text-foreground"
    >
      <div className="page-wrap grid gap-14 py-16 lg:grid-cols-[1.1fr_1.9fr] lg:py-24">
        <div>
          <p className="font-display text-4xl font-medium">Подпишись на новости</p>
          <p className="mt-4 max-w-md text-sm text-copy">Узнавайте первыми о новых коллекциях и специальных предложениях.</p>
          <form className="mt-7 flex max-w-md border-b border-border" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              placeholder="Ваш email"
              aria-label="Email"
              className="min-w-0 flex-1 bg-transparent py-4 text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Подписаться"
              className="shrink-0 rounded-full border-2 border-coffee bg-coffee text-primary-foreground hover:bg-coffee/90 hover:border-coffee/90"
            >
              <Send />
            </Button>
          </form>
          <div className="mt-7 flex items-center gap-3 text-copy">
            <TelegramIcon />
            <span className="text-sm">@maisonne.home</span>
          </div>
        </div>
        <div>
          <p className="font-display text-5xl font-medium md:text-7xl md:font-semibold">Форма</p>
          <div className="mt-10 grid grid-cols-2 gap-8 text-sm md:grid-cols-4">
            <FooterGroup
              title="О компании"
              links={[
                { label: "О нас", to: "/about" },
                { label: "Коллекции", to: "/", hash: "collections" },
              ]}
            />
            <FooterGroup
              title="Информация"
              links={[
                { label: "Доставка", to: "/faq", hash: "delivery" },
                { label: "Гарантия", to: "/faq", hash: "warranty" },
                { label: "Конфиденциальность", to: "/faq", hash: "privacy" },
              ]}
            />
            <FooterGroup
              title="Поддержка"
              links={[
                { label: "FAQ", to: "/faq" },
                { label: "Возврат", to: "/faq", hash: "returns" },
                { label: "Уход за мебелью", to: "/faq", hash: "care" },
              ]}
            />
            <div>
              <p className="mb-4 font-medium">Контакты</p>
              <p className="text-copy">+7 900 000-00-00</p>
              <p className="mt-2 text-copy">hello@maisonne.ru</p>
            </div>
          </div>
        </div>
      </div>
      <div className="page-wrap flex flex-wrap justify-between gap-4 border-t border-border py-7 text-xs text-muted-foreground">
        <span>© 2026 Форма</span>
        <span>МИР · VISA · СБП</span>
      </div>
    </ScrollReveal>
  );
}

type FooterLinkItem = {
  label: string;
  to?: string;
  hash?: string;
};

function FooterGroup({ title, links }: { title: string; links: FooterLinkItem[] }) {
  const location = useLocation();

  const onAnchorClick = (link: FooterLinkItem) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!link.hash || link.to !== "/" || location.pathname !== "/") return;
    event.preventDefault();
    smoothScrollToId(link.hash, { durationMs: 720, extraDown: 24 });
  };

  return (
    <div>
      <p className="mb-4 font-medium">{title}</p>
      {links.map((link) =>
        link.to ? (
          <Link
            key={link.label}
            to={link.to}
            hash={link.hash}
            onClick={onAnchorClick(link)}
            className="mb-2 block text-copy transition hover:text-coffee"
          >
            {link.label}
          </Link>
        ) : (
          <p key={link.label} className="mb-2 text-copy transition hover:text-coffee">
            {link.label}
          </p>
        ),
      )}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteTopChrome />
      <main>{children}</main>
      <SiteFooter />
      <CookieBanner />
    </>
  );
}
