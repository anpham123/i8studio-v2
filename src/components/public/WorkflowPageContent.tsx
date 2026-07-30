"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const STEPS = [
  {
    num: "01",
    titleJa: "シーン解析",
    titleEn: "Scene Analysis",
    descJa: "お客様の図面・参考資料・要望を丁寧にヒアリング。建物の用途、ターゲット層、撮影アングル、季節感・時間帯など、完成イメージを正確に把握します。",
    descEn: "Careful briefing on drawings, references, and requirements. We accurately understand the building's purpose, target audience, shooting angles, seasonal atmosphere, and time of day.",
    tagsJa: ["図面解析", "カメラアングル設計", "ムードボード作成"],
    tagsEn: ["Drawing analysis", "Camera angle design", "Mood board creation"],
    image: "/uploads/workflow-step-1.jpg",
  },
  {
    num: "02",
    titleJa: "モデリング設定",
    titleEn: "Modeling Setup",
    descJa: "CAD/BIMデータを基に精密な3Dモデルを構築。家具・小物の配置、マテリアル・テクスチャの設定を行い、空間のディテールを忠実に再現します。",
    descEn: "Build precise 3D models from CAD/BIM data. Arrange furniture and accessories, set materials and textures to faithfully reproduce spatial details.",
    tagsJa: ["3ds Max", "SketchUp", "BIM連携", "マテリアル設定"],
    tagsEn: ["3ds Max", "SketchUp", "BIM integration", "Material setup"],
    image: "/uploads/workflow-step-2.jpg",
  },
  {
    num: "03",
    titleJa: "ライティング設定",
    titleEn: "Lighting Setup",
    descJa: "自然光と人工照明のリアルなシミュレーション。HDRI環境マップ、IESライトプロファイルを活用し、空間の雰囲気と奥行きを表現します。",
    descEn: "Realistic simulation of natural and artificial lighting. Utilize HDRI environment maps and IES light profiles to express spatial ambiance and depth.",
    tagsJa: ["HDRI", "IESプロファイル", "GI設定", "サンスタディ"],
    tagsEn: ["HDRI", "IES profiles", "GI settings", "Sun study"],
    image: "/uploads/workflow-step-3.jpg",
  },
  {
    num: "04",
    titleJa: "レンダリング",
    titleEn: "Rendering",
    descJa: "V-Ray / Corona等のレンダリングエンジンで高解像度出力。ノイズ除去、カラーグレーディング、レタッチを経て、フォトリアルな最終画像を納品します。",
    descEn: "High-resolution output via V-Ray / Corona rendering engines. Deliver photorealistic final images through denoising, color grading, and retouching.",
    tagsJa: ["V-Ray", "Corona", "ノイズ除去", "ポストプロダクション"],
    tagsEn: ["V-Ray", "Corona", "Denoising", "Post-production"],
    image: "/uploads/workflow-step-4.jpg",
  },
];

export default function WorkflowPageContent() {
  const locale = useLocale();
  const isJa = locale === "ja";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5">
            WORKFLOW
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
              ? "お客様のビジョンを最高品質のビジュアルへと変換する、4つのプロフェッショナルステップ。"
              : "Four professional steps to transform your vision into the highest quality visuals."}
          </motion.p>
        </div>
      </section>

      {/* ── Steps (alternating) ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-24 md:space-y-32">
        {STEPS.map((step, i) => {
          const reverse = i % 2 === 1;
          const title = isJa ? step.titleJa : step.titleEn;
          const desc = isJa ? step.descJa : step.descEn;
          const tags = isJa ? step.tagsJa : step.tagsEn;

          return (
            <motion.div
              key={step.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2">
                <span className="text-5xl md:text-7xl font-extralight text-gray-100 block mb-2" style={{ fontFamily: "var(--font-display), serif" }}>
                  {step.num}
                </span>
                <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-4" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                  {title}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-6">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-medium uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
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
