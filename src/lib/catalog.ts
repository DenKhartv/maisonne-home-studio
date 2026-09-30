import sofa from "@/assets/maisonne-hero-sofa.jpg";
import bedroom from "@/assets/maisonne-bedroom.jpg";
import chair from "@/assets/maisonne-chair.jpg";
import lifestyle from "@/assets/maisonne-lifestyle.jpg";

export const images = { sofa, bedroom, chair, lifestyle };

export const categories = [
  { slug: "sofas", name: "Диваны", image: sofa },
  { slug: "beds", name: "Кровати", image: bedroom },
  { slug: "armchairs", name: "Кресла", image: chair },
  { slug: "tables", name: "Столики", image: sofa },
  { slug: "dressers", name: "Комоды", image: bedroom },
] as const;

/** Карточки категорий на главной (без столиков и комодов). */
export const homeCategories = categories.filter(
  (category) => category.slug !== "tables" && category.slug !== "dressers",
);

export const homeCategoryShowcase = [
  {
    slug: "sofas",
    name: "Диваны",
    /** Не hero-sofa: отдельный кадр интерьера с диваном */
    image: lifestyle,
    sense: "для отдыха и разговоров",
    imageClass: "object-cover object-[center_45%]",
    imageTone: "normal" as const,
  },
  {
    slug: "beds",
    name: "Кровати",
    image: bedroom,
    sense: "для спокойного сна",
    imageClass: "object-cover object-[center_42%]",
    imageTone: "normal" as const,
  },
  {
    slug: "armchairs",
    name: "Кресла",
    image: chair,
    sense: "для личного пространства",
    imageClass: "object-cover object-[center_28%]",
    imageTone: "dark" as const,
  },
] as const;

export const collections = [
  { slug: "puffy", name: "Пуффи", tagline: "Мягкие линии для неспешной жизни", image: sofa },
  { slug: "mellven", name: "Меллвен", tagline: "Естественная форма спокойствия", image: lifestyle },
  { slug: "clo", name: "Кло", tagline: "Тактильный комфорт каждый день", image: bedroom },
] as const;

export const sofaSeatFilters = [
  { id: "2", name: "Двухместные", image: lifestyle },
  { id: "3", name: "Трехместные", image: sofa },
  { id: "4", name: "Четырехместные", image: sofa },
  { id: "modular", name: "Модульные", image: lifestyle },
] as const;

export type SofaSeats = (typeof sofaSeatFilters)[number]["id"];

export type Product = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: string;
  image: string;
  lifestyle?: boolean;
  /** Только для диванов: быстрый визуальный фильтр на /category/sofas */
  seats?: SofaSeats;
};

export const products: Product[] = [
  { slug: "puffy-sofa", name: "Диван Puffy", category: "sofas", collection: "puffy", price: "89 900 ₽", image: sofa, seats: "3" },
  { slug: "mellven-modular", name: "Модульный диван Mellven", category: "sofas", collection: "mellven", price: "119 900 ₽", image: lifestyle, lifestyle: true, seats: "modular" },
  { slug: "clo-sofa", name: "Диван Clo", category: "sofas", collection: "clo", price: "94 900 ₽", image: sofa, seats: "4" },
  { slug: "puffy-compact", name: "Диван Puffy Compact", category: "sofas", collection: "puffy", price: "74 900 ₽", image: lifestyle, seats: "2" },
  { slug: "mellven-bed", name: "Кровать Mellven", category: "beds", collection: "mellven", price: "99 900 ₽", image: bedroom },
  { slug: "clo-bed", name: "Кровать Clo", category: "beds", collection: "clo", price: "109 900 ₽", image: bedroom },
  { slug: "puffy-chair", name: "Кресло Puffy", category: "armchairs", collection: "puffy", price: "49 900 ₽", image: chair },
  { slug: "mellven-chair", name: "Кресло Mellven", category: "armchairs", collection: "mellven", price: "54 900 ₽", image: chair },
  { slug: "clo-table", name: "Столик Clo", category: "tables", collection: "clo", price: "34 900 ₽", image: chair },
  { slug: "puffy-dresser", name: "Комод Puffy", category: "dressers", collection: "puffy", price: "64 900 ₽", image: bedroom },
];

export type Collection = (typeof collections)[number];

export const getCategory = (slug: string) => categories.find((item) => item.slug === slug);
export const getCollection = (slug: string) => collections.find((item) => item.slug === slug);
export const getProduct = (slug: string) => products.find((item) => item.slug === slug);

export type CatalogSort = "default" | "price-asc" | "price-desc";

export function sortProducts<T extends { price: string }>(items: readonly T[], sort: CatalogSort): T[] {
  const value = (item: T) => Number(item.price.replace(/\D/g, ""));
  if (sort === "price-asc") return [...items].sort((a, b) => value(a) - value(b));
  if (sort === "price-desc") return [...items].sort((a, b) => value(b) - value(a));
  return [...items];
}

export function getCollectionProducts(collectionSlug: string) {
  return products.filter((product) => product.collection === collectionSlug);
}

export function countProductsInCategory(categorySlug: string) {
  return products.filter((product) => product.category === categorySlug).length;
}