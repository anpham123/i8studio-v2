"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { SlidersHorizontal } from "lucide-react";

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
  const [orientationFilter, setOrientationFilter] = useState<"landscape" | "portrait">("landscape");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const orientation = post.coverOrientation || "landscape";
      return orientation === orientationFilter;
    });
  }, [posts, orientationFilter]);

  const newestPostId = useMemo(() => {
    if (featured && posts.length > 0) {
      const featTime = featured.publishedAt ? new Date(featured.publishedAt).getTime() : 0;
      const postTime = posts[0].publishedAt ? new Date(posts[0].publishedAt).getTime() : 0;
      return featTime >= postTime ? featured.id : posts[0].id;
    }
    return featured?.id || posts[0]?.id || null;
  }, [posts, featured]);

  const isPostNew = (post: BlogPostItem) => {
    if (post.id === newestPostId) return true;
    if (!post.publishedAt) return false;
    const postDate = new Date(post.publishedAt).getTime();
    const diffDays = (Date.now() - postDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div>
      {/* Featured post (only shown when matching active orientation) */}
      {featured && (featured.coverOrientation || "landscape") === orientationFilter && (
        <Link
          href={`/${locale}/blogs/${featured.slug}`}
          className="group block mb-12 sm:mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <div className={`relative ${featured.coverOrientation === "portrait" ? "aspect-[9/16] lg:aspect-auto" : "aspect-[16/10] lg:aspect-auto"} overflow-hidden bg-neutral-900`}>
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

      {/* Filter bar with Dropdown (Landscape vs Portrait only) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--line)]">
        <div className="text-[13px] text-[var(--ink-muted)] font-medium">
          {isJa ? `記事一覧 (${filteredPosts.length})` : `Articles (${filteredPosts.length})`}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="orientation-select" className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wider">
            <SlidersHorizontal size={14} className="text-[var(--accent)]" />
            <span>{isJa ? "表示形式:" : "Orientation:"}</span>
          </label>
          <div className="relative">
            <select
              id="orientation-select"
              value={orientationFilter}
              onChange={(e) => setOrientationFilter(e.target.value as "landscape" | "portrait")}
              className="appearance-none bg-white border border-[var(--line)] text-[var(--ink)] text-xs rounded-md pl-3 pr-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer shadow-sm transition-all"
            >
              <option value="landscape">
                {isJa ? " 横向き (Landscape)" : " Landscape"}
              </option>
              <option value="portrait">
                {isJa ? " 縦向き (Portrait)" : " Portrait"}
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 5 cards per row for Portrait, 4 cards per row for Landscape */}
      {filteredPosts.length > 0 ? (
        <div
          className={
            orientationFilter === "portrait"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          }
        >
          {filteredPosts.map((post) => {
            const isPortrait = post.coverOrientation === "portrait";
            const isNew = isPostNew(post);

            return (
              <Link
                key={post.id}
                href={`/${locale}/blogs/${post.slug}`}
                className="group flex flex-col h-full bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Cover image: Portrait (aspect 9:16 full-bleed uncropped) vs Landscape (16:11) */}
                <div
                  className={`relative overflow-hidden shrink-0 bg-neutral-900 ${
                    isPortrait ? "aspect-[9/16]" : "aspect-[16/11]"
                  }`}
                >
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
                <div className={`${isPortrait ? "p-4 sm:p-4.5" : "p-5 sm:p-6"} flex flex-col flex-1`}>
                  <div className={`${isPortrait ? "min-h-[48px] mb-2.5" : "min-h-[58px] mb-3"} flex items-start`}>
                    <h3
                      className={`font-serif ${isPortrait ? "text-[16px] sm:text-[17px]" : "text-[18px] sm:text-[19px]"} font-normal text-[var(--ink)] leading-[1.4] line-clamp-2 group-hover:text-[var(--accent)] transition-colors`}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
                    />
                  </div>

                  <div className={`flex-1 ${isPortrait ? "min-h-[54px] mb-3" : "min-h-[64px] mb-4"}`}>
                    {post.excerpt ? (
                      <p className={`${isPortrait ? "text-[12.5px] sm:text-[13px]" : "text-[13.5px] sm:text-[14px]"} text-[var(--ink-light)] leading-[1.6] line-clamp-3`}>
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
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/50 border border-dashed border-[var(--line)] rounded-lg">
          <p className="font-serif text-[20px] text-[var(--ink-muted)] font-light mb-2">
            {isJa
              ? orientationFilter === "portrait"
                ? "縦向き形式の記事がありません"
                : "横向き形式の記事がありません"
              : `No articles found for ${orientationFilter} orientation`}
          </p>
          <button
            onClick={() => setOrientationFilter(orientationFilter === "landscape" ? "portrait" : "landscape")}
            className="text-[var(--accent)] text-xs font-semibold hover:underline mt-2"
          >
            {isJa
              ? orientationFilter === "landscape"
                ? "縦向きの記事を表示"
                : "横向きの記事を表示"
              : `Switch to ${orientationFilter === "landscape" ? "portrait" : "landscape"}`}
          </button>
        </div>
      )}
    </div>
  );
}
