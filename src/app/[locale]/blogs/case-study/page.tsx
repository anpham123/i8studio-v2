import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import BlogCategoryPage from "@/components/public/BlogCategoryPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({ title: "Case Study — Blog", description: "Real project case studies from i8 STUDIO.", path: "/blogs/case-study", locale: params.locale });
}

export default function CaseStudyBlogPage({ params }: { params: { locale: string } }) {
  return <BlogCategoryPage locale={params.locale} categorySlug="case-study" categoryKey="caseStudy" />;
}
