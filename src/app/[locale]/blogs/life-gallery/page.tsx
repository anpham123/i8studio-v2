import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { buildMetadata } from "@/lib/seo";
import BlogCategoryPage from "@/components/public/BlogCategoryPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({ title: "I8 Life Gallery — Blog", description: "A glimpse into the daily life and culture of the i8 STUDIO team.", path: "/blogs/life-gallery", locale: params.locale });
}

export default function LifeGalleryBlogPage({ params }: { params: { locale: string } }) {
  return <BlogCategoryPage locale={params.locale} categorySlug="life-gallery" categoryKey="lifeGallery" />;
}
