"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export interface PainPointCard {
  title?: string;
  tag?: string;
  badge?: string;
  tagColor?: string;
  icon?: string;
  quote?: string;
  detail?: string;
  impact?: string;
  solLabel?: string;
  solText?: string;
}

export interface SolutionItem {
  id?: string;
  badge?: string;
  icon?: string;
  title: string;
  desc: string;
  metric?: string;
  engineTag?: string;
}

interface Props {
  locale?: string;
  title?: string;
  subtitle?: string;
  painPointsData?: any;
  solutionsData?: any;
  rawCards?: any[];
  style?: React.CSSProperties;
}

function renderWithBreaks(text?: string) {
  if (!text) return null;
  const parts = String(text).split(/<\\?br\s*\/?>|<\/?[bB][rR]\s*\/?>|<\\[bB][rR]\s*\/?>|\n/gi);
  if (parts.length <= 1) return text;
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {part}
        </React.Fragment>
      ))}
    </>
  );
}

// Fallback default pain points (Japanese)
const DEFAULT_PAIN_POINTS_JA: PainPointCard[] = [
  {
    tag: "認識の一致 / 意思疎通",
    quote: "修正を繰り返しても、設計意図が反映されず、空間として美しくない",
    detail: "施主様の豊かなイメージを職人や施工会社に的確に伝えられず、完成後に想像と大きくかけ離れてしまうトラブルを招きます。",
    impact: "仕上がり不満・手戻りコスト発生",
  },
  {
    tag: "公取規定 / 表現の制約",
    quote: "公取規定を意識しながら魅力的に見せる表現に悩む",
    detail: "法的基準や広告ガイドラインを満たしながら、物件本来の価値を最大化する魅力的なビジュアル表現のバランスが取れない。",
    impact: "訴求力低下・成約率悪化",
  },
  {
    tag: "コンペ納期 / 修正の長期化",
    quote: "コンペ数日前にパース制作が間に合わないと判断し、妥協する",
    detail: "修正フローの停滞や急な設計変更に対応しきれず、最も勝負をかけたいプレゼン機会で高品質な提案を諦めてしまう。",
    impact: "受注機会損失・スケジュール崩壊",
  },
  {
    tag: "資料不足 / 依頼のハードル",
    quote: "データが不足していて依頼を引き受けてもらえない",
    detail: "ラフスケッチや手書き図面、未確定なCAD図面しかない段階では、外部スタジオに敬遠され着手が遅れてしまう。",
    impact: "プロジェクト初期の停滞",
  },
  {
    tag: "指示伝達 / チェックバック工数",
    quote: "指示したものと異なるものが出てきて、チェックバックに手間がかかる",
    detail: "建築の専門知識を持たないCGクリエイターとの間で専門用語や図面記号が通じず、何度も修正のやり取りが発生する。",
    impact: "担当者の工数逼迫・ストレス",
  },
  {
    tag: "売上・成約 / 成果物の実効性",
    quote: "納品されたパースで、本当に「売れる」か不安",
    detail: "単に綺麗なだけのCGパースではターゲット層に響かず、集客や販売の決め手となる営業の武器として機能しない。",
    impact: "投資対効果の低下",
  },
];

// Fallback default solutions (Japanese)
const DEFAULT_SOLUTIONS_JA: SolutionItem[] = [
  {
    badge: "SOLUTION 01",
    title: "8K超高精細フォトリアル3DCG & 光彩シミュレーション",
    desc: "人間目線パースと太陽軌道・IES配光データを極限まで高め、図面が読めない施主様とも100%完全な合意形成を実現。",
    metric: "精度 99.8%",
  },
  {
    badge: "SOLUTION 02",
    title: "デジタル数量自動集計 & VEコスト最適化",
    desc: "部材数量を自動拾い出し。予算超過リスクを早期検知し、品質を落とさないバリューエンジニアリング代替案を提示。",
    metric: "追加費用ゼロ化",
  },
  {
    badge: "SOLUTION 03",
    title: "リアルタイム3D合意形成プラットフォーム",
    desc: "関係者全員がブラウザ上で同一3Dモデルを同時閲覧。その場で指示と承認を完了し、図面修正期間を70%短縮。",
    metric: "リードタイム70%削減",
  },
  {
    badge: "SOLUTION 04",
    title: "実在建材光学シミュレーション & 質感再現",
    desc: "主要メーカーの実物スキャンデータと正確なマテリアル特性を採用。空間の質感ズレと色温度ミスマッチを完全根絶。",
    metric: "建材実データ連動",
  },
  {
    badge: "SOLUTION 05",
    title: "BIM / 施工連携・干渉チェック",
    desc: "意匠・構造・設備（MEP）データを重ね合わせ、施工前の干渉や納まり破綻をデジタルツイン上で100%検知・修正。",
    metric: "干渉エラー0件",
  },
  {
    badge: "SOLUTION 06",
    title: "VR / 360°空間ウォークスルー検証",
    desc: "ブラウザまたはVR空間で、図面上の空間を等身大で歩行体験。天井高や動線の抜け感を着工前に体感検証。",
    metric: "没入空間検証",
  },
];

