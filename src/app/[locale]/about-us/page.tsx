import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import CompanyOverviewContent from "@/components/public/CompanyOverviewContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const setting = await prisma.setting.findFirst({
    where: { key: "aboutHeroImage" },
  }).catch(() => null);

  const heroImg = setting?.value || "/og-default.jpg";

  return buildMetadata({
    title: isJa
      ? "会社概要 (About Us) — i8 STUDIO"
      : "About Us — Company Overview | i8 STUDIO",
    description: isJa
      ? "ベトナム・ダナンを拠点とする建築ビジュアライゼーション専門スタジオ「i8 STUDIO」。スタッフ80名体制で高品質・短納期の3DCG制作をご提供。"
      : "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. 80+ professional staff specializing in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/about-us",
    locale: params.locale,
    image: heroImg,
    images: [heroImg, "/og-default.jpg"],
  });
}

export default async function AboutPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  // Fetch milestones & overview from company_content
  const [milestonesRow, overviewRow] = await Promise.all([
    prisma.companyContent.findUnique({ where: { section: "milestones" } }),
    prisma.companyContent.findUnique({ where: { section: "overview" } }),
  ]);

  let milestones: Array<{
    year?: string;
    yearJa?: string;
    yearEn?: string;
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
    image?: string;
    images?: string[];
  }> = [];
  if (milestonesRow?.contentJson) {
    try {
      const parsed = JSON.parse(milestonesRow.contentJson);
      if (Array.isArray(parsed)) milestones = parsed;
    } catch { /* ignore */ }
  }

  let overview: Record<string, string> = {};
  if (overviewRow?.contentJson) {
    try {
      overview = JSON.parse(overviewRow.contentJson);
    } catch { /* ignore */ }
  }

  const milestoneImages = milestones.map((m) => m.image).filter(Boolean) as string[];
  const aboutImages = [settingsMap.aboutHeroImage, ...milestoneImages, "/og-default.jpg"].filter(Boolean) as string[];

  const pageLd = webPageJsonLd({
    title: "About Us — Company Overview | i8 STUDIO",
    description:
      "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. 80+ professional staff specializing in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    url: "https://i8studio.vn/about-us",
    images: aboutImages,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <CompanyOverviewContent settings={settingsMap} milestones={milestones} overview={overview} />
    </>
  );
}
