export function parsePrice(price: string) {
  return Number(price.replace(/\D/g, "")) || 0;
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value).replace(/\u00a0/g, " ")} ₽`;
}

export function fabricLabel(fabric?: number) {
  if (typeof fabric !== "number") return null;
  return `Вариант ${fabric + 1}`;
}
