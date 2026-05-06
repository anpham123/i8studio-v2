import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, articleJsonLd, getSiteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, status: "PUBLISHED", category: "BLOG" },
  });
  if (!post) return {};

  const title = params.locale === "ja" ? post.titleJa || post.title : post.title;
  const description =
    params.locale === "ja"
      ? post.excerptJa || post.excerpt || post.title
      : post.excerpt || post.title;

  return buildMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    locale: params.locale,
    image: post.coverImage || undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = params;
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED", category: "BLOG" },
  });
  if (!post) notFound();

  const title = locale === "ja" ? post.titleJa || post.title : post.title;
  const content = locale === "ja" ? post.contentJa || post.content : post.content;
  const excerpt = locale === "ja" ? post.excerptJa || post.excerpt : post.excerpt;

  const siteUrl = getSiteUrl();
  const articleLd = articleJsonLd({
    title,
    description: excerpt || title,
    url: `${siteUrl}/${locale}/blog/${slug}`,
    imageUrl: post.coverImage || undefined,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          ← Back to Blog
        </Link>

        {post.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <p className="text-xs text-purple-400 font-semibold tracking-widest uppercase mb-3">
            Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/40 text-sm">
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </p>
        </header>

        {excerpt && (
          <p className="text-white/60 text-lg leading-relaxed mb-8 border-l-2 border-purple-500/50 pl-4">
            {excerpt}
          </p>
        )}

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-blue-400 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </main>
  );
}