export default function LandingChallengesSolutions({
  locale = "ja",
  title,
  painPointsData,
  solutionsData,
  rawCards,
  style,
}: Props) {
  const isVi = locale === "vi";

  // 1. Resolve Header Title (Phong cách Ảnh 4)
  const defaultTitle = isVi
    ? "「Không Thể Truyền Đạt Đúng Ý」\nNỗi Lo Ấy, Hãy Chấm Dứt Tại Đây."
    : "「また伝わらなかった」\nその悩みに、終止符を。";

  const mainTitle = title || painPointsData?.title || defaultTitle;

  const painSubtitle =
    painPointsData?.painEyebrow ||
    painPointsData?.subtitle ||
    (isVi
      ? "Nếu bạn từng gặp phải dù chỉ một trong những vấn đề dưới đây, chúng tôi hoàn toàn có thể giúp bạn."
      : "以下に一つでも心当たりがあるなら、私たちが力になれます。");

  // 2. Resolve Pain Points List
  const rawList: PainPointCard[] =
    Array.isArray(painPointsData?.cards) && painPointsData.cards.length > 0
      ? painPointsData.cards
      : Array.isArray(rawCards) && rawCards.length > 0
      ? rawCards
      : DEFAULT_PAIN_POINTS_JA;

  const cardsList: PainPointCard[] = rawList.length > 0 ? rawList : DEFAULT_PAIN_POINTS_JA;

  // 3. Resolve Solutions List
  const solTitle =
    painPointsData?.solTitle ||
    solutionsData?.title ||
    (isVi
      ? "Hệ Thống Giải Pháp Kiến Trúc Thế Hệ Mới Ngăn Ngừa Mọi Rủi Ro Thiết Kế & Thi Công"
      : "あらゆる設計・施工リスクを未然に防ぐ、次世代アーキテクチャソリューション群");

  const solSubtitle =
    solutionsData?.subtitle ||
    (isVi
      ? "Phương pháp tiếp cận toàn diện với 8K CGI, bóc tách khối lượng tự động & phối hợp BIM kỹ thuật số."
      : "8Kフォトリアル3D・デジタル数量集計・BIM連携による完全解決アプローチ。");

  const rawSolutions: SolutionItem[] =
    Array.isArray(painPointsData?.solutionItems) && painPointsData.solutionItems.length > 0
      ? painPointsData.solutionItems
      : Array.isArray(solutionsData?.items) && solutionsData.items.length > 0
      ? solutionsData.items.map((item: any, idx: number) => ({
          badge: item.badge || `SOLUTION 0${idx + 1}`,
          title: item.title,
          desc: item.desc || item.subtitle || "",
          metric: item.metric || "",
        }))
      : DEFAULT_SOLUTIONS_JA;

  const solutionsList: SolutionItem[] = rawSolutions.length > 0 ? rawSolutions : DEFAULT_SOLUTIONS_JA;

  // Cho phép màu nền Section 2 thay đổi linh hoạt theo Admin, mặc định là #101b2a
  const customBackground = style?.background || style?.backgroundColor || "#101b2a";
  const sectionBgStyle: React.CSSProperties = {
    background: customBackground,
    backgroundColor: style?.backgroundColor || (typeof customBackground === "string" && !customBackground.includes("gradient") ? customBackground : undefined),
    ...style,
  };

  const bgStr = String(customBackground).toLowerCase();
  const isLightBg =
    bgStr.includes("#f") ||
    bgStr.includes("#e") ||
    bgStr.includes("#d") ||
    bgStr.includes("white") ||
    bgStr.includes("rgb(255") ||
    bgStr.includes("240") ||
    bgStr.includes("245") ||
    bgStr.includes("250");

  return (
    <section
      className={`challenges-solutions-list-section relative py-16 sm:py-20 lg:py-24 ${isLightBg ? "text-slate-900" : "text-white"} border-b border-slate-800/20 overflow-hidden transition-colors duration-300`}
      id="noi-dau-giai-phap"
      style={sectionBgStyle}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-20">
        
        {/* =========================================================================
            PHẦN 1: CHECKLIST NỖI ĐAU & THÁCH THỨC (GIAO DIỆN DẠNG LIST CHUẨN ẢNH 4)
            - Tiêu đề lớn phong cách Ảnh 4 với dấu ngoặc 「」
            - Khung viền màu #fdfcf9 với ĐƯỜNG VIỀN VÀNG DỌC BÊN TRÁI (border-l-4 border-amber-500)
            - Từng dòng checklist có icon checkbox vàng [✓] và phân cách gạch ngang
            - Dòng kết luận vàng ở đáy: 「それは、作る側が現場を知らないから起きている。」
            ========================================================================= */}
        <div>
          {/* Header Nỗi đau */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-10 text-left"
          >
            <h2
              className={`w-full max-w-full text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black tracking-tight leading-[1.28] ${isLightBg ? "text-slate-900 drop-shadow-sm" : "text-white drop-shadow-md"}`}
              style={{ fontFamily: "var(--font-heading), 'Plus Jakarta Sans', sans-serif" }}
            >
              {renderWithBreaks(mainTitle)}
            </h2>

            {painSubtitle && (
              <p className={`mt-4 text-sm sm:text-base font-medium leading-relaxed ${isLightBg ? "text-slate-600" : "text-slate-300"}`}>
                {renderWithBreaks(painSubtitle)}
              </p>
            )}
          </motion.div>

          {/* Khung Danh Sách Nỗi Đau (Ảnh 2: nền #fdfcf9, viền vàng dọc bên trái border-l-4 border-amber-500) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#fdfcf9] border border-slate-300/80 border-l-4 border-l-amber-500 rounded-none shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8 lg:p-10"
          >
            <div className="divide-y divide-slate-200">
              {cardsList.map((card, idx) => {
                const quoteText = card.quote || card.title || card.tag || "";
                const cleanQuote = quoteText.replace(/^[「『]\s*/, "").replace(/\s*[」』]$/, "");

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 sm:gap-5 py-4 sm:py-5 first:pt-0 last:pb-4 group hover:bg-amber-50/40 transition-colors"
                  >
                    {/* Checkbox màu vàng hổ phách nổi bật chuẩn Ảnh 4 */}
                    <div className="w-5 h-5 bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 rounded-none font-black text-xs shadow-sm">
                      <Check size={13} strokeWidth={3.5} />
                    </div>

                    {/* Nội dung nỗi đau lớn (tăng width, hiển thị rõ ràng, bỏ detail và impact) */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-relaxed group-hover:text-amber-700 transition-colors">
                        {renderWithBreaks(cleanQuote)}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dòng kết luận / Slogan màu vàng ở đáy khung (Chuẩn Ảnh 4) */}
            <div className="pt-6 mt-3 border-t border-slate-200 flex items-center gap-2.5 text-amber-700 font-bold text-sm sm:text-base tracking-wide">
              <span className="text-xs font-mono">✦</span>
              <span>
                {renderWithBreaks(
                  painPointsData?.conclusion ||
                  (isVi
                    ? "Tất cả bắt nguồn từ việc: Đơn vị diễn họa không thực sự am hiểu thi công hiện trường."
                    : "それは、作る側が現場を知らないから起きている。")
                )}
              </span>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            PHẦN 2: DANH SÁCH GIẢI PHÁP ĐỘT PHÁ KONTUR
            - Bỏ "✦ KONTUR ARCHITECTURAL SOLUTIONS"
            - Tiêu đề full width hỗ trợ </br> xuống hàng
            - Bỏ phần mô tả chi tiết ở các solution và bỏ metric bên phải
            ========================================================================= */}
        <div>
          {/* Header Giải pháp */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-8 sm:mb-10 text-left border-t ${isLightBg ? "border-slate-300" : "border-slate-800/80"} pt-12 sm:pt-14`}
          >
            <h3
              className={`w-full max-w-full text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black tracking-tight leading-[1.28] ${isLightBg ? "text-slate-900 drop-shadow-sm" : "text-white drop-shadow-md"}`}
              style={{ fontFamily: "var(--font-heading), 'Plus Jakarta Sans', sans-serif" }}
            >
              {renderWithBreaks(solTitle)}
            </h3>

            {solSubtitle && (
              <p className={`mt-3 text-sm sm:text-base font-medium leading-relaxed ${isLightBg ? "text-slate-600" : "text-slate-300"}`}>
                {renderWithBreaks(solSubtitle)}
              </p>
            )}
          </motion.div>

          {/* Khung Danh Sách Giải Pháp (Chuẩn Ảnh 4: nền #fdfcf9, viền vàng dọc bên trái, bỏ mô tả & metrics) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#fdfcf9] border border-slate-300/80 border-l-4 border-l-amber-500 rounded-none shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8 lg:p-10"
          >
            <div className="divide-y divide-slate-200">
              {solutionsList.map((sol, idx) => {
                const badgeText = sol.badge || (idx + 1 < 10 ? `SOLUTION 0${idx + 1}` : `SOLUTION ${idx + 1}`);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center py-4 sm:py-5 first:pt-0 last:pb-0 group hover:bg-amber-50/40 transition-colors px-1"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-relaxed group-hover:text-amber-700 transition-colors">
                        {renderWithBreaks(sol.title)}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
