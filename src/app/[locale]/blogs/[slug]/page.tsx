import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, articleJsonLd, getSiteUrl } from "@/lib/seo";
import BlogHero from "@/components/blog/BlogHero";
import BlogIntro from "@/components/blog/BlogIntro";
import BlogFooter from "@/components/blog/BlogFooter";
import ComparisonSection from "@/components/blog/sections/ComparisonSection";
import CheckcamSection from "@/components/blog/sections/CheckcamSection";
import StageSection from "@/components/blog/sections/StageSection";
import InsightSection from "@/components/blog/sections/InsightSection";
import type { SectionData } from "@/components/blog/sections/CheckcamSection";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // First try to find post matching current locale
  let post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, isPublished: true, locale: params.locale },
  });
  // Fallback: find any published post with this slug
  if (!post) {
    post = await prisma.blogPost.findFirst({
      where: { slug: params.slug, isPublished: true },
    });
  }
  if (!post) return {};

  return buildMetadata({
    title: post.title.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, ""),
    description: post.excerpt || post.subtitle || post.title.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, ""),
    path: `/blogs/${post.slug}`,
    locale: params.locale,
    image: post.heroImage || post.coverImage || undefined,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = params;

  // First try to find post matching current locale
  let post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true, locale },
  });
  // Fallback: find any published post with this slug (cross-locale)
  if (!post) {
    post = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
  }
  if (!post) notFound();

  // Parse sections JSON
  let sections: SectionData[] = [];
  try {
    sections = JSON.parse(post.sections || "[]");
  } catch {
    sections = [];
  }

  const siteUrl = getSiteUrl();
  const articleLd = articleJsonLd({
    title: post.title.replace(/<[^>]*>/g, ""),
    description: post.excerpt || post.subtitle || "",
    url: `${siteUrl}/${locale}/blogs/${slug}`,
    imageUrl: post.heroImage || post.coverImage || undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  });

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Hero */}
      <BlogHero
        category={post.category}
        eyebrow={post.eyebrow || undefined}
        title={post.title}
        subtitle={post.subtitle || undefined}
        heroImage={post.heroImage || undefined}
        locale={locale}
      />

      {/* Intro */}
      <BlogIntro
        dropcapText={post.introDropcap || undefined}
        pullquote={post.introPullquote || undefined}
      />

      {/* Dynamic sections */}
      {sections.map((section, idx) => {
        switch (section.type) {
          case "checkcam":
            return <CheckcamSection key={idx} data={section} locale={locale} />;
          case "stage":
            return <StageSection key={idx} data={section} locale={locale} />;
          case "insight":
            return <InsightSection key={idx} data={section} />;
          default:
            return null;
        }
      })}

      {/* Comparison */}
      <ComparisonSection
        before={post.comparisonBefore || undefined}
        after={post.comparisonAfter || undefined}
      />

      {/* Insight block */}
      {(post.insightHeading || post.insightBody) && (
        <section className="bg-[var(--surface-warm)] py-[70px] sm:py-[100px]">
          <div className="max-w-[780px] mx-auto px-6 sm:px-10">
            {post.insightHeading && (
              <h3
                className="font-serif text-[26px] sm:text-[34px] font-light leading-[1.5] text-[var(--ink)] mb-10"
                dangerouslySetInnerHTML={{ __html: post.insightHeading }}
              />
            )}
            {post.insightBody && (
              <p
                className="text-[15px] sm:text-[16px] leading-[2] text-[var(--ink-light)]"
                dangerouslySetInnerHTML={{ __html: post.insightBody }}
              />
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <BlogFooter locale={locale} />
    </article>
  );
}
