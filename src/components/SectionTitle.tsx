export function SectionTitle({ regular, italic }: { regular: string; italic: string }) {
  return (
    <h2 className="font-display text-4xl leading-tight tracking-[0.04em] md:text-6xl">
      {regular} <em className="font-normal text-olive">{italic}</em>
    </h2>
  );
}