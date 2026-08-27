"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { MessageSquare } from "lucide-react";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  Diagonal Wipe Reveal Animation Variants                           */
/* ------------------------------------------------------------------ */
const diagonalCurtainVariants: Variants = {
  hidden: {
    clipPath: "polygon(0 0, 160% 0, 100% 100%, -40% 100%)",
  },
  visible: {
    clipPath: "polygon(160% 0, 160% 0, 160% 100%, 160% 100%)",
    transition: {
      duration: 2.4,
      ease: easeCurve,
    },
  },
};

const diagonalTextCurtainVariants: Variants = {
  hidden: {
    clipPath: "polygon(0 0, 160% 0, 100% 100%, -40% 100%)",
  },
  visible: {
    clipPath: "polygon(160% 0, 160% 0, 160% 100%, 160% 100%)",
    transition: {
      duration: 2.4,
      delay: 0.15,
      ease: easeCurve,
    },
  },
};

const imageInnerVariants: Variants = {
  hidden: { scale: 1.18, opacity: 0.7 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2.8,
      ease: easeCurve,
    },
  },
};

interface WorkflowStep {
  stepNumber: number;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  image: string;
  tags: string;
}

// Fallback hardcoded steps (only used when DB has no data)
const FALLBACK_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    titleJa: "シーン解析",
    titleEn: "Scene Analysis",
    descJa: "お客様の図面・参考資料・要望を丁寧にヒアリング。建物の用途、ターゲット層、撮影アングル、季節感・時間帯など、完成イメージを正確に把握します。",
    descEn: "Careful briefing on drawings, references, and requirements. We accurately understand the building's purpose, target audience, shooting angles, seasonal atmosphere, and time of day.",
    image: "",
    tags: "Drawing analysis,Camera angle design,Mood board creation",
  },
  {
    stepNumber: 2,
    titleJa: "モデリング設定",
    titleEn: "Modeling Setup",
    descJa: "CAD/BIMデータを基に精密な3Dモデルを構築。家具・小物の配置、マテリアル・テクスチャの設定を行い、空間のディテールを忠実に再現します。",
    descEn: "Build precise 3D models from CAD/BIM data. Arrange furniture and accessories, set materials and textures to faithfully reproduce spatial details.",
    image: "",
    tags: "3ds Max,SketchUp,BIM integration,Material setup",
  },
  {
    stepNumber: 3,
    titleJa: "ライティング設定",
    titleEn: "Lighting Setup",
    descJa: "自然光と人工照明のリアルなシミュレーション。HDRI環境マップ、IESライトプロファイルを活用し、空間の雰囲気と奥行きを表現します。",
    descEn: "Realistic simulation of natural and artificial lighting. Utilize HDRI environment maps and IES light profiles to express spatial ambiance and depth.",
    image: "",
    tags: "HDRI,IES profiles,GI settings,Sun study",
  },
  {
    stepNumber: 4,
    titleJa: "レンダリング",
    titleEn: "Rendering",
    descJa: "V-Ray / Corona等のレンダリングエンジンで高解像度出力。ノイズ除去、カラーグレーディング、レタッチを経て、フォトリアルな final 画像を納品します。",
    descEn: "High-resolution output via V-Ray / Corona rendering engines. Deliver photorealistic final images through denoising, color grading, and retouching.",
    image: "",
    tags: "V-Ray,Corona,Denoising,Post-production",
  },
];

interface Props {
  steps?: WorkflowStep[];
  heroImage?: string;
}

