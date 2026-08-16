import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { buildMetadata } from "@/lib/seo";
import BlogCategoryPage from "@/components/public/BlogCategoryPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({ title: "Knowledge — Blog", description: "Industry knowledge and trends in architectural visualization.", path: "/blogs/knowledge", locale: params.locale });
}

export default function KnowledgeBlogPage({ params }: { params: { locale: string } }) {
  return <BlogCategoryPage locale={params.locale} categorySlug="knowledge" categoryKey="knowledge" />;
}
