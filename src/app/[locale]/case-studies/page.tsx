import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import CaseStudyPreview from "@/components/public/CaseStudyPreview";
import FadeIn from "@/components/public/FadeIn";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Case Studies — Success Stories",
    description:
      "Real results for real clients. Explore i8 STUDIO's case studies showing how we helped Japanese architecture firms with 3DCG, VR, and BIM solutions.",
    path: "/case-studies",
    locale: params.locale,
  });
}

export default async function CaseStudiesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">
              Results That Speak
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Success Stories
            </h1>
          </div>
        </FadeIn>

        {caseStudies.length === 0 ? (
          <p className="text-center text-white/50 py-20">No case studies yet.</p>
        ) : (
          <CaseStudyPreview caseStudies={caseStudies} locale={locale} />
        )}
      </div>
    </main>
  );
}
