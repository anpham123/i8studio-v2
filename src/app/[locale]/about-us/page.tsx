import type { Metadata } from "next";
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

  return <CompanyOverviewContent settings={settingsMap} />;
}
