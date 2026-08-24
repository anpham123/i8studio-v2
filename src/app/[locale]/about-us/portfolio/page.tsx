import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import PortfolioFlipbooks from "@/components/public/PortfolioFlipbooks";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Portfolio — About Us",
    description: "Explore the i8 STUDIO portfolio showcasing our best works.",
    path: "/about-us/portfolio",
    locale: params.locale,
  });
}

export default async function AboutPortfolioPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "portfolio" });
  const isJa = params.locale === "ja";

  const [portfolios, flipbooks] = await Promise.all([
    prisma.portfolio.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.flipbook.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const hasContent = portfolios.length > 0 || flipbooks.length > 0;

  if (!hasContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <div className="text-center max-w-xl px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-[#111] mb-4" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "ポートフォリオ" : "Portfolio"}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            {t("comingSoon")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#fafaf8] border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5">
            {isJa ? "ポートフォリオ" : "PORTFOLIO"}
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-[#111] mb-6" style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}>
            {isJa ? "ポートフォリオ" : "Portfolio"}
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            {isJa ? "i8 STUDIOの厳選されたプロジェクトをご覧ください。" : "Explore our curated selection of projects."}
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      {portfolios.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item) => {
              const title = isJa ? (item.titleJa || item.title) : item.title;
              const desc = isJa ? (item.descriptionJa || item.description) : item.description;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                    {item.coverImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.coverImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {item.category && (
                      <span className="text-[11px] uppercase tracking-[0.16em] text-[#b8935a] font-medium">{item.category}</span>
                    )}
                    <h3 className="text-lg font-medium text-[#111] mt-1 mb-1">{title}</h3>
                    {desc && <p className="text-sm text-gray-500 line-clamp-2">{desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Flipbooks Section — interactive page-flip viewer */}
      <PortfolioFlipbooks
        flipbooks={flipbooks.map(fb => ({
          id: fb.id,
          title: fb.title,
          titleJa: fb.titleJa,
          description: fb.description,
          descriptionJa: fb.descriptionJa,
          coverImage: fb.coverImage,
          pdfUrl: fb.pdfUrl,
        }))}
        isJa={isJa}
        hasPortfolios={portfolios.length > 0}
      />
    </div>
  );
}
