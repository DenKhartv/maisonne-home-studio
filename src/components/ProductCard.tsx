import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";
import { isFavorite, SHOPPING_STORAGE_EVENT, toggleFavorite } from "@/lib/shopping-storage";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isFavorite(product.slug));
    sync();
    window.addEventListener(SHOPPING_STORAGE_EVENT, sync);
    return () => window.removeEventListener(SHOPPING_STORAGE_EVENT, sync);
  }, [product.slug]);
  return (
    <article className="group relative min-w-0">
      <div className="relative overflow-hidden rounded-[24px] bg-secondary aspect-[4/3]">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={`Открыть ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" width={1200} height={1008} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
        </Link>
        <span className="absolute left-4 top-4 rounded-full border border-olive/30 bg-background/90 px-3 py-2 text-[11px] text-olive">
          Доступны разные цвета
        </span>
        <Button
          variant="softIcon"
          size="icon"
          onClick={() => setSaved(toggleFavorite(product.slug))}
          aria-label={saved ? "Убрать из избранного" : "Добавить в избранное"}
          className="absolute right-4 top-4"
        >
          <Heart className={saved ? "fill-current text-olive" : ""} />
        </Button>
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-medium">{product.name}</h3>
        <p className="font-price shrink-0 text-sm">от {product.price}</p>
      </Link>
    </article>
  );
}