import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import CategoryDirectoryGrid from "@/components/public/CategoryDirectoryGrid";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const topPosts = await prisma.blogPost
    .findMany({
      where: {
        isPublished: true,
        publishedAt: { lte: new Date() },
        locale: params.locale,
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { coverImage: true },
    })
    .catch(() => []);

  let postImages = topPosts.map((p) => p.coverImage).filter(Boolean);
  if (postImages.length < 2) {
    const fallbackPosts = await prisma.blogPost
      .findMany({
        where: { isPublished: true, publishedAt: { lte: new Date() } },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: { coverImage: true },
      })
      .catch(() => []);
    postImages = fallbackPosts.map((p) => p.coverImage).filter(Boolean);
  }

  const img = postImages[0] || "/og-default.jpg";

  return buildMetadata({
    title: isJa
      ? "ブログ・コラム (Blogs & Articles) — 建築CGトレンド・制作ノウハウ"
      : "Blogs & Articles — Insights | i8 STUDIO",
    description: isJa
      ? "建築ビジュアライゼーションの最新技術、CG制作ノウハウ、業界トレンドを発信。"
      : "Insights, case studies, and behind-the-scenes from i8 STUDIO's architectural visualization work.",
    path: "/blogs",
    locale: params.locale,
    image: img,
    images: postImages.length > 0 ? postImages : ["/og-default.jpg"],
  });
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = params;
  const isJa = locale === "ja";

  const [settings, navT] = await Promise.all([
    prisma.setting.findMany(),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const items = [
    {
      label: navT("blogSub.caseStudy"),
      href: `/${locale}/blogs/case-study`,
      thumbnail:
        settingsMap.menuImgBlogCaseStudy ||
        "/uploads/1781164288528-260402_Cover_01.webp",
    },
    {
      label: navT("blogSub.techniqueSharing"),
      href: `/${locale}/blogs/tips`,
      thumbnail:
        settingsMap.menuImgBlogTips || "/uploads/1782700167114-1722_Study.webp",
    },
    {
      label: navT("blogSub.knowledge"),
      href: `/${locale}/blogs/knowledge`,
      thumbnail:
        settingsMap.menuImgBlogKnowledge ||
        "/uploads/1782282467636-wood_sauna_at_ziedlejas_wellness_resort_Sauna.webp",
    },
    {
      label: navT("blogSub.ai"),
      href: `/${locale}/blogs/ai-feature`,
      thumbnail:
        settingsMap.menuImgBlogAi || "/uploads/1781165121094-1722_vr01-2.webp",
    },
    {
      label: navT("blogSub.lifeGallery"),
      href: `/${locale}/blogs/life-gallery`,
      thumbnail:
        settingsMap.menuImgBlogLifeGallery ||
        "/uploads/1781661627502-615196287_122209779764576056_3698202373077728542_n.webp",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-var(--header-h,76px))] bg-white">
      <CategoryDirectoryGrid
        title={isJa ? "ブログ・コラム" : "BLOGS & ARTICLES"}
        items={items}
        gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}
