import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { fabricLabel } from "@/lib/price";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Оформление заказа — Форма" },
      { name: "description", content: "Оставьте контакты, чтобы оформить заказ мебели Форма." },
      { property: "og:title", content: "Оформление заказа — Форма" },
      { property: "og:description", content: "Консультант подтвердит состав заказа и сроки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartItems, totalLabel, ready } = useCart();
  const [sent, setSent] = useState(false);

  return (
    <div className="page-wrap overflow-x-clip pb-28 pt-32 md:pt-40">
      <nav className="text-xs text-muted-foreground">
        <Link to="/">Главная</Link>
        {" / "}
        <Link to="/cart">Корзина</Link>
        {" / "}
        <span className="text-foreground">Оформление заказа</span>
      </nav>
      <h1 className="font-display mt-4 text-4xl font-medium tracking-tight md:text-6xl md:font-semibold">
        Оформление заказа
      </h1>

      {!ready ? null : !cartItems.length ? (
        <div className="mt-10 max-w-xl">
          <p className="text-lg font-medium">Корзина пуста</p>
          <p className="mt-3 text-sm leading-7 text-copy">Добавьте предметы, чтобы оформить заказ.</p>
          <Link
            to="/category/$slug"
            params={{ slug: "sofas" }}
            className="mt-8 inline-block text-sm underline underline-offset-4"
          >
            Перейти к мебели
            <span aria-hidden className="ml-1">
              →
            </span>
          </Link>
        </div>
      ) : sent ? (
        <div className="mt-16 max-w-xl">
          <Check className="size-10 text-primary" />
          <p className="font-display mt-6 text-3xl font-medium md:text-4xl">Спасибо</p>
          <p className="mt-4 text-sm leading-7 text-copy">Мы свяжемся с вами, чтобы подтвердить состав заказа и сроки.</p>
          <Link to="/" className="mt-8 inline-block text-sm underline underline-offset-4">
            Вернуться на главную
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-16">
          <form
            className="min-w-0 max-w-xl space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <p className="text-sm leading-7 text-copy">
              Заказ принимается консультантом. Оставьте контакты — мы подтвердим состав корзины и сроки изготовления.
            </p>
            <input
              required
              aria-label="Имя"
              placeholder="Имя"
              className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              required
              type="tel"
              aria-label="Телефон"
              placeholder="Телефон"
              className="w-full rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              aria-label="Комментарий"
              placeholder="Комментарий"
              rows={4}
              className="w-full resize-none rounded-2xl border border-input bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
            <Button variant="warm" size="lg" className="w-full" type="submit">
              Отправить заявку
            </Button>
          </form>

          <aside className="min-w-0 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            <h2 className="font-display text-2xl font-medium">Ваш заказ</h2>
            <ul className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium">{item.name}</span>
                    <span className="mt-1 block text-copy">
                      {item.quantity} × {item.priceLabel}
                      {fabricLabel(item.fabric) ? ` · ${fabricLabel(item.fabric)}` : ""}
                    </span>
                  </span>
                  <span className="font-price shrink-0">{item.lineTotalLabel}</span>
                </li>
              ))}
            </ul>
            <p className="font-price mt-6 border-t border-border pt-4 text-lg">{totalLabel}</p>
            <Link to="/cart" className="mt-5 inline-block text-sm underline underline-offset-4">
              Вернуться в корзину
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
