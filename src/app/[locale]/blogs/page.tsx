import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description: "Insights, case studies, and behind-the-scenes from i8 STUDIO's architectural visualization work.",
    path: "/blogs",
    locale: params.locale,
  });
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = params;

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, locale },
    orderBy: { publishedAt: "desc" },
  });

  const featured = posts.find((p) => p.isFeatured);
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Hero header */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] font-medium mb-4">
            i8 STUDIO
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light text-[var(--ink)] leading-[1.2] mb-4">
            Blog
          </h1>
          <p className="text-[var(--ink-muted)] text-[15px] leading-[1.8] max-w-[500px] mx-auto">
            制作プロセス、技術的インサイト、建築CG業界のトレンド
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
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.16em] font-medium">
                    {featured.category || "Blog"}
                  </span>
                  <span className="text-[var(--ink-muted)] text-[11px]">
                    {formatDate(featured.publishedAt)}
                  </span>
                </div>
                <h2
                  className="font-serif text-[24px] sm:text-[28px] font-light text-[var(--ink)] leading-[1.4] mb-4"
                  dangerouslySetInnerHTML={{ __html: featured.title }}
                />
                {featured.excerpt && (
                  <p className="text-[14px] text-[var(--ink-light)] leading-[1.8] line-clamp-3 mb-6">
                    {featured.excerpt}
                  </p>
                )}
                <span className="text-[var(--accent)] text-[13px] font-medium tracking-wider uppercase group-hover:underline">
                  Read more →
                </span>
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
                className="group block bg-white border border-[var(--line)] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Cover image */}
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
                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.16em] font-medium">
                      {post.category || "Blog"}
                    </span>
                    <span className="text-[var(--ink-muted)] text-[11px]">·</span>
                    <span className="text-[var(--ink-muted)] text-[11px]">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3
                    className="font-serif text-[20px] sm:text-[22px] font-normal text-[var(--ink)] leading-[1.4] mb-3"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  {post.excerpt && (
                    <p className="text-[14px] text-[var(--ink-light)] leading-[1.7] line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-[var(--accent)] text-[12px] font-medium tracking-wider uppercase group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-[24px] text-[var(--ink-muted)] font-light">
              Coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
