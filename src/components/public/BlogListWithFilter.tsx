"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  heroImage?: string | null;
  coverOrientation?: string | null;
  publishedAt?: Date | string | null;
  isFeatured?: boolean;
}

interface Props {
  posts: BlogPostItem[];
  locale: string;
  featured?: BlogPostItem;
}

export default function BlogListWithFilter({ posts, locale, featured }: Props) {
  const isJa = locale === "ja";

  const isPostNew = (post: BlogPostItem) => {
    if (!post.publishedAt) return false;
    const postDate = new Date(post.publishedAt).getTime();
    if (isNaN(postDate)) return false;
    const diffDays = (Date.now() - postDate) / (1000 * 60 * 60 * 24);
    // Hiển thị chữ NEW trong vòng 30 ngày (1 tháng) tính từ publishedAt, sau đó tự động mất
    return diffDays >= 0 && diffDays <= 30;
  };

  const renderCard = (post: BlogPostItem) => {
    const isNew = isPostNew(post);

    return (
      <Link
        key={post.id}
        href={`/${locale}/blogs/${post.slug}`}
        className="group flex flex-col h-full bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Cover image: Đồng bộ tỷ lệ ảnh ngang (16:11) với object-cover */}
        <div className="relative overflow-hidden shrink-0 bg-neutral-900 aspect-[16/11]">
          {(post.coverImage || post.heroImage) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.coverImage || post.heroImage || ""}
              alt={post.title.replace(/<[^>]*>/g, "")}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1e1b14] to-[#2a2318]" />
          )}

          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded bg-white text-black font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md border border-black/5">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="min-h-[58px] mb-3 flex items-start">
            <h3
              className="font-serif text-[18px] sm:text-[19px] font-normal text-[var(--ink)] leading-[1.4] line-clamp-2 group-hover:text-[var(--accent)] transition-colors"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
            />
          </div>

          <div className="flex-1 min-h-[64px] mb-4">
            {post.excerpt ? (
              <p className="text-[13.5px] sm:text-[14px] text-[var(--ink-light)] leading-[1.6] line-clamp-3">
                {post.excerpt}
              </p>
            ) : (
              <div className="h-full" />
            )}
          </div>

          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            <span className="text-[var(--ink-muted)] text-[11px] sm:text-[12px]">
              {post.publishedAt ? formatDate(post.publishedAt) : ""}
            </span>
            <span className="text-[var(--accent)] text-[11.5px] sm:text-[12.5px] font-medium tracking-wider uppercase group-hover:underline">
              {isJa ? "続きを読む →" : "Read more →"}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div>
      {/* Featured post (if any) */}
      {featured && (
        <Link
          href={`/${locale}/blogs/${featured.slug}`}
          className="group block mb-12 sm:mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-900">
              {(featured.coverImage || featured.heroImage) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={featured.coverImage || featured.heroImage || ""}
                  alt={featured.title.replace(/<[^>]*>/g, "")}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#1e1b14] to-[#2a2318]" />
              )}

              {/* NEW Badge */}
              {isPostNew(featured) && (
                <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded bg-white text-black font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md border border-black/5">
                  NEW
                </div>
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
                  {featured.publishedAt ? formatDate(featured.publishedAt) : ""}
                </span>
                <span className="text-[var(--accent)] text-[13px] font-medium tracking-wider uppercase group-hover:underline">
                  {isJa ? "続きを読む →" : "Read more →"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ARTICLES SECTION (4 cards per row, uniform landscape) */}
      {posts.length > 0 && (
        <section className="mb-14 sm:mb-18">
          <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[var(--line)]">
            <div className="text-[13.5px] sm:text-[14.5px] text-[var(--ink-muted)] font-medium">
              {isJa ? `記事一覧 (${posts.length})` : `Articles (${posts.length})`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {posts.map((post) => renderCard(post))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-20 bg-white/50 border border-dashed border-[var(--line)] rounded-lg">
          <p className="font-serif text-[20px] text-[var(--ink-muted)] font-light mb-2">
            {isJa ? "記事がありません" : "No articles found"}
          </p>
        </div>
      )}
    </div>
  );
}
