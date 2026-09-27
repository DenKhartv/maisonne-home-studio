import { useCallback, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import {
  clearFavorites as persistClear,
  getFavorites,
  removeFavorite as persistRemove,
  SHOPPING_STORAGE_EVENT,
  toggleFavorite as persistToggle,
} from "@/lib/shopping-storage";

export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSlugs(getFavorites());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(SHOPPING_STORAGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SHOPPING_STORAGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const favorites = useMemo(
    () => slugs.map((slug) => getProduct(slug)).filter((product): product is Product => Boolean(product)),
    [slugs],
  );

  const isFavorite = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggleFavorite = useCallback((slug: string) => persistToggle(slug), []);
  const removeFavorite = useCallback((slug: string) => persistRemove(slug), []);
  const clearFavorites = useCallback(() => persistClear(), []);

  return {
    favorites,
    favoriteSlugs: slugs,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    ready,
  };
}
