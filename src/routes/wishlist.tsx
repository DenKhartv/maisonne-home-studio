import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/hooks/use-wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Избранное — Форма" },
      { name: "description", content: "Сохранённые предметы мебели Форма." },
      { property: "og:title", content: "Избранное — Форма" },
      { property: "og:description", content: "Вернитесь к понравившимся диванам, кроватям и креслам." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { favorites, ready } = useWishlist();

  return (
    <div className="page-wrap overflow-x-clip pb-28 pt-32 md:pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Каталог</p>
      <h1 className="font-display mt-4 text-4xl font-medium tracking-tight md:text-6xl md:font-semibold">Избранное</h1>

      {!ready ? null : favorites.length ? (
        <div className="mt-10 grid min-w-0 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 max-w-xl">
          <p className="text-lg font-medium">Здесь пока ничего нет.</p>
          <p className="mt-3 text-sm leading-7 text-copy">
            Сохраняйте понравившиеся предметы, чтобы вернуться к ним позже.
          </p>
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
