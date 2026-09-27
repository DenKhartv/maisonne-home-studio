import { createFileRoute, notFound } from "@tanstack/react-router";
import { CollectionTemplate } from "@/components/CollectionTemplate";
import { getCollection } from "@/lib/catalog";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Коллекция"} — Форма` },
      { name: "description", content: loaderData?.tagline ?? "Коллекция мебели Форма." },
      { property: "og:title", content: `${loaderData?.name ?? "Коллекция"} — Форма` },
      { property: "og:description", content: loaderData?.tagline ?? "Коллекция мебели Форма." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();
  return <CollectionTemplate collection={collection} />;
}
