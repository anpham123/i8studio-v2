import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Photo Composite Showcase — i8 STUDIO",
    description:
      "Seamlessly blend real photographs with CG to embed design proposals into existing site photos for compelling, realistic presentations.",
    path: "/solution/photo-composite",
    locale: params.locale,
  });
}

export default async function PhotoCompositePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  // Fetch composite examples from database
  const examples = await prisma.compositeExample.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  // Find featured example for the hero slider
  const featured = examples.find((ex) => ex.isFeatured) || examples[0];
  
  // Exclude the featured one from the grid below
  const gridExamples = featured 
    ? examples.filter((ex) => ex.id !== featured.id)
    : examples;

  // Fallbacks if no data in DB
  const defaultBefore = "/photo-composite/featured-before.jpg";
  const defaultAfter = "/photo-composite/featured-after.jpg";

  const featuredBefore = featured?.beforeImage || defaultBefore;
  const featuredAfter = featured?.afterImage || defaultAfter;
  const featuredTitle = locale === "ja" && featured?.titleJp ? featured.titleJp : (featured?.title || "Riverside Residence");
  const featuredLocation = featured?.location || "Da Nang, Vietnam";
  const featuredCategory = featured?.category || "Residential";

  // Setup process translations
  const processSteps = locale === "ja"
    ? [
        { num: "01", title: "現地撮影", titleEn: "Site Photography", desc: "ご提供いただいた現地写真をもとに作成するか、プロの建築写真撮影を手配します。正確なパース合わせのために複数のアングルを確保します。" },
        { num: "02", title: "3Dマッチ・レンダリング", titleEn: "3D Match & Render", desc: "光源写真のカメラ角度、レンズ、照明と完全に一致するように3Dモデルを構築します。周囲の環境光に合わせてレンダーを行います。" },
        { num: "03", title: "合成・色調整", titleEn: "Composite & Grade", desc: "精密なマスキング、カラーグレーディング、空気感の統合により、CGレンダリングを写真に重ね合わせ、シームレスな最終画像を仕上げます。" }
      ]
    : [
        { num: "01", title: "Site Photography", titleEn: "現地撮影", desc: "We work from your provided site photos or arrange professional architectural photography. Multiple angles ensure accurate perspective matching." },
        { num: "02", title: "3D Match & Render", titleEn: "3Dマッチ・レンダリング", desc: "Build the 3D model to exactly match the camera angle, lens, and lighting of the source photo. Render with matching atmospheric conditions." },
        { num: "03", title: "Composite & Grade", titleEn: "合成・色調整", desc: "Layer the CG render onto the photograph with precision masking, color grading, and atmospheric integration for a seamless final image." }
      ];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="py-20 px-6 sm:px-10 max-w-[1100px] mx-auto text-center md:text-left">
        <div className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.24em] mb-6">
          {locale === "ja" ? "サービス · 写真合成" : "Service · Photo Composite"}
        </div>
        <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light leading-[1.2] mb-3 text-gray-900">
          Photo Composite
        </h1>
        <p className="text-gray-400 text-[15px] font-light mb-8 tracking-wide">写真合成</p>
        <p className="text-gray-600 text-[15px] sm:text-[16px] leading-[1.9] max-w-[720px] font-light mx-auto md:mx-0">
          {locale === "ja" ? (
            <>
              実写写真とCGを自然に合成。既存の敷地写真にデザイン案を組み込み、
              よりリアルなプレゼンテーションが可能です。図面だけでは伝わりにくい周辺環境とのスケール感や、
              陽当たり・景観のシミュレーションとしてもご活用いただけます。
            </>
          ) : (
            <>
              Seamlessly blend real photographs with CG to embed design proposals into existing site photos for compelling, realistic presentations. Perfectly simulate scale, sunlight, and neighborhood integration in their true physical context.
            </>
          )}
        </p>
      </section>

      {/* FEATURED SLIDER */}
      <section className="px-6 sm:px-10 mb-28">
        <div className="max-w-[1200px] mx-auto bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-100 shadow-sm">
          <BeforeAfterSlider
            beforeImage={featuredBefore}
            afterImage={featuredAfter}
            beforeLabel={locale === "ja" ? "現地写真 (ORIGINAL)" : "ORIGINAL SITE"}
            afterLabel={locale === "ja" ? "合成後 (COMPOSITE)" : "COMPOSITE"}
            beforeAlt="Original Site Photograph"
            afterAlt="Final Photo Composite Render"
            aspectRatio="16/10"
          />
          <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 px-1">
            <div>
              <p className="text-[14px] text-gray-900 font-semibold tracking-wide">
                {featuredTitle}
              </p>
              <p className="text-[12px] text-gray-500 mt-1">
                {featuredCategory} · {featuredLocation}
              </p>
            </div>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 self-end sm:self-auto">
              {locale === "ja" ? "← ドラッグして比較 →" : "Drag to compare ↔"}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PROCESS */}
      <section className="bg-[#fafaf8] py-24 px-6 sm:px-10 border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-16 text-center">
            <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.24em] mb-4">Process</p>
            <h2 className="font-serif text-[32px] sm:text-[40px] font-light text-gray-900">
              {locale === "ja" ? "制作プロセス" : "How We Compose"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 lg:gap-12">
            {processSteps.map((step) => (
              <div key={step.num} className="relative bg-white p-8 rounded-xl border border-gray-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="font-serif text-[60px] text-blue-600/10 font-bold leading-none mb-4">{step.num}</div>
                  <h3 className="font-serif text-[20px] font-medium text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 font-semibold">{step.titleEn}</p>
                  <p className="text-[13.5px] text-gray-600 leading-[1.8] font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      {gridExamples.length > 0 && (
        <section className="py-24 px-6 sm:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-16 text-center md:text-left">
              <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.24em] mb-4">Portfolio</p>
              <h2 className="font-serif text-[32px] sm:text-[40px] font-light text-gray-900">
                {locale === "ja" ? "その他の制作実績" : "More Composite Examples"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {gridExamples.map((ex) => {
                const exTitle = locale === "ja" && ex.titleJp ? ex.titleJp : ex.title;
                return (
                  <div key={ex.id} className="group bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm">
                    <BeforeAfterSlider
                      beforeImage={ex.beforeImage}
                      afterImage={ex.afterImage}
                      beforeLabel={locale === "ja" ? "Before" : "ORIGINAL"}
                      afterLabel={locale === "ja" ? "After" : "COMPOSITE"}
                      aspectRatio="4/3"
                    />
                    <div className="mt-4 px-1">
                      <p className="text-[14px] text-gray-900 font-semibold tracking-wide">{exTitle}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">{ex.category} {ex.location ? `· ${ex.location}` : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="bg-gray-900 text-white py-28 px-6 sm:px-10 text-center">
        <div className="max-w-[700px] mx-auto">
          <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.24em] mb-6">Get Started</p>
          <h2 className="font-serif text-[32px] sm:text-[44px] font-light mb-6 text-white leading-tight">
            {locale === "ja" ? "写真合成のご相談・お見積り" : "Have a project in mind?"}
          </h2>
          <p className="text-gray-400 text-[14px] sm:text-[15px] mb-10 max-w-[540px] mx-auto leading-[1.8] font-light">
            {locale === "ja" ? (
              "現地の敷地写真やドローン空撮写真と、設計図面・3Dデザイン案をお送りください。プレゼン資料のクオリティを高める高品質な写真合成パースを作成いたします。"
            ) : (
              "Send us your site photographs and design intent. We'll deliver photorealistic composites that elevate your presentations and win clients."
            )}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-white text-gray-950 px-10 py-4 text-[13px] uppercase tracking-widest font-semibold hover:bg-gray-100 transition duration-200 shadow-lg rounded"
          >
            {locale === "ja" ? "写真合成の相談を始める →" : "Start a Composite Project →"}
          </Link>
        </div>
      </section>
    </div>
  );
}
