import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { BLOG_CATEGORIES, getCategoryAliases, getCategoryBySlugOrRoute } from "@/lib/blog-categories";

interface Props {
  locale: string;
  categorySlug: string;
  categoryKey: string;
}

export default async function BlogCategoryPage({ locale, categorySlug, categoryKey }: Props) {
  const isJa = locale === "ja";
  const catDef = getCategoryBySlugOrRoute(categorySlug);
  const aliases = getCategoryAliases(categorySlug);

  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: { in: aliases },
      locale,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Hero header */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-[#b8935a] text-[15px] sm:text-[16px] uppercase tracking-[0.24em] font-bold mb-4">
            BLOG
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal text-[#111] leading-[1.2] mb-4">
            {isJa ? (catDef?.nameJa || "Blog") : (catDef?.nameEn || "Blog")}
          </h1>
          <p className="text-black font-medium text-[16px] sm:text-[17px] leading-[1.8] max-w-[650px] mx-auto">
            {isJa ? catDef?.descJa : catDef?.descEn}
          </p>
        </div>
      </section>



      {/* Posts Grid */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pb-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blogs/${post.slug}`}
                className="group block bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
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
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.16em] font-medium">
                      {isJa ? (catDef?.nameJa || post.category) : (catDef?.nameEn || post.category)}
                    </span>
                    <span className="text-[var(--ink-muted)] text-[11px]">·</span>
                    <span className="text-[var(--ink-muted)] text-[11px]">
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </span>
                  </div>
                  <h3
                    className="font-serif text-[18px] sm:text-[20px] font-normal text-[var(--ink)] leading-[1.4] mb-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
                  />
                  {post.excerpt && (
                    <p className="text-[14px] text-[var(--ink-light)] leading-[1.7] line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-[var(--accent)] text-[12px] font-medium tracking-wider uppercase group-hover:underline">
                    {isJa ? "続きを読む →" : "Read more →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-[24px] text-[var(--ink-muted)] font-light mb-4">
              {isJa ? "このカテゴリの記事はまだありません" : "No articles in this category yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
