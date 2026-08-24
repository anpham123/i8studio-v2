"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

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
    descJa: "V-Ray / Corona等のレンダリングエンジンで高解像度出力。ノイズ除去、カラーグレーディング、レタッチを経て、フォトリアルな最終画像を納品します。",
    descEn: "High-resolution output via V-Ray / Corona rendering engines. Deliver photorealistic final images through denoising, color grading, and retouching.",
    image: "",
    tags: "V-Ray,Corona,Denoising,Post-production",
  },
];

interface Props {
  steps?: WorkflowStep[];
}

export default function WorkflowPageContent({ steps }: Props) {
  const locale = useLocale();
  const isJa = locale === "ja";

  // Use DB steps if available, otherwise fallback
  const displaySteps = steps && steps.length > 0 ? steps : FALLBACK_STEPS;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5">
            {isJa ? "ワークフロー" : "WORKFLOW"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-[#111] mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? "プロフェッショナルな制作工程" : "Professional Production Workflow"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isJa
              ? "お客様のビジョンを最高品質のビジュアルへと変換する、プロフェッショナルなステップ。"
              : "Professional steps to transform your vision into the highest quality visuals."}
          </motion.p>
        </div>
      </section>

      {/* ── Steps (alternating) ───────── */}
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
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-[45%] aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shrink-0">
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
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">{title}</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="w-full md:w-[55%] flex-1">
                <span className="text-5xl md:text-7xl font-bold text-[#111] block mb-2 font-roboto tracking-tight">
                  {num}
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold md:font-bold text-[#111] mb-4" style={{ fontFamily: isJa ? "var(--font-noto-serif), serif" : "var(--font-cormorant), var(--font-noto-serif), serif" }}>
                  {title}
                </h2>
                {(() => {
                  const rawDesc = desc || "";
                  // Split by newlines first
                  let items = rawDesc
                    .split(/\r?\n/)
                    .map((s) => s.trim())
                    .filter(Boolean);

                  // If it's a single block without newlines, split by sentence endings for Japanese (。) or English (. ) if long
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
                            <li key={idx} className="flex items-start gap-2.5 text-gray-500 text-base leading-relaxed [text-wrap:pretty]">
                              <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">•</span>
                              <span className="flex-1">{cleanItem}</span>
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
                      <span key={tag} className="text-[11px] font-medium uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
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
      <section className="bg-[#fafaf8] section-noise">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-8" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "まずはお気軽にご相談ください" : "Feel free to contact us"}
            </h2>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors"
            >
              {isJa ? "お問い合わせ" : "Contact Us"} →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
