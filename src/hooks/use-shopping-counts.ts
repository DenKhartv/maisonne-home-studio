import { useCallback, useEffect, useState } from "react";
import { getCart, getFavorites, SHOPPING_STORAGE_EVENT } from "@/lib/shopping-storage";

export function useShoppingCounts() {
  const refresh = useCallback(() => {
    setFavoritesCount(getFavorites().length);
    setCartCount(getCart().length);
  }, []);

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    refresh();
    window.addEventListener(SHOPPING_STORAGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SHOPPING_STORAGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { favoritesCount, cartCount };
}
