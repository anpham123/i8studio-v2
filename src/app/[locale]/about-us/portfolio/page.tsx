import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic to always fetch the latest DB portfolio & flipbook items
export const dynamic = "force-dynamic";
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
      {/* ── Hero: Split Editorial Portfolio Banner (Matching User Reference) ── */}
      <section className="bg-white border-b border-gray-100 overflow-hidden">
        <div className="w-full min-h-[calc(100vh-var(--header-h,76px))] max-h-[950px] grid grid-cols-1 lg:grid-cols-2 items-stretch">
          
          {/* Left Column: White Editorial Layout */}
          <div className="bg-white p-8 sm:p-12 md:p-14 lg:p-16 xl:p-20 flex flex-col justify-between items-start z-10">
            {/* Top Eyebrow */}
            <div className="w-full">
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.22em] text-[#111] uppercase font-sans">
                ARCHITECTURAL
              </p>
              <p className="text-[11px] sm:text-xs font-normal tracking-[0.28em] text-gray-500 uppercase font-sans mt-0.5">
                VISUALIZATION
              </p>
            </div>

            {/* Center Typographic Statement & Narrative */}
            <div className="my-auto py-8 sm:py-10 md:py-12 w-full space-y-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#111] tracking-[0.22em] sm:tracking-[0.28em] uppercase select-none leading-[1.18] font-roboto">
                <span className="block">P O R T -</span>
                <span className="block mt-1 sm:mt-2">F O L I O</span>
              </h1>

              {/* Architectural Divider */}
              <div className="w-20 h-0.5 bg-[#b8935a]" />

              {/* Rich Narrative Description */}
              <div className="space-y-2.5 max-w-xl">
                <p className="text-gray-800 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                  {isJa
                    ? "建築のアイデアを、鮮明でリアルなビジュアル体験へと具現化します。"
                    : "Transforming architectural ideas into realistic visual experiences."}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                  {isJa ? (
                    <>
                      <span className="font-semibold text-gray-700">Explore our works in:</span> 建築3DCGパース | VR | アニメーション | Digital Visualization
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-700">Explore our works in:</span> Architectural CG | VR | Animation | Digital Visualization
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Credits & Action Link */}
            <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal tracking-wide">
                  By i8 STUDIO
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isJa ? "建築CGパース・VR・アニメーション制作スタジオ" : "Architectural 3DCG & VR Studio"}
                </p>
              </div>

              <Link
                href={`/${params.locale}/works`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] hover:bg-[#333] text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 group"
              >
                <span>{isJa ? "プロジェクト一覧" : "Selected works"}</span>
                <span className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Forest Pavilion Render */}
          <div className="relative w-full h-[420px] sm:h-[520px] lg:h-auto min-h-full overflow-hidden bg-gray-900 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/1781662116949-House_in_forest__Summer_.webp"
              alt="Architectural Visualization Portfolio — i8 STUDIO"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

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
