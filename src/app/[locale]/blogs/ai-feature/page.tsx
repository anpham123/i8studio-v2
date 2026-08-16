import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { buildMetadata } from "@/lib/seo";
import BlogCategoryPage from "@/components/public/BlogCategoryPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({ title: "AI Column — Blog", description: "AI-powered production workflows and case studies.", path: "/blogs/ai-feature", locale: params.locale });
}

export default function AIFeatureBlogPage({ params }: { params: { locale: string } }) {
  return <BlogCategoryPage locale={params.locale} categorySlug="ai" categoryKey="ai" />;
}
