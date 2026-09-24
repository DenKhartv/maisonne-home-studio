export function SectionTitle({ regular, italic }: { regular: string; italic: string }) {
  return (
    <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl md:font-semibold">
      {regular} <em className="font-accent text-olive">{italic}</em>
    </h2>
  );
}
