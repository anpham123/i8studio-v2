import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import AboutSection from "@/components/public/AboutSection";
import WorkflowSection from "@/components/public/WorkflowSection";
import StatsCounter from "@/components/public/StatsCounter";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "About Us",
    description:
      "i8 STUDIO was founded in 2019 in Da Nang, Vietnam. We specialize in high-quality 3DCG, Animation, VR & BIM for the Japanese architecture market. 50+ Japanese clients, 200+ projects.",
    path: "/about-us",
    locale: params.locale,
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  return (
    <div className="min-h-screen">
      <AboutSection locale={locale} showLearnMore={false} />
      <WorkflowSection />
      <StatsCounter />
    </div>
  );
}
