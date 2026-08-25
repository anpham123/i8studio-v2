import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { prisma } from "@/lib/prisma";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";
import ContactSection from "@/components/public/ContactSection";
import QASection from "@/components/public/QASection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Contact Us & FAQ",
    description:
      "Get in touch with i8 STUDIO for your 3DCG, Animation, VR & BIM project. Free consultation, NDA available. We respond within 24 hours.",
    path: "/contact",
    locale: params.locale,
  });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [settings, services, qaItems] = await Promise.all([
    prisma.setting.findMany(),
    prisma.service.findMany({ orderBy: { order: "asc" }, select: { name: true } }),
    prisma.qA.findMany({ orderBy: { order: "asc" } }),
  ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const faqLd = faqPageJsonLd(
    qaItems.map((q) => ({
      question: locale === "ja" ? q.questionJa || q.question : q.question,
      answer: locale === "ja" ? q.answerJa || q.answer : q.answer,
    }))
  );

  return (
    <div className="min-h-screen">
      {qaItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <ContactSection settings={settingsMap} serviceNames={services.map((s) => s.name)} />
      
      {/* Q&A Section merged directly below Contact */}
      <div className="border-t border-gray-100">
        <QASection items={qaItems} locale={locale} preview={false} />
      </div>
    </div>
  );
}
