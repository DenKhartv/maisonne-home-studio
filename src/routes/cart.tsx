import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { fabricLabel } from "@/lib/price";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Корзина — Форма" },
      { name: "description", content: "Корзина выбранной мебели Форма." },
      { property: "og:title", content: "Корзина — Форма" },
      { property: "og:description", content: "Проверьте выбранные предметы перед оформлением заказа." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartItems, count, totalLabel, ready, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="page-wrap overflow-x-clip pb-28 pt-32 md:pt-40">
      <nav className="text-xs text-muted-foreground">
        <Link to="/">Главная</Link>
        {" / "}
        <span className="text-foreground">Корзина</span>
      </nav>
      <h1 className="font-display mt-4 text-4xl font-medium tracking-tight md:text-6xl md:font-semibold">Корзина</h1>

      {!ready ? null : cartItems.length ? (
        <div className="mt-10 grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-16 xl:gap-24">
          <ul className="min-w-0 divide-y divide-border/80">
            {cartItems.map((item) => (
              <CartLineRow
                key={item.id}
                item={item}
                onQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </ul>

          <aside className="min-w-0 border-t border-border pt-8 lg:sticky lg:top-32 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0 xl:pl-14">
            <h2 className="font-display text-2xl font-medium md:text-3xl">Итого</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-copy">Стоимость товаров</dt>
                <dd className="font-price">{totalLabel}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <dt className="font-medium">Общая сумма</dt>
                <dd className="font-price text-lg">{totalLabel}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {count} {countLabel(count)}
            </p>
            <Button asChild variant="warm" size="lg" className="mt-8 w-full">
              <Link to="/checkout">Оформить заказ</Link>
            </Button>
            <Link
              to="/category/$slug"
              params={{ slug: "sofas" }}
              className="mt-5 inline-block text-sm underline underline-offset-4"
            >
              Продолжить покупки
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </aside>
        </div>
      ) : (
        <div className="mt-10 max-w-xl">
          <p className="text-lg font-medium">Корзина пуста</p>
          <p className="mt-3 text-sm leading-7 text-copy">Добавьте понравившиеся предметы, чтобы оформить заказ.</p>
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
      )}
    </div>
  );
}

function countLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "предмет";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "предмета";
  return "предметов";
}

function CartLineRow({
  item,
  onQuantity,
  onRemove,
}: {
  item: CartItem;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const fabric = fabricLabel(item.fabric);

  return (
    <li className="grid min-w-0 grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-8 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-6 md:grid-cols-[11rem_minmax(0,1fr)_auto]">
      <Link to="/product/$slug" params={{ slug: item.productId }} className="min-w-0">
        <span className="block overflow-hidden rounded-[20px] bg-secondary aspect-[4/3]">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        </span>
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to="/product/$slug" params={{ slug: item.productId }} className="text-lg font-medium leading-snug md:text-xl">
              {item.name}
            </Link>
            {item.collectionName && (
              <p className="mt-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Коллекция {item.collectionName}
              </p>
            )}
            {fabric && <p className="mt-2 text-sm text-copy">Ткань и цвет: {fabric}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="compactIcon"
            aria-label={`Удалить ${item.name}`}
            className="shrink-0 hover:bg-olive/10 hover:text-olive sm:hidden"
            onClick={() => onRemove(item.id)}
          >
            <X />
          </Button>
        </div>

        <p className="font-price mt-4 text-sm">{item.priceLabel}</p>

        <div className="mt-5 flex items-center justify-between gap-4 sm:justify-start">
          <QuantityControl
            name={item.name}
            quantity={item.quantity}
            onDecrease={() => onQuantity(item.id, item.quantity - 1)}
            onIncrease={() => onQuantity(item.id, item.quantity + 1)}
          />
          <p className="font-price text-sm sm:hidden">{item.lineTotalLabel}</p>
        </div>
      </div>

      <div className="hidden min-w-[7rem] flex-col items-end sm:flex">
        <p className="font-price text-base">{item.lineTotalLabel}</p>
        <Button
          type="button"
          variant="ghost"
          className="mt-6 h-auto px-0 text-sm text-copy hover:bg-transparent hover:text-foreground"
          onClick={() => onRemove(item.id)}
        >
          Удалить
        </Button>
      </div>
    </li>
  );
}

function QuantityControl({
  name,
  quantity,
  onDecrease,
  onIncrease,
}: {
  name: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button
        type="button"
        aria-label={`Уменьшить количество: ${name}`}
        className="grid size-11 place-items-center text-foreground transition-colors duration-200 hover:text-olive"
        onClick={onDecrease}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums">{quantity}</span>
      <button
        type="button"
        aria-label={`Увеличить количество: ${name}`}
        className="grid size-11 place-items-center text-foreground transition-colors duration-200 hover:text-olive"
        onClick={onIncrease}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
