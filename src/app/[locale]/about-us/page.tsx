import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import CategoryDirectoryGrid from "@/components/public/CategoryDirectoryGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const setting = await prisma.setting
    .findFirst({
      where: { key: "aboutHeroImage" },
    })
    .catch(() => null);

  const heroImg = setting?.value || "/og-default.jpg";

  return buildMetadata({
    title: isJa
      ? "私たちについて (About Us) — i8 STUDIO"
      : "About Us — i8 STUDIO",
    description: isJa
      ? "ベトナム・ダナンを拠点とする建築ビジュアライゼーション専門スタジオ「i8 STUDIO」。スタッフ80名体制で高品質・短納期の3DCG制作をご提供。"
      : "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. 80+ professional staff specializing in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/about-us",
    locale: params.locale,
    image: heroImg,
    images: [heroImg, "/og-default.jpg"],
  });
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const isJa = params.locale === "ja";
  const [settings, navT] = await Promise.all([
    prisma.setting.findMany(),
    getTranslations({ locale: params.locale, namespace: "nav" }),
  ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const items = [
    {
      label: navT("aboutSub.companyOverview"),
      href: `/${params.locale}/about-us/company-overview`,
      thumbnail:
        settingsMap.menuImgAboutCompany ||
        "/uploads/1781662116949-House_in_forest__Summer_.webp",
    },
    {
      label: navT("aboutSub.portfolio"),
      href: `/${params.locale}/about-us/portfolio`,
      thumbnail:
        settingsMap.menuImgAboutPortfolio ||
        "/uploads/1782359708167-Skyline_Tower.webp",
    },
    {
      label: navT("aboutSub.workflow"),
      href: `/${params.locale}/about-us/workflow`,
      thumbnail:
        settingsMap.menuImgAboutWorkflow ||
        "/uploads/1787802610927-upscalemedia-transformed.webp",
    },
  ];

  const pageLd = webPageJsonLd({
    title: "About Us | i8 STUDIO",
    description:
      "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. 80+ professional staff specializing in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    url: "https://i8studio.vn/about-us",
    images: items.map((i) => i.thumbnail).filter(Boolean) as string[],
  });

  return (
    <div className="min-h-[calc(100vh-var(--header-h,76px))] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <CategoryDirectoryGrid
        title={isJa ? "私たちについて" : "ABOUT US"}
        items={items}
        gridCols="grid-cols-1 sm:grid-cols-3"
      />
    </div>
  );
}
