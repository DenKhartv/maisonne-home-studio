import { getCategory, getCollection, products, type Product } from "@/lib/catalog";

const DROPDOWN_LIMIT = 6;

const collectionAliases: Record<string, readonly string[]> = {
  puffy: ["пуффи"],
  mellven: ["меллвен"],
  clo: ["кло", "kloo", "klo"],
};

const categoryAliases: Record<string, readonly string[]> = {
  sofas: ["диван", "диваны", "sofa"],
  beds: ["кровать", "кровати", "bed"],
  armchairs: ["кресло", "кресла", "armchair", "chair"],
  tables: ["столик", "столики", "стол", "table"],
  dressers: ["комод", "комоды", "dresser"],
};

export function normalizeSearchQuery(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function includesNormalized(haystack: string, needle: string) {
  return haystack.includes(needle);
}

function scoreProduct(product: Product, query: string): number | null {
  const name = normalizeSearchQuery(product.name);
  const slugName = normalizeSearchQuery(product.slug.replaceAll("-", " "));
  const collection = getCollection(product.collection);
  const category = getCategory(product.category);
  const collectionName = normalizeSearchQuery(collection?.name ?? "");
  const collectionSlug = normalizeSearchQuery(collection?.slug ?? "");
  const collectionTagline = normalizeSearchQuery(collection?.tagline ?? "");
  const categoryName = normalizeSearchQuery(category?.name ?? "");
  const categorySlug = normalizeSearchQuery(category?.slug ?? "");
  const aliases = [
    ...(collectionAliases[product.collection] ?? []),
    ...(categoryAliases[product.category] ?? []),
  ].map(normalizeSearchQuery);

  if (name === query || slugName === query) return 1000;
  if (name.startsWith(query) || slugName.startsWith(query)) return 920;
  if (name.split(" ").some((word) => word.startsWith(query))) return 840;
  if (includesNormalized(name, query) || includesNormalized(slugName, query)) return 760;

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => includesNormalized(name, token) || includesNormalized(slugName, token))) {
    return 720;
  }

  if (collectionName === query || collectionSlug === query || aliases.includes(query)) return 640;
  if (
    collectionName.startsWith(query) ||
    collectionSlug.startsWith(query) ||
    aliases.some((alias) => alias.startsWith(query) || includesNormalized(alias, query))
  ) {
    return 580;
  }
  if (includesNormalized(collectionName, query) || includesNormalized(collectionSlug, query)) return 520;

  if (categoryName === query || categorySlug === query) return 440;
  if (includesNormalized(categoryName, query) || includesNormalized(categorySlug, query)) return 380;
  if (aliases.some((alias) => includesNormalized(alias, query) || includesNormalized(query, alias))) return 340;

  if (includesNormalized(collectionTagline, query)) return 180;

  const haystack = [name, slugName, collectionName, collectionSlug, collectionTagline, categoryName, categorySlug, ...aliases].join(" ");
  if (tokens.length > 1 && tokens.every((token) => includesNormalized(haystack, token))) return 120;

  return null;
}

export function searchCatalog(query: string): Product[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  return products
    .map((product) => ({ product, score: scoreProduct(product, normalized) }))
    .filter((item): item is { product: Product; score: number } => item.score != null)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "ru"))
    .map((item) => item.product);
}

export function searchCatalogPreview(query: string, limit = DROPDOWN_LIMIT) {
  const matches = searchCatalog(query);
  return {
    items: matches.slice(0, limit),
    total: matches.length,
    hasMore: matches.length > limit,
  };
}

export { DROPDOWN_LIMIT };
