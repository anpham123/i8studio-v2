import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface Post {
  id: string;
  title: string;
  titleJa: string;
  slug: string;
  excerpt: string;
  excerptJa: string;
  coverImage: string;
  publishedAt: string | null;
}

interface NewsSectionProps {
  posts: Post[];
  locale: string;
}

export default function NewsSection({ posts, locale }: NewsSectionProps) {
  const t = useTranslations("news");

  if (!posts.length) return null;

  return (
    <section className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Latest Updates
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post, i) => {
            const title = locale === "ja" ? post.titleJa || post.title : post.title;
            const excerpt = locale === "ja" ? post.excerptJa || post.excerpt : post.excerpt;
            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";

            return (
              <FadeIn key={post.id} delay={i * 0.1}>
                <Link
                  href={`/${locale}/news/${post.slug}`}
                  className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Cover image */}
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    {post.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={post.coverImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={32} className="text-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {date && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                        <Calendar size={11} />
                        {date}
                      </div>
                    )}
                    <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2">{excerpt}</p>
                    )}
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn className="text-center mt-12">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
