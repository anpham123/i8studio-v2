import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import FadeIn from "./FadeIn";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Post {
  id: string;
  title: string;
  titleJa: string;
  slug: string;
  excerpt: string;
  excerptJa: string;
  coverImage: string;
  category: string;
  publishedAt: Date | string | null;
  createdAt: Date | string;
}

interface NewsSectionProps {
  posts: Post[];
  locale: string;
}

export default function NewsSection({ posts, locale }: NewsSectionProps) {
  const t = useTranslations("news");

  if (!posts.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex items-end justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t("title")}
          </h2>
          <Link
            href={`/${locale}/news`}
            className="hidden sm:flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {t("viewAll")} <ArrowRight size={14} />
          </Link>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const title = locale === "ja" ? post.titleJa || post.title : post.title;
            const excerpt = locale === "ja" ? post.excerptJa || post.excerpt : post.excerpt;
            const date = post.publishedAt || post.createdAt;

            return (
              <FadeIn key={post.id} delay={i * 0.1}>
                <Link
                  href={`/${locale}/news/${post.slug}`}
                  className="group block card-glass overflow-hidden hover:-translate-y-1 hover:border-white/15 transition-all duration-300"
                >
                  {/* Cover */}
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                      <Calendar size={12} />
                      {formatDate(date)}
                      <span className="ml-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-white font-bold leading-snug mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="text-white/50 text-sm line-clamp-2">{excerpt}</p>
                    )}
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn className="text-center mt-10 sm:hidden">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {t("viewAll")} <ArrowRight size={14} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
