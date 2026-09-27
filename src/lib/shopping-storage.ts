const FAVORITES_KEY = "maisonne-favorites";
const CART_KEY = "maisonne-cart";

export const SHOPPING_STORAGE_EVENT = "maisonne-shopping-change";

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  fabric?: number;
};

const memoryLists: Record<string, string[]> = {};
let memoryCart: CartLine[] = [];

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHOPPING_STORAGE_EVENT));
}

function readList(key: string): string[] {
  if (typeof window === "undefined") return memoryLists[key] ?? [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const list = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    memoryLists[key] = list;
    return list;
  } catch {
    return memoryLists[key] ?? [];
  }
}

function writeList(key: string, slugs: string[]) {
  memoryLists[key] = slugs;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(slugs));
  } catch {
    // Private mode / quota — keep the in-memory list for this session.
  }
  emitChange();
}

export function cartLineId(productId: string, fabric?: number) {
  return typeof fabric === "number" ? `${productId}::${fabric}` : productId;
}

function normalizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLine[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      lines.push({ id: cartLineId(item), productId: item, quantity: 1 });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const productId =
      typeof record.productId === "string"
        ? record.productId
        : typeof record.slug === "string"
          ? record.slug
          : "";
    if (!productId) continue;
    const quantity = Math.max(1, Math.floor(Number(record.quantity) || 1));
    const fabric = typeof record.fabric === "number" && Number.isInteger(record.fabric) ? record.fabric : undefined;
    lines.push({
      id: typeof record.id === "string" ? record.id : cartLineId(productId, fabric),
      productId,
      quantity,
      ...(fabric != null ? { fabric } : {}),
    });
  }
  return lines;
}

function readCart(): CartLine[] {
  if (typeof window === "undefined") return memoryCart;
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const lines = normalizeCart(parsed);
    memoryCart = lines;
    return lines;
  } catch {
    return memoryCart;
  }
}

function writeCart(lines: CartLine[]) {
  memoryCart = lines;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Private mode / quota — keep the in-memory list for this session.
  }
  emitChange();
}

export function getFavorites(): string[] {
  return readList(FAVORITES_KEY);
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const list = getFavorites();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  writeList(FAVORITES_KEY, next);
  return next.includes(slug);
}

export function removeFavorite(slug: string) {
  writeList(
    FAVORITES_KEY,
    getFavorites().filter((item) => item !== slug),
  );
}

export function clearFavorites() {
  writeList(FAVORITES_KEY, []);
}

export function getCart(): CartLine[] {
  return readCart();
}

export function getCartCount(): number {
  return getCart().reduce((sum, line) => sum + line.quantity, 0);
}

export function isInCart(productId: string): boolean {
  return getCart().some((line) => line.productId === productId);
}

export function addToCart(input: { productId: string; quantity?: number; fabric?: number }) {
  const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
  const id = cartLineId(input.productId, input.fabric);
  const list = getCart();
  const existing = list.find((line) => line.id === id);
  if (existing) {
    writeCart(list.map((line) => (line.id === id ? { ...line, quantity: line.quantity + quantity } : line)));
    return;
  }
  writeCart([
    ...list,
    {
      id,
      productId: input.productId,
      quantity,
      ...(input.fabric != null ? { fabric: input.fabric } : {}),
    },
  ]);
}

export function removeFromCart(lineId: string) {
  writeCart(getCart().filter((line) => line.id !== lineId));
}

export function updateCartQuantity(lineId: string, quantity: number) {
  const next = Math.floor(quantity);
  if (next <= 0) {
    removeFromCart(lineId);
    return;
  }
  writeCart(getCart().map((line) => (line.id === lineId ? { ...line, quantity: next } : line)));
}

export function clearCart() {
  writeCart([]);
}
