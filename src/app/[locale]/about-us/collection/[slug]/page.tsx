import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collection-data";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const data = getCollectionBySlug(params.slug);
  if (!data) return {};
  const title = params.locale === "ja" ? data.titleJa : data.titleEn;
  return buildMetadata({
    title: `${title} — Collection`,
    description: params.locale === "ja" ? data.descJa : data.descEn,
    path: `/about-us/collection/${params.slug}`,
    locale: params.locale,
  });
}

export default function CollectionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const data = getCollectionBySlug(params.slug);
  if (!data) notFound();

  return <CollectionDetailContent data={data} />;
}
