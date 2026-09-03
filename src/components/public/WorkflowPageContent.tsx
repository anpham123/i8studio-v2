"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, type Variants } from "framer-motion";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  Scroll Reveal & Text Color Sweep Animation Variants               */
/* ------------------------------------------------------------------ */
const stepRowVariants: Variants = {
  hidden: {
    opacity: 0.4,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0.5,
    scale: 0.97,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const textSweepVariants: Variants = {
  hidden: {
    backgroundPosition: "100% 0%",
    opacity: 0.4,
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
  visible: (custom: number = 0) => ({
    backgroundPosition: "0% 0%",
    opacity: 1,
    transition: {
      duration: 1.15,
      delay: custom * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
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
      {/* ── Hero: 3D Wireframe to Photoreal Laser Scan Reveal with WORKFLOW Split Typography ── */}
      <section className="border-b border-gray-200/80 overflow-hidden relative w-full min-h-[calc(100vh-var(--header-h,76px))] max-h-[960px] flex items-start justify-center bg-[#0c0b0a] select-none">

        {/* ── 1. Under-Layer: 3D Technical Wireframe / Blueprint Mesh ── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle architectural 3D coordinate grid */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(197, 166, 102, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 166, 102, 0.2) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
          {/* Wireframe Contour Image overlay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage || "/uploads/1787802610927-upscalemedia-transformed.webp"}
            alt="3D Wireframe Mesh"
            className="w-full h-full object-cover object-center opacity-20 filter grayscale invert contrast-200"
          />
          {/* Subtle 3D Depth Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#0c0b0a]/70 to-[#0c0b0a]" />

          {/* Technical HUD Overlay Indicators */}
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 2.8 }}
            className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between pointer-events-none font-mono text-[10px] sm:text-xs text-[#c5a666]/70 uppercase tracking-widest z-10"
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#c5a666] animate-ping" />
                [ 3D WORKFLOW PIPELINE SCAN ]
              </span>
              <span>FOV: 45° | SAMPLES: 4096</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ENGINE: 3DS MAX / V-RAY / CORONA</span>
              <span>RENDER: PHOTOREAL 100%</span>
            </div>
          </motion.div>
        </div>

        {/* ── 2. Top-Layer: Photorealistic Architectural Render (Revealed via Laser Scan) ── */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-0 z-1 overflow-hidden pointer-events-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
            src={heroImage || "/uploads/1787802610927-upscalemedia-transformed.webp"}
            alt="Architectural Visualization Workflow — i8 STUDIO"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* ── 3. Glowing Golden Laser Scan Beam & Flare Sweep ── */}
        <motion.div
          initial={{ left: "-5%", opacity: 0 }}
          animate={{ left: "105%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-y-0 w-12 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center"
        >
          {/* Intense vertical laser beam core */}
          <div className="w-[2.5px] h-full bg-gradient-to-b from-transparent via-[#fff5d0] to-transparent shadow-[0_0_25px_8px_rgba(224,185,110,0.85)]" />
          {/* Trailing soft gold light wash */}
          <div className="absolute inset-y-0 -left-10 w-20 bg-gradient-to-r from-transparent via-[#c5a666]/30 to-transparent blur-md" />
        </motion.div>

        {/* ── 4. Oversized Semi-Transparent "WORKFLOW" Typography Split at Day/Night Divider ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="absolute inset-0 z-30 pointer-events-none flex items-start pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-7 w-full"
        >
          {/* Left 50% (Bright Side): WORK */}
          <div className="w-1/2 flex justify-end pr-2 sm:pr-3 lg:pr-4">
            <h1
              style={{ fontSize: "clamp(3.2rem, 14vw, 12rem)" }}
              className="font-black tracking-[-0.04em] uppercase leading-none select-none font-sans text-white/60 sm:text-white/65 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] text-right"
            >
              WORK
            </h1>
          </div>

          {/* Right 50% (Dark Side): FLOW */}
          <div className="w-1/2 flex justify-start pl-5 sm:pl-8 md:pl-10 lg:pl-12">
            <div
              style={{ fontSize: "clamp(3.2rem, 14vw, 12rem)" }}
              className="font-black tracking-[-0.04em] uppercase leading-none select-none font-sans text-white/60 sm:text-white/65 drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] text-left"
            >
              FLOW
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Steps (Scroll Reveal: Bottom-Up Slide + Text Color Sweep) ───────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-20 md:py-28 space-y-24 md:space-y-32">
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
              variants={stepRowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-40px 0px -40px 0px", amount: 0.2 }}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"
                } gap-10 md:gap-14 lg:gap-16 items-center`}
            >
              {/* Image with Smooth Fade + Slide */}
              <motion.div
                variants={imageVariants}
                className="relative w-full md:w-[42%] lg:w-[40%] aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shrink-0 shadow-sm"
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

              {/* Text Block with Gold Number and Color-Sweep Text */}
              <div className="relative w-full md:w-[58%] lg:w-[60%] flex-1 min-w-0">
                {/* Step Number in Gold / Yellow */}
                <span className="text-5xl md:text-7xl font-bold text-[#b8935a] block mb-2 font-roboto tracking-tight select-none">
                  {num}
                </span>

                {/* Step Title in Gold */}
                <motion.h2
                  variants={{
                    hidden: { opacity: 0.4 },
                    visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
                  }}
                  className="text-2xl md:text-3xl font-semibold md:font-bold mb-4 text-[#b8935a]"
                  style={{
                    fontFamily: isJa
                      ? "var(--font-noto-serif), serif"
                      : "var(--font-cormorant), var(--font-noto-serif), serif",
                  }}
                >
                  {title}
                </motion.h2>

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
                              className="flex items-start gap-2.5 leading-relaxed font-normal"
                            >
                              <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">
                                •
                              </span>
                              <motion.span
                                variants={textSweepVariants}
                                custom={idx + 1}
                                className="flex-1 min-w-0 text-[15px] sm:text-[15.5px] lg:text-[16px] leading-[1.8] font-normal tracking-[-0.01em]"
                                style={{
                                  background: "linear-gradient(90deg, #111111 0%, #111111 50%, #cbd5e1 50%, #cbd5e1 100%)",
                                  backgroundSize: "200% 100%",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  wordBreak: "normal",
                                  lineBreak: "strict",
                                }}
                              >
                                {cleanItem}
                              </motion.span>
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
                        className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-black bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200"
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
