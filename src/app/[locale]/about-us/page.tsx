import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import CompanyOverviewContent from "@/components/public/CompanyOverviewContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "About Us — Company Overview",
    description:
      "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. 80+ professional staff specializing in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/about-us",
    locale: params.locale,
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

  return <CompanyOverviewContent settings={settingsMap} milestones={milestones} overview={overview} />;
}
