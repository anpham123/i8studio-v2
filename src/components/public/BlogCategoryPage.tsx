import { prisma } from "@/lib/prisma";
import { getCategoryAliases, getCategoryBySlugOrRoute } from "@/lib/blog-categories";
import BlogListWithFilter from "./BlogListWithFilter";

interface Props {
  locale: string;
  categorySlug: string;
  categoryKey: string;
}

export default async function BlogCategoryPage({ locale, categorySlug }: Props) {
  const isJa = locale === "ja";
  const catDef = getCategoryBySlugOrRoute(categorySlug);
  const aliases = getCategoryAliases(categorySlug);

  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
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
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal text-[#111] leading-[1.2] mb-4">
            {isJa ? (catDef?.nameJa || "Blog") : (catDef?.nameEn || "Blog")}
          </h1>
          <p className="text-black font-medium text-[16px] sm:text-[17px] leading-[1.8] max-w-[650px] mx-auto">
            {isJa ? catDef?.descJa : catDef?.descEn}
          </p>
        </div>
      </section>

      {/* Posts Grid with Filter (Full width matching homepage) */}
      <div className="w-full px-3 sm:px-6 md:px-8 pb-24">
        <BlogListWithFilter posts={posts} locale={locale} />
      </div>
    </div>
  );
}
