import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import FadeIn from "@/components/public/FadeIn";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description:
      "Insights, tips, and industry knowledge from the i8 STUDIO team — 3DCG, Animation, VR & BIM experts.",
    path: "/blog",
    locale: params.locale,
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const { locale } = params;
  const page = Number(searchParams.page ?? 1);
  const limit = 9;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", category: "BLOG" },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: { status: "PUBLISHED", category: "BLOG" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">
              Insights & Tips
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
          </div>
        </FadeIn>

        {posts.length === 0 ? (
          <p className="text-center text-white/50 py-20">No blog posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => {
              const title = locale === "ja" ? post.titleJa || post.title : post.title;
              const excerpt = locale === "ja" ? post.excerptJa || post.excerpt : post.excerpt;
              return (
                <FadeIn key={post.id}>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="block group bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors"
                  >
                    {post.coverImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                    )}
                    <div className="p-6">
                      <p className="text-xs text-white/40 mb-2">
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                      </p>
                      <h2 className="text-white font-semibold text-lg leading-snug mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="text-white/50 text-sm line-clamp-2">{excerpt}</p>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/${locale}/blog?page=${p}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
