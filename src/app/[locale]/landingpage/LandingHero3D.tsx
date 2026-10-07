"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getLandingContent } from "./landingI18n";

function renderWithBreaks(text?: string) {
  if (!text) return null;
  const parts = String(text).split(/<\\?br\s*\/?>|<\/?[bB][rR]\s*\/?>|<\\[bB][rR]\s*\/?>|\n/gi);
  return (
    <>
      {parts.map((part, index) => {
        // Highlight Japanese quotes like 「これお願い」 with amber color and underline as in image 1
        const match = part.match(/(.*?)(「.*?」)(.*)/);
        let content: React.ReactNode = part;
        if (match) {
          content = (
            <>
              {match[1]}
              <span className="text-amber-400 border-b border-amber-400/80 pb-0.5 inline-block">{match[2]}</span>
              {match[3]}
            </>
          );
        }
        return (
          <React.Fragment key={index}>
            {index > 0 && <br />}
            {content}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default function LandingHero3D({
  locale = "ja",
  heroContent,
  style,
}: {
  locale?: string;
  heroContent?: any;
  style?: React.CSSProperties;
}) {
  const defaultHero = getLandingContent(locale).hero;
  const t = heroContent || defaultHero;
  const contactHref = `/${locale}/contact`;

  // Fallback high-end architectural photo
  const heroImage =
    t?.backgroundImage ||
    t?.bgImage ||
    t?.image ||
    t?.heroImage ||
    (t?.model3d?.customModelUrl &&
    !t.model3d.customModelUrl.endsWith(".glb") &&
    !t.model3d.customModelUrl.endsWith(".gltf")
      ? t.model3d.customModelUrl
      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85");

  // Phone number config (chỉ để xem, không click, không để chữ nào khác)
  const phoneNumber = t?.ctaPhoneNumber || "03-5315-4001";

  // Brand Name & Sub
  const brandName = t?.brandName || "KAPUTELI";
  const brandSub = t?.brandSub || "実務直結型パースコンサルティング";

  // Headline
  const defaultHeadline = `設計の思想も、\n販売のロジックも、\n建築の構造も。\n\nすべて知っているから、\nあなたの指示は「これお願い」\nだけでいい。`;
  const headlineText =
    t?.headline && t?.headline !== "理想の住まいを、 確かな空間へと 具現化する。"
      ? t.headline
      : defaultHeadline;

  // Description with vertical bar
  const defaultDesc = "担当者の成果を作る「販売の武器」を提供する。";
  const defaultDescSub = "株式会社カプテリ | 実務直結型パースコンサルティング";
  const descText = t?.desc && !t.desc.startsWith("技術基準に準拠した") ? t.desc : defaultDesc;
  const descSubText = t?.descSub || defaultDescSub;

  // Contact CTA button (Nút Vàng - chuyển đến form/contact)
  const contactButtonText = t?.ctaContact || t?.ctaFormTitle || "Contact →";

  return (
    <section
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#07080a] overflow-hidden flex items-center select-none py-16 sm:py-20 lg:py-24"
      style={style}
    >
      {/* =========================================================================
          BACKGROUND IMAGE: CHỈ 1 LỚP VỚI GRADIENT TỐI BÊN TRÁI ĐỂ CHỮ NỔI BẬT
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt="Hero Architecture Background"
            className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.02]"
            loading="eager"
          />
        )}

        {/* Gradient phong cách ảnh 3: Phủ mờ mềm bên trái, bên phải giữ sáng kiến trúc */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(10, 16, 26, 0.88) 0%, rgba(10, 16, 26, 0.72) 45%, rgba(10, 16, 26, 0.35) 75%, rgba(10, 16, 26, 0.15) 100%), linear-gradient(to bottom, rgba(10, 16, 26, 0.4) 0%, transparent 40%, rgba(10, 16, 26, 0.5) 100%)",
          }}
        />
      </motion.div>

      {/* =========================================================================
          FOREGROUND CONTENT: CĂN TRÁI, ĐÃ BỎ CARD PHẢI, KHOẢNG CÁCH BRAND LÊN CAO
          ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl xl:max-w-5xl space-y-6 sm:space-y-7 text-left">
          
          {/* 1. Brand Name & Subtagline: DỊCH LÊN CAO, TẠO KHOẢNG CÁCH RÕ RÀNG TRƯỚC TIÊU ĐỀ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-2 mb-8 sm:mb-12 md:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-[0.25em] uppercase font-mono drop-shadow-md">
              {brandName}
            </h2>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-amber-400 tracking-widest">
              <span className="w-6 h-[2px] bg-amber-400"></span>
              <span>{brandSub}</span>
            </div>
          </motion.div>

          {/* 2. Tiêu đề chính (Headline căn trái, to rõ nét sang trọng) */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-bold text-white leading-[1.26] tracking-tight"
            style={{
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif, 'Plus Jakarta Sans', sans-serif",
              textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 8px 30px rgba(0,0,0,0.85)",
            }}
          >
            {renderWithBreaks(headlineText)}
          </motion.h1>

          {/* 3. Khối mô tả có vạch đứng bên trái */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-l-2 border-amber-400/90 pl-3.5 sm:pl-4 py-0.5 space-y-1 max-w-3xl"
          >
            <p className="text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed drop-shadow">
              {renderWithBreaks(descText)}
            </p>
            {descSubText && (
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed drop-shadow">
                {renderWithBreaks(descSubText)}
              </p>
            )}
          </motion.div>

          {/* 4. CẶP NÚT:
              - NÚT VÀNG LÀ CONTACT (CLICK ĐƯỢC -> CHUYỂN FORM)
              - CARD BÊN CẠNH: KÍCH THƯỚC BẰNG NÚT VÀNG, CHỈ HIỂN THỊ SỐ ĐIỆN THOẠI (KHÔNG CÓ CHỮ THỪA, CHỈ XEM) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-2xl"
          >
            {/* NÚT VÀNG: CONTACT (GỬI FORM / TƯ VẤN DỰ ÁN) */}
            <a
              href={contactHref}
              className="w-full sm:w-[240px] md:w-[260px] h-[54px] sm:h-[58px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-none shadow-[0_12px_35px_rgba(245,158,11,0.45)] hover:shadow-[0_14px_45px_rgba(245,158,11,0.65)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
            >
              <span>{contactButtonText}</span>
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* CARD BÊN CẠNH: CHỈ HIỂN THỊ SỐ ĐIỆN THOẠI (KÍCH THƯỚC BẰNG NÚT VÀNG, KHÔNG ĐỂ BẤT KỲ CHỮ NÀO) */}
            <div
              className="w-full sm:w-[240px] md:w-[260px] h-[54px] sm:h-[58px] bg-[#131b26]/95 border border-amber-400/80 rounded-none shadow-xl flex items-center justify-center shrink-0 cursor-default select-text"
              title="お電話でのお問い合わせ窓口（閲覧専用）"
            >
              <span className="font-mono font-bold text-base sm:text-lg text-amber-300 tracking-wider select-all">
                {phoneNumber}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
