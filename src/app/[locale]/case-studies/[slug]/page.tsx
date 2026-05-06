import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import FadeIn from "@/components/public/FadeIn";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = await prisma.caseStudy.findUnique({ where: { slug: params.slug } });
  if (!cs) return {};

  const title = params.locale === "ja" ? cs.titleJa || cs.title : cs.title;
  const description =
    params.locale === "ja"
      ? cs.challengeJa || cs.challenge || cs.title
      : cs.challenge || cs.title;

  return buildMetadata({
    title,
    description,
    path: `/case-studies/${cs.slug}`,
    locale: params.locale,
    image: cs.afterImage || cs.beforeImage || undefined,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) notFound();

  const title = locale === "ja" ? cs.titleJa || cs.title : cs.title;
  const challenge = locale === "ja" ? cs.challengeJa || cs.challenge : cs.challenge;
  const solution = locale === "ja" ? cs.solutionJa || cs.solution : cs.solution;
  const result = locale === "ja" ? cs.resultJa || cs.result : cs.result;

  let metrics: Record<string, string> = {};
  try {
    if (cs.metrics) metrics = JSON.parse(cs.metrics);
  } catch {}

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <Link
            href={`/${locale}/case-studies`}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
          >
            ← Case Studies
          </Link>

          <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">
            {cs.serviceType || "Case Study"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          {cs.client && (
            <p className="text-white/50 mb-8">Client: {cs.client}</p>
          )}

          {Object.keys(metrics).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {Object.entries(metrics).map(([key, val]) => (
                <div
                  key={key}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-bold text-white mb-1">{val}</p>
                  <p className="text-xs text-white/40 capitalize">{key}</p>
                </div>
              ))}
            </div>
          )}

          {(cs.beforeImage || cs.afterImage) && (
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {cs.beforeImage && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Before</p>
                  <img
                    src={cs.beforeImage}
                    alt={`${title} — before`}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
              {cs.afterImage && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">After</p>
                  <img
                    src={cs.afterImage}
                    alt={`${title} — after`}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-8">
            {challenge && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Challenge</h2>
                <p className="text-white/60 leading-relaxed">{challenge}</p>
              </div>
            )}
            {solution && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Solution</h2>
                <p className="text-white/60 leading-relaxed">{solution}</p>
              </div>
            )}
            {result && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Result</h2>
                <p className="text-white/60 leading-relaxed">{result}</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Start Your Project
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
