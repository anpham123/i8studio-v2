import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

import { BLOG_CATEGORIES, getCategoryAliases, getCategoryBySlugOrRoute } from "@/lib/blog-categories";
import BlogListWithFilter from "@/components/public/BlogListWithFilter";

type Props = {
  params: { locale: string };
  searchParams: { category?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const topPost = await prisma.blogPost.findFirst({
    where: { isPublished: true, locale: params.locale },
    orderBy: { publishedAt: "desc" },
    select: { coverImage: true },
  }).catch(() => null);

  const img = topPost?.coverImage || "/og-default.jpg";

  return buildMetadata({
    title: isJa
      ? "ブログ・知見 (Blog) — 建築CGトレンド・制作ノウハウ"
      : "Blog — Articles & Insights | i8 STUDIO",
    description: isJa
      ? "建築ビジュアライゼーションの最新技術、CG制作ノウハウ、業界トレンドを発信。"
      : "Insights, case studies, and behind-the-scenes from i8 STUDIO's architectural visualization work.",
    path: "/blogs",
    locale: params.locale,
    image: img,
    images: [img, "/og-default.jpg"],
  });
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale } = params;
  const activeCategory = searchParams.category;
  const isJa = locale === "ja";

  const catDef = activeCategory ? getCategoryBySlugOrRoute(activeCategory) : undefined;
  const aliases = activeCategory ? getCategoryAliases(activeCategory) : undefined;

  const where: Record<string, unknown> = { isPublished: true, locale };
  if (aliases) {
    where.category = { in: aliases };
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  const featured = !activeCategory ? posts.find((p) => p.isFeatured) : undefined;
  const rest = posts.filter((p) => p.id !== featured?.id);

  const collectionLd = collectionPageJsonLd({
    title: "Blog — Articles & Insights | i8 STUDIO",
    description: "Insights, case studies, and behind-the-scenes from i8 STUDIO's architectural visualization work.",
    url: `https://i8studio.vn/${locale}/blogs`,
    items: posts.map((p) => ({
      title: p.title,
      url: `https://i8studio.vn/${locale}/blogs/${p.slug}`,
      image: p.coverImage || undefined,
      description: p.excerpt || undefined,
    })),
  });

  const heroEyebrow = activeCategory ? "BLOG" : "i8 STUDIO";
  const heroTitle = activeCategory
    ? (isJa ? (catDef?.nameJa || "ブログ") : (catDef?.nameEn || "Blog"))
    : (isJa ? "ブログ" : "Blog");
  const heroDesc = activeCategory
    ? (isJa ? catDef?.descJa : catDef?.descEn)
    : (isJa
      ? "制作プロセス、技術的インサイト、建築CG業界のトレンド"
      : "Production process, technical insights, and architectural CG trends.");

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      {/* Hero header */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] font-medium mb-4">
            {heroEyebrow}
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light text-[var(--ink)] leading-[1.2] mb-4">
            {heroTitle}
          </h1>
          <p className="text-[var(--ink-muted)] text-[15px] leading-[1.8] max-w-[600px] mx-auto">
            {heroDesc}
          </p>
        </div>
      </section>



      <div className="w-full px-3 sm:px-6 md:px-8 pb-24">
        {posts.length > 0 ? (
          <BlogListWithFilter
            posts={rest}
            featured={featured}
            locale={locale}
          />
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-[24px] text-[var(--ink-muted)] font-light mb-4">
              {activeCategory
                ? (isJa ? "この カテゴリの記事はまだありません" : "No articles in this category yet")
                : "Coming soon..."}
            </p>
            {activeCategory && (
              <Link href={`/${locale}/blogs`} className="text-[var(--accent)] text-sm font-medium hover:underline">
                {isJa ? "すべての記事を見る →" : "View all articles →"}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
