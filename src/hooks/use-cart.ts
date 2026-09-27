import { useCallback, useEffect, useMemo, useState } from "react";
import { getCollection, getProduct } from "@/lib/catalog";
import { formatPrice, parsePrice } from "@/lib/price";
import {
  addToCart as persistAdd,
  clearCart as persistClear,
  getCart,
  getCartCount,
  removeFromCart as persistRemove,
  SHOPPING_STORAGE_EVENT,
  updateCartQuantity as persistQuantity,
  type CartLine,
} from "@/lib/shopping-storage";

export type CartItem = CartLine & {
  name: string;
  image: string;
  collectionName?: string;
  unitPrice: number;
  lineTotal: number;
  priceLabel: string;
  lineTotalLabel: string;
};

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setLines(getCart());
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

  const cartItems = useMemo<CartItem[]>(
    () =>
      lines.flatMap((line) => {
        const product = getProduct(line.productId);
        if (!product) return [];
        const unitPrice = parsePrice(product.price);
        const lineTotal = unitPrice * line.quantity;
        return [
          {
            ...line,
            name: product.name,
            image: product.image,
            collectionName: getCollection(product.collection)?.name,
            unitPrice,
            lineTotal,
            priceLabel: formatPrice(unitPrice),
            lineTotalLabel: formatPrice(lineTotal),
          },
        ];
      }),
    [lines],
  );

  const count = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.lineTotal, 0), [cartItems]);

  const addToCart = useCallback((input: { productId: string; quantity?: number; fabric?: number }) => {
    persistAdd(input);
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    persistRemove(lineId);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    persistQuantity(lineId, quantity);
  }, []);

  const clearCart = useCallback(() => {
    persistClear();
  }, []);

  const getCartCountFn = useCallback(() => getCartCount(), []);
  const getCartTotal = useCallback(() => total, [total]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount: getCartCountFn,
    getCartTotal,
    count,
    total,
    totalLabel: formatPrice(total),
    ready,
  };
}
