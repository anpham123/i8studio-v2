import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, organizationJsonLd, websiteJsonLd, faqPageJsonLd } from "@/lib/seo";
import HeroSlider from "@/components/public/HeroSlider";
import SocialProofBar from "@/components/public/SocialProofBar";
import StrengthsSection from "@/components/public/StrengthsSection";
import StatsCounter from "@/components/public/StatsCounter";
import ServicesSection from "@/components/public/ServicesSection";
import WorksSection from "@/components/public/WorksSection";
import ProcessSection from "@/components/public/ProcessSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import AboutSection from "@/components/public/AboutSection";
import CaseStudyPreview from "@/components/public/CaseStudyPreview";
import ConcernsSection from "@/components/public/ConcernsSection";
import NewsSection from "@/components/public/NewsSection";
import QASection from "@/components/public/QASection";
import ContactSection from "@/components/public/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return buildMetadata({
    title: "i8 STUDIO — 3DCG, Animation, VR & BIM",
    description:
      "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
    path: "",
    locale,
  });
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const [slides, partners, services, works, testimonials, caseStudies, posts, qaItems, settings] =
    await Promise.all([
      prisma.slide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.partner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.service.findMany({ orderBy: { order: "asc" } }),
      prisma.work.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ where: { featured: true }, orderBy: { order: "asc" } }),
      prisma.caseStudy.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.post.findMany({
        where: { status: "PUBLISHED", category: "NEWS" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.qA.findMany({ orderBy: { order: "asc" } }),
      prisma.setting.findMany(),
    ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();
  const faqJsonLd = faqPageJsonLd(
    qaItems.map((q) => ({
      question: locale === "ja" ? q.questionJa || q.question : q.question,
      answer: locale === "ja" ? q.answerJa || q.answer : q.answer,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      {qaItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* 1. Hero Slider */}
      <HeroSlider slides={slides} />

      {/* 2. Social Proof Bar */}
      <SocialProofBar partners={partners} />

      {/* 3. Strengths */}
      <StrengthsSection />

      {/* 4. Stats Counter */}
      <StatsCounter />

      {/* 5. Services */}
      <ServicesSection services={services} locale={locale} />

      {/* 6. Works */}
      <WorksSection works={works} locale={locale} />

      {/* 7. Process */}
      <ProcessSection locale={locale} />

      {/* 8. Testimonials */}
      <TestimonialsSection testimonials={testimonials} locale={locale} />

      {/* 9. About Us */}
      <AboutSection locale={locale} />

      {/* 10. Case Studies (skip if empty) */}
      {caseStudies.length > 0 && (
        <CaseStudyPreview caseStudies={caseStudies} locale={locale} />
      )}

      {/* 11. Concerns */}
      <ConcernsSection locale={locale} />

      {/* 12. News */}
      <NewsSection posts={posts} locale={locale} />

      {/* 13. Q&A */}
      <QASection items={qaItems} locale={locale} preview />

      {/* 14. Contact */}
      <ContactSection settings={settingsMap} />
    </>
  );
}
