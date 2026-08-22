import type { Metadata } from "next";

export const dynamic = "force-dynamic";
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
import { sanitizeHtml } from "@/lib/sanitize";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try multiple Unicode normalization forms to handle NFC/NFKD mismatch
  const slugVariants = [
    decodeURIComponent(params.slug),
    decodeURIComponent(params.slug).normalize("NFC"),
    decodeURIComponent(params.slug).normalize("NFKD"),
  ];
  let post = null;
  for (const s of slugVariants) {
    post = await prisma.blogPost.findFirst({
      where: { slug: s, isPublished: true, locale: params.locale },
    });
    if (post) break;
  }
  // Fallback: find any published post with this slug (cross-locale)
  if (!post) {
    for (const s of slugVariants) {
      post = await prisma.blogPost.findFirst({
        where: { slug: s, isPublished: true },
      });
      if (post) break;
    }
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
  const { locale, slug: rawSlug } = params;

  // Try multiple Unicode normalization forms to handle NFC/NFKD mismatch
  const slugVariants = [
    decodeURIComponent(rawSlug),
    decodeURIComponent(rawSlug).normalize("NFC"),
    decodeURIComponent(rawSlug).normalize("NFKD"),
  ];
  let post = null;
  for (const s of slugVariants) {
    post = await prisma.blogPost.findFirst({
      where: { slug: s, isPublished: true, locale },
    });
    if (post) break;
  }
  // Fallback: find any published post with this slug (cross-locale)
  if (!post) {
    for (const s of slugVariants) {
      post = await prisma.blogPost.findFirst({
        where: { slug: s, isPublished: true },
      });
      if (post) break;
    }
  }
  if (!post) notFound();
  const slug = post.slug;

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
        const key = `${section.type || "section"}-${idx}`;
        switch (section.type) {
          case "checkcam":
            return <CheckcamSection key={key} data={section} locale={locale} />;
          case "stage":
            return <StageSection key={key} data={section} locale={locale} />;
          case "insight":
            return <InsightSection key={key} data={section} />;
          case "comparison": {
            const firstAdditional =
              Array.isArray(section.additionalImages) && section.additionalImages.length > 0
                ? typeof section.additionalImages[0] === "string"
                  ? section.additionalImages[0]
                  : section.additionalImages[0].image
                : "";

            const beforeImg = section.image || firstAdditional;
            const afterImg = firstAdditional || section.image;

            return <ComparisonSection key={key} data={section} before={beforeImg} after={afterImg} />;
          }
          default:
            return <StageSection key={key} data={section} locale={locale} />;
        }
      })}

      {/* Comparison */}
      <ComparisonSection
        before={post.comparisonBefore || undefined}
        after={post.comparisonAfter || undefined}
      />

      {/* Insight block */}
      {(post.insightHeading || post.insightBody) && (
        <section className="bg-[var(--surface)] py-[45px] sm:py-[60px]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
            {post.insightHeading && (
              <h3
                className="font-serif text-[20px] sm:text-[26px] font-medium leading-[1.4] text-[var(--ink)] mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.insightHeading) }}
              />
            )}
            {post.insightBody && (
              <div
                className="text-[14px] sm:text-[15px] leading-[1.9] text-[#111]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.insightBody) }}
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
