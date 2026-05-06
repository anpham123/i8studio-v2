import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";
import QASection from "@/components/public/QASection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "FAQ — Frequently Asked Questions",
    description:
      "Answers to common questions about i8 STUDIO's 3DCG, Animation, VR & BIM services — pricing, timelines, process, and working with Japanese clients.",
    path: "/qa",
    locale: params.locale,
  });
}

export default async function QAPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const qaItems = await prisma.qA.findMany({ orderBy: { order: "asc" } });

  const faqLd = faqPageJsonLd(
    qaItems.map((q) => ({
      question: locale === "ja" ? q.questionJa || q.question : q.question,
      answer: locale === "ja" ? q.answerJa || q.answer : q.answer,
    }))
  );

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-20">
      {qaItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <QASection items={qaItems} locale={locale} />
    </main>
  );
}
