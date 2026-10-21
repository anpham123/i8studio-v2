"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface PainPointCard {
  title?: string;
  tag?: string;
  badge?: string;
  tagColor?: string;
  icon?: string;
  quote?: string;
  detail?: string;
  impact?: string;
  desc?: string;
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
  },
  {
    tag: "公取規定 / 表現の制約",
    quote: "公取規定を意識しながら魅力的に見せる表現に悩む",
  },
  {
    tag: "コンペ納期 / 修正の長期化",
    quote: "コンペ数日前にパース制作が間に合わないと判断し、妥協する",
  },
  {
    tag: "資料不足 / 依頼のハードル",
    quote: "データが不足していて依頼を引き受けてもらえない",
  },
  {
    tag: "指示伝達 / チェックバック工数",
    quote: "指示したものと異なるものが出てきて、チェックバックに手間がかかる",
  },
  {
    tag: "売上・成約 / 成果物の実効性",
    quote: "納品されたパースで、本当に「売れる」か不安",
  },
];

// Fallback default solutions (Japanese & Vietnamese)
const DEFAULT_SOLUTIONS_JA: PainPointCard[] = [
  {
    quote: "一級建築士監修による8K高精細フォトリアル3DCGで、設計意図をミリ単位で正確に具現化",
  },
  {
    quote: "図面受領から最短3日での超速初稿提出＆迅速な修正対応で、工期の遅延を未然に完全防止",
  },
  {
    quote: "実在建材・照明光学シミュレーションにより、竣工後の質感や色温度の不調和をゼロへ",
  },
  {
    quote: "未確定なラフスケッチや手書き図面の段階からでも、建築実務経験者が意図を正確に汲み取って具現化",
  },
  {
    quote: "ターゲット層に深く響き、施主様へのプレゼン成約率を最大化するハイクオリティ空間ビジュアライゼーション",
  },
];

const DEFAULT_SOLUTIONS_VI: PainPointCard[] = [
  {
    quote: "Diễn họa 3DCG 8K chuẩn xác đến từng mm dưới sự giám sát của KTS chuyên môn, hiện thực hóa 100% ý tưởng",
  },
  {
    quote: "Bàn giao bản thảo nhanh chóng và phản hồi sửa đổi thần tốc, tuyệt đối không làm trễ tiến độ thi công",
  },
  {
    quote: "Mô phỏng quang học vật liệu & ánh sáng thực tế, triệt tiêu hoàn toàn rủi ro sai lệch sau khi hoàn thiện",
  },
  {
    quote: "Tiếp nhận linh hoạt từ phác thảo tay hoặc ý tưởng sơ đồ, chuyển hóa thành không gian kiến trúc sống động",
  },
  {
    quote: "Hình ảnh trực quan và VR tương tác đỉnh cao, gia tăng uy tín và tối đa hóa tỷ lệ chốt hợp đồng với khách hàng",
  },
];

export default function LandingChallengesSolutions({
  locale = "ja",
  title,
  painPointsData,
  rawCards,
  style,
}: Props) {
  const isVi = locale === "vi";

  // 1. Resolve Header Title Nỗi đau
  const defaultTitle = isVi
    ? "「Không Thể Truyền Đạt Đúng Ý」\nNỗi Lo Ấy, Hãy Chấm Dứt Tại Đây."
    : "「また伝わらなかった」\nその悩みに、終止符を。";

  const mainTitle = title || painPointsData?.title || defaultTitle;

  // 2. Resolve Pain Points List
  const rawList: PainPointCard[] =
    Array.isArray(painPointsData?.cards) && painPointsData.cards.length > 0
      ? painPointsData.cards
      : Array.isArray(rawCards) && rawCards.length > 0
      ? rawCards
      : DEFAULT_PAIN_POINTS_JA;

  const cardsList: PainPointCard[] = rawList.length > 0 ? rawList : DEFAULT_PAIN_POINTS_JA;

  // 3. Resolve Header Title Giải pháp
  const defaultSolTitle = isVi
    ? "Giải Pháp Diễn Họa Kiến Trúc Đột Phá — Hiện Thực Hóa 100% Ý Tưởng Thiết Kế"
    : "「思い描いた空間」を100%現実にする、\ni8 studioの建築ビジュアライゼーションソリューション";

  const solTitle = painPointsData?.solTitle || defaultSolTitle;

  // 4. Resolve Solutions List (Hỗ trợ cả solutionCards và solutionItems)
  const defaultSolList = isVi ? DEFAULT_SOLUTIONS_VI : DEFAULT_SOLUTIONS_JA;
  const rawSolutions: PainPointCard[] =
    Array.isArray(painPointsData?.solutionCards) && painPointsData.solutionCards.length > 0
      ? painPointsData.solutionCards
      : Array.isArray(painPointsData?.solutionItems) && painPointsData.solutionItems.length > 0
      ? painPointsData.solutionItems
      : defaultSolList;

  const solutionsList: PainPointCard[] = rawSolutions.length > 0 ? rawSolutions : defaultSolList;

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
            1. CHECKLIST NỖI ĐAU & THÁCH THỨC
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
          </motion.div>

          {/* Khung Danh Sách Nỗi Đau (nền #fdfcf9, viền vàng dọc bên trái border-l-4 border-amber-500) */}
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
                    className="flex items-start gap-4 sm:gap-5 py-4 sm:py-5 first:pt-0 last:pb-0 group hover:bg-amber-50/40 transition-colors"
                  >
                    {/* Checkbox màu vàng hổ phách nổi bật */}
                    <div className="w-5 h-5 bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 rounded-none font-black text-xs shadow-sm">
                      <Check size={13} strokeWidth={3.5} />
                    </div>

                    {/* Nội dung nỗi đau lớn */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-relaxed group-hover:text-amber-700 transition-colors">
                        {renderWithBreaks(cleanQuote)}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            2. CHECKLIST GIẢI PHÁP (THIẾT KẾ ĐỒNG BỘ 100% VỚI PHẦN NỖI ĐAU)
            ========================================================================= */}
        <div>
          {/* Header Giải pháp */}
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
              {renderWithBreaks(solTitle)}
            </h2>
          </motion.div>

          {/* Khung Danh Sách Giải Pháp (nền #fdfcf9, viền vàng dọc bên trái border-l-4 border-amber-500) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#fdfcf9] border border-slate-300/80 border-l-4 border-l-amber-500 rounded-none shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8 lg:p-10"
          >
            <div className="divide-y divide-slate-200">
              {solutionsList.map((sol, idx) => {
                const quoteText = sol.quote || sol.title || sol.desc || "";
                const cleanQuote = quoteText.replace(/^[「『]\s*/, "").replace(/\s*[」』]$/, "");

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 sm:gap-5 py-4 sm:py-5 first:pt-0 last:pb-0 group hover:bg-amber-50/40 transition-colors"
                  >
                    {/* Checkbox màu vàng hổ phách nổi bật chuẩn như phần nỗi đau */}
                    <div className="w-5 h-5 bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 rounded-none font-black text-xs shadow-sm">
                      <Check size={13} strokeWidth={3.5} />
                    </div>

                    {/* Nội dung giải pháp lớn */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-relaxed group-hover:text-amber-700 transition-colors">
                        {renderWithBreaks(cleanQuote)}
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
