import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  slug: string;
  name?: string;
  variant?: "overlay" | "inline";
  className?: string;
};

export function FavoriteButton({ slug, name, variant = "overlay", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useWishlist();
  const saved = isFavorite(slug);
  const label = saved
    ? name
      ? `Убрать ${name} из избранного`
      : "Убрать из избранного"
    : name
      ? `Добавить ${name} в избранное`
      : "Добавить в избранное";

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(slug);
  };

  if (variant === "inline") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="compactIcon"
        aria-pressed={saved}
        aria-label={label}
        title={label}
        onClick={onClick}
        className={cn("shrink-0 hover:bg-olive/10 hover:text-olive", className)}
      >
        <Heart className={saved ? "fill-current text-olive" : ""} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="softIcon"
      size="icon"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("absolute right-4 top-4 z-10", className)}
    >
      <Heart className={saved ? "fill-current text-olive" : ""} />
    </Button>
  );
}
