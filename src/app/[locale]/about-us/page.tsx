import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import AboutSection from "@/components/public/AboutSection";
import WorkflowSection from "@/components/public/WorkflowSection";
import StatsCounter from "@/components/public/StatsCounter";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "About Us — Our Story & Team",
    description:
      "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. We specialize in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market. 50+ Japanese clients, 200+ projects.",
    path: "/about-us",
    locale: params.locale,
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="min-h-screen">
      <AboutSection locale={locale} showLearnMore={false} settings={settingsMap} />
      <WorkflowSection />
      <StatsCounter settings={settingsMap} />
    </div>
  );
}
