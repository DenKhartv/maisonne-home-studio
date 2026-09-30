import type { CatalogSort } from "@/lib/catalog";

export function CatalogSortSelect({
  value,
  onChange,
  className,
}: {
  value: CatalogSort;
  onChange: (value: CatalogSort) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      Сортировать:{" "}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CatalogSort)}
        className="cursor-pointer bg-transparent font-medium text-foreground outline-none"
      >
        <option value="default">По умолчанию</option>
        <option value="price-asc">Сначала дешевле</option>
        <option value="price-desc">Сначала дороже</option>
      </select>
    </label>
  );
}
