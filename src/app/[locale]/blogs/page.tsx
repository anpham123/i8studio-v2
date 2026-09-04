import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

import { BLOG_CATEGORIES, getCategoryAliases, getCategoryBySlugOrRoute } from "@/lib/blog-categories";

type Props = {
  params: { locale: string };
  searchParams: { category?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildMetadata({
    title: "Blog — Articles & Insights",
    description: "Insights, case studies, and behind-the-scenes from i8 STUDIO's architectural visualization work.",
    path: "/blogs",
    locale: params.locale,
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



      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pb-20">
        {/* Featured post */}
        {featured && (
          <Link
            href={`/${locale}/blogs/${featured.slug}`}
            className="group block mb-12 sm:mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Image */}
              <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                {(featured.coverImage || featured.heroImage) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={featured.coverImage || featured.heroImage}
                    alt={featured.title.replace(/<[^>]*>/g, "")}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#1e1b14] to-[#2a2318]" />
                )}
              </div>
              {/* Text */}
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <h2
                    className="font-serif text-[22px] sm:text-[26px] font-light text-[var(--ink)] leading-[1.4] mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(featured.title) }}
                  />
                  {featured.excerpt && (
                    <p className="text-[14px] text-[var(--ink-light)] leading-[1.8] line-clamp-3 mb-6">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]/40 mt-auto">
                  <span className="text-[var(--ink-muted)] text-[12px]">
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="text-[var(--accent)] text-[13px] font-medium tracking-wider uppercase group-hover:underline">
                    {isJa ? "続きを読む →" : "Read more →"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blogs/${post.slug}`}
                className="group flex flex-col bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Cover image */}
                <div className="aspect-[4/3] overflow-hidden shrink-0">
                  {(post.coverImage || post.heroImage) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.coverImage || post.heroImage}
                      alt={post.title.replace(/<[^>]*>/g, "")}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1b14] to-[#2a2318]" />
                  )}
                </div>
                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      className="font-serif text-[18px] sm:text-[20px] font-normal text-[var(--ink)] leading-[1.4] mb-3"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
                    />
                    {post.excerpt && (
                      <p className="text-[14px] text-[var(--ink-light)] leading-[1.7] line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-auto">
                    <span className="text-[var(--ink-muted)] text-[11px]">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="text-[var(--accent)] text-[12px] font-medium tracking-wider uppercase group-hover:underline">
                      {isJa ? "続きを読む →" : "Read more →"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
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
