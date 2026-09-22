const FAVORITES_KEY = "maisonne-favorites";
const CART_KEY = "maisonne-cart";

export const SHOPPING_STORAGE_EVENT = "maisonne-shopping-change";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, slugs: string[]) {
  localStorage.setItem(key, JSON.stringify(slugs));
  window.dispatchEvent(new Event(SHOPPING_STORAGE_EVENT));
}

function emitChange() {
  window.dispatchEvent(new Event(SHOPPING_STORAGE_EVENT));
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

export function getCart(): string[] {
  return readList(CART_KEY);
}

export function isInCart(slug: string): boolean {
  return getCart().includes(slug);
}

export function addToCart(slug: string) {
  const list = getCart();
  if (list.includes(slug)) {
    emitChange();
    return;
  }
  writeList(CART_KEY, [...list, slug]);
}

export function removeFromCart(slug: string) {
  writeList(
    CART_KEY,
    getCart().filter((s) => s !== slug),
  );
}

export function toggleCart(slug: string): boolean {
  const list = getCart();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  writeList(CART_KEY, next);
  return next.includes(slug);
}
