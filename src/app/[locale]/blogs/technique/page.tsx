import type { Metadata } from "next";

export const revalidate = 60;
import { buildMetadata } from "@/lib/seo";
import BlogCategoryPage from "@/components/public/BlogCategoryPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({ title: "Technique Sharing — Blog", description: "3DCG production techniques and tips from i8 STUDIO.", path: "/blogs/technique", locale: params.locale });
}

export default function TechniqueBlogPage({ params }: { params: { locale: string } }) {
  return <BlogCategoryPage locale={params.locale} categorySlug="technique" categoryKey="technique" />;
}
