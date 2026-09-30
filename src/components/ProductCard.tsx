import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/catalog";
import { FavoriteButton } from "@/components/FavoriteButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative min-w-0">
      <div className="relative overflow-hidden rounded-[24px] bg-secondary aspect-[1200/1008]">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={`Открыть ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" width={1200} height={1008} className="h-full w-full object-cover object-[80%_center] transition duration-700 group-hover:scale-[1.025]" />
        </Link>
        <span className="absolute left-4 top-4 rounded-full border border-olive/30 bg-background/90 px-3 py-2 text-[11px] text-olive">
          Доступны разные цвета
        </span>
        <FavoriteButton slug={product.slug} name={product.name} />
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-medium">{product.name}</h3>
        <p className="font-price shrink-0 text-sm">от {product.price}</p>
      </Link>
    </article>
  );
}
