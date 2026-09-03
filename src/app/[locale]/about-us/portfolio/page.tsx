import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic to always fetch the latest DB portfolio & flipbook items
export const dynamic = "force-dynamic";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import PortfolioFlipbooks from "@/components/public/PortfolioFlipbooks";
import PortfolioHeroBanner from "@/components/public/PortfolioHeroBanner";

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

  const [portfolios, flipbooks, companyPortfolioRow] = await Promise.all([
    prisma.portfolio.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.flipbook.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.companyContent.findUnique({
      where: { section: "portfolio" },
    }),
  ]);

  let heroImage = "/uploads/1781662116949-House_in_forest__Summer_.webp";
  if (companyPortfolioRow?.contentJson) {
    try {
      const parsed = JSON.parse(companyPortfolioRow.contentJson);
      if (parsed?.heroImage) heroImage = parsed.heroImage;
    } catch { /* ignore */ }
  }

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
          <h1 className="text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "ポートフォリオ" : "Portfolio"}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mt-4">
            {t("comingSoon")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero: Split Editorial Portfolio Banner with 3D Wireframe to Photoreal Laser Scan Effect ── */}
      <PortfolioHeroBanner
        heroImage={heroImage}
        isJa={isJa}
        locale={params.locale}
      />

      {/* Portfolio Grid with Homepage-style Cinematic Hover Zoom */}
      {portfolios.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((item) => {
              const title = isJa ? (item.titleJa || item.title) : item.title;
              const desc = isJa ? (item.descriptionJa || item.description) : item.description;
              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100/90 hover:border-gray-300/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
                >
                  {/* Image Container with Zoom Effect */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden relative">
                    {item.coverImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.coverImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    )}
                    {/* Hover dark cinematic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Category tag */}
                    {item.category && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info area */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#111] group-hover:text-[#b8935a] transition-colors duration-300">
                        {title}
                      </h3>
                      {desc && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed font-normal">
                          {desc}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-xs font-semibold text-[#b8935a] gap-1 group-hover:translate-x-1 transition-transform duration-300">
                      <span>{isJa ? "詳細を見る" : "View Details"}</span>
                      <span>→</span>
                    </div>
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