export default function WorkflowPageContent({ steps, heroImage }: Props) {
  const locale = useLocale();
  const isJa = locale === "ja";

  const displaySteps = steps && steps.length > 0 ? steps : FALLBACK_STEPS;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero: Full-Width Day/Night Split Background with Centered Semi-Transparent WORKFLOW ────────── */}
      <section className="border-b border-gray-200/80 overflow-hidden relative w-full min-h-[calc(100vh-var(--header-h,76px))] max-h-[960px] flex items-center justify-center bg-gray-950">

        {/* Full-width Background Image (Clean, Sharp & Clear) */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage || "/uploads/1787802610927-upscalemedia-transformed.webp"}
            alt="Architectural Visualization Workflow — i8 STUDIO"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Centered Oversized Semi-Transparent "WORKFLOW" Typography Split at Day/Night Divider */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center w-full">
          {/* Left 50% (Bright Side): WORK */}
          <div className="w-1/2 flex justify-end pr-2.5 sm:pr-3.5 lg:pr-5">
            <h1
              style={{ fontSize: "clamp(2.8rem, 12.8vw, 15rem)" }}
              className="font-black tracking-[-0.04em] uppercase leading-none select-none font-sans text-white/60 sm:text-white/65 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] text-right"
            >
              WORK
            </h1>
          </div>

          {/* Right 50% (Dark Side): FLOW */}
          <div className="w-1/2 flex justify-start pl-2.5 sm:pl-3.5 lg:pl-5">
            <div
              style={{ fontSize: "clamp(2.8rem, 12.8vw, 15rem)" }}
              className="font-black tracking-[-0.04em] uppercase leading-none select-none font-sans text-white/60 sm:text-white/65 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] text-left"
            >
              FLOW
            </div>
          </div>
        </div>

        {/* Top-Left: Eyebrow */}
        <div className="absolute top-8 left-6 sm:top-10 sm:left-10 lg:top-12 lg:left-14 z-20 pointer-events-none">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            {isJa ? "建築CG制作工程" : "ARCHITECTURAL WORKFLOW"}
          </p>
        </div>

        {/* Bottom-Left: Narrative Description */}
        <div className="absolute bottom-8 left-6 sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-14 z-20 pointer-events-none max-w-sm sm:max-w-md">
          <p className="text-xs sm:text-[13px] text-white/85 font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] font-sans">
            {isJa
              ? "お客様のビジョンを最高品質のビジュアルへと変換する、プロフェッショナルなステップ。モデリングからライティング、高品質レンダリングまで一贯してサポートします。"
              : "Professional steps to transform your vision into the highest quality visuals. From initial 3D modeling and lighting to photorealistic rendering and post-production."}
          </p>
        </div>

        {/* Bottom-Right: Get Quote Button */}
        <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-14 z-20 pointer-events-auto">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/85 hover:bg-black text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-105"
          >
            <MessageSquare size={14} className="text-white/90" />
            <span>{isJa ? "見積もり依頼" : "Get Quote"}</span>
          </Link>
        </div>
      </section>

      {/* ── Steps (Diagonal Wipe Reveal on WHOLE SECTION: Image + Text) ───────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-24 md:space-y-32">
        {displaySteps.map((step, i) => {
          const reverse = i % 2 === 1;
          const num = String(step.stepNumber).padStart(2, "0");
          const title = isJa ? step.titleJa : step.titleEn;
          const desc = isJa ? step.descJa : step.descEn;
          const tags = step.tags
            ? step.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

          return (
            <motion.div
              key={num + "-" + i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"
                } gap-8 md:gap-12 lg:gap-16 items-center`}
            >
              {/* Image with Diagonal Wipe Reveal Shutter */}
              <div className="relative w-full md:w-[42%] lg:w-[40%] aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shrink-0 shadow-sm">
                {/* Diagonal Wipe Shutter Curtain */}
                <motion.div
                  variants={diagonalCurtainVariants}
                  className="absolute inset-0 z-10 bg-white pointer-events-none"
                />

                {/* Inner Image with slow zoom out */}
                <motion.div
                  variants={imageInnerVariants}
                  className="w-full h-full"
                >
                  {step.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={step.image}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        const p = t.parentElement;
                        if (p) {
                          p.classList.add("flex", "items-center", "justify-center");
                          const s = document.createElement("span");
                          s.className = "text-gray-400 text-sm font-medium";
                          s.textContent = title;
                          p.appendChild(s);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f4f2ee]">
                      <span className="text-gray-400 text-sm font-medium">{title}</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Text Block with matching Diagonal Wipe Reveal Shutter */}
              <div className="relative w-full md:w-[58%] lg:w-[60%] flex-1 min-w-0 overflow-hidden">
                {/* Diagonal Wipe Shutter Curtain on Text */}
                <motion.div
                  variants={diagonalTextCurtainVariants}
                  className="absolute inset-0 z-10 bg-white pointer-events-none"
                />

                <span className="text-5xl md:text-7xl font-bold text-[#111] block mb-2 font-roboto tracking-tight">
                  {num}
                </span>
                <h2
                  className="text-2xl md:text-3xl font-semibold md:font-bold text-[#111] mb-4"
                  style={{
                    fontFamily: isJa
                      ? "var(--font-noto-serif), serif"
                      : "var(--font-cormorant), var(--font-noto-serif), serif",
                  }}
                >
                  {title}
                </h2>
                {(() => {
                  const rawDesc = desc || "";
                  let items = rawDesc
                    .split(/\r?\n/)
                    .map((s) => s.trim())
                    .filter(Boolean);

                  if (items.length <= 1 && rawDesc.length > 60) {
                    if (isJa && rawDesc.includes("。")) {
                      items = rawDesc
                        .split(/(?<=。)/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    } else if (!isJa && rawDesc.includes(". ")) {
                      items = rawDesc
                        .split(/(?<=\.\s+)/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    }
                  }

                  if (items.length === 0 && rawDesc.trim()) {
                    items = [rawDesc.trim()];
                  }

                  if (items.length > 0) {
                    return (
                      <ul className="space-y-2.5 mb-6">
                        {items.map((item, idx) => {
                          const cleanItem = item.replace(/^[-•・*]\s*/, "");
                          return (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-gray-600 text-[15px] sm:text-base leading-relaxed"
                            >
                              <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">
                                •
                              </span>
                              <span className="flex-1 min-w-0">{cleanItem}</span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  return null;
                })()}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── CTA ──────────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2
            className="text-2xl md:text-3xl font-light text-[#111] mb-8"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            {isJa ? "まずはお気軽にご相談ください" : "Feel free to contact us"}
          </h2>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors shadow-sm"
          >
            <span>{isJa ? "お問い合わせ" : "Contact Us"}</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
