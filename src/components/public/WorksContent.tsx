"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Lightbox from "@/components/public/Lightbox";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type WorkType = "still" | "animation" | "composite" | "vr360" | "walkthrough" | "ar" | "digital";
type WorkCategory = "residential" | "apartment" | "resort" | "commercial" | "office" | "public" | "urban";

interface DBWork {
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;
  category: string;
  type?: string;
  buildingCategory?: string;
  image: string;
  videoUrl: string;
  vrUrl?: string;
  order: number;
  featured: boolean;
}

interface Work {
  id: string;
  title: string;
  type: WorkType;
  category: WorkCategory;
  bg: string;
  span: "wide" | "narrow";
  image?: string;
  videoUrl?: string;
  vrUrl?: string;
  clientName?: string;
}

/* ------------------------------------------------------------------ */
/*  Placeholder data (fallback if DB is empty)                        */
/* ------------------------------------------------------------------ */
const WORKS: Work[] = [
  { id: "1",  title: "Riverside Residence",   type: "still",      category: "residential",  bg: "#c8c2b8", span: "wide" },
  { id: "2",  title: "Forest Villa Aerial",   type: "still",      category: "resort",       bg: "#b0aca2", span: "wide" },
  { id: "3",  title: "Urban Tower",           type: "animation",  category: "commercial",   bg: "#a8a498", span: "narrow" },
  { id: "4",  title: "Autumn Apartment",      type: "still",      category: "apartment",    bg: "#c4bfa6", span: "narrow" },
  { id: "5",  title: "Luxury Pool Interior",  type: "composite",  category: "resort",       bg: "#bab4aa", span: "wide" },
  { id: "6",  title: "City Office Complex",   type: "vr360",      category: "office",       bg: "#9e9a92", span: "narrow" },
  { id: "7",  title: "Public Library",        type: "walkthrough", category: "public",      bg: "#c0bcb2", span: "narrow" },
  { id: "8",  title: "Seaside Resort",        type: "still",      category: "resort",       bg: "#d4cec4", span: "wide" },
  { id: "9",  title: "Shopping Mall",         type: "animation",  category: "commercial",   bg: "#b8b2a8", span: "narrow" },
  { id: "10", title: "Smart City Plan",       type: "digital",    category: "urban",        bg: "#a4a098", span: "narrow" },
  { id: "11", title: "Mountain Villa",        type: "composite",  category: "residential",  bg: "#ccc6bc", span: "wide" },
  { id: "12", title: "AR Showroom",           type: "ar",         category: "commercial",   bg: "#b4aea4", span: "narrow" },
];

const TYPE_KEYS: WorkType[] = ["still", "animation", "composite", "vr360", "walkthrough", "ar", "digital"];
const CAT_KEYS: WorkCategory[] = ["residential", "apartment", "resort", "commercial", "office", "public", "urban"];

interface WorksContentProps {
  initialWorks?: DBWork[];
  settings?: Record<string, string>;
}

export default function WorksContent({ initialWorks, settings = {} }: WorksContentProps) {
  const t = useTranslations("work");
  const locale = useLocale();

  const [activeType, setActiveType] = useState<WorkType | "all">("all");
  const [activeCat, setActiveCat] = useState<WorkCategory | "all">("all");

  const [lightbox, setLightbox] = useState<{ src: string; alt: string; isVideo?: boolean; type?: string } | null>(null);
  const [vrModal, setVrModal] = useState<{ url: string; title: string } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Social Links
  const socialLinks = {
    facebook: settings.socialFacebook || "https://facebook.com/i8studio",
    instagram: settings.socialInstagram || "https://instagram.com/i8studio",
    linkedin: settings.socialLinkedin || "https://linkedin.com/company/i8studio",
    youtube: settings.socialYoutube || "https://youtube.com/@i8studio",
  };

  const showAllLabel = locale === "ja" ? "すべて表示" : locale === "vi" ? "Tất cả" : "Show all";
  const ctaTitle = locale === "ja" ? "プロジェクトのご相談はこちら" : locale === "vi" ? "Trao đổi với chúng tôi về dự án tiếp theo của bạn." : "Talk to us about your next projects.";
  const ctaBtn = locale === "ja" ? "お見積り・ご提案" : locale === "vi" ? "Yêu cầu báo giá" : "Request a Proposal";

  // Dynamic mapper for database works
  const mappedWorks = useMemo(() => {
    if (!initialWorks || initialWorks.length === 0) {
      return WORKS;
    }

    const placeholderColors = [
      "#c8c2b8", "#b0aca2", "#a8a498", "#c4bfa6", "#bab4aa",
      "#9e9a92", "#c0bcb2", "#d4cec4", "#b8b2a8", "#a4a098",
      "#ccc6bc", "#b4aea4"
    ];

    return initialWorks.map((w, index) => {
      const title = locale === "ja" ? w.titleJa || w.title : w.title;
      const subtitle = w.subtitle ? w.subtitle.toLowerCase() : "";
      const titleLower = w.title ? w.title.toLowerCase() : "";

      // Map DB category (3DCG, Animation, VR, BIM) to Type
      let type: WorkType = (w.type?.toLowerCase() as WorkType) || "still";
      if (!w.type || (type === "still" && w.category && w.category.toUpperCase() !== "3DCG")) {
        const dbCat = w.category ? w.category.toUpperCase() : "3DCG";
        if (dbCat === "ANIMATION") {
          type = "animation";
        } else if (dbCat === "VR") {
          if (subtitle.includes("walkthrough") || titleLower.includes("walkthrough")) {
            type = "walkthrough";
          } else if (subtitle.includes("ar") || titleLower.includes("ar")) {
            type = "ar";
          } else {
            type = "vr360";
          }
        } else if (dbCat === "BIM") {
          type = "digital";
        } else { // 3DCG
          if (subtitle.includes("composite") || titleLower.includes("composite")) {
            type = "composite";
          } else if (subtitle.includes("model") || titleLower.includes("model")) {
            type = "digital";
          } else {
            type = "still";
          }
        }
      }

      if (type as string === "vr") {
        type = "vr360";
      }

      // Map Subtitle/Title to Architectural Category
      let category: WorkCategory = (w.buildingCategory as WorkCategory) || "residential";
      if (!w.buildingCategory) {
        if (subtitle.includes("residence") || subtitle.includes("house") || subtitle.includes("villa") || subtitle.includes("home") ||
            titleLower.includes("residence") || titleLower.includes("house") || titleLower.includes("villa") || titleLower.includes("home")) {
          category = "residential";
        } else if (subtitle.includes("apartment") || subtitle.includes("condo") || subtitle.includes("mansion") ||
                   titleLower.includes("apartment") || titleLower.includes("condo") || titleLower.includes("mansion")) {
          category = "apartment";
        } else if (subtitle.includes("resort") || subtitle.includes("hotel") || subtitle.includes("pool") || subtitle.includes("sauna") ||
                   titleLower.includes("resort") || titleLower.includes("hotel") || titleLower.includes("pool") || titleLower.includes("sauna")) {
          category = "resort";
        } else if (subtitle.includes("commercial") || subtitle.includes("mall") || subtitle.includes("showroom") || subtitle.includes("shop") || subtitle.includes("store") ||
                   titleLower.includes("commercial") || titleLower.includes("mall") || titleLower.includes("showroom") || titleLower.includes("shop") || titleLower.includes("store")) {
          category = "commercial";
        } else if (subtitle.includes("office") || subtitle.includes("workspace") || subtitle.includes("tower") ||
                   titleLower.includes("office") || titleLower.includes("workspace") || titleLower.includes("tower")) {
          category = "office";
        } else if (subtitle.includes("library") || subtitle.includes("public") || subtitle.includes("museum") || subtitle.includes("temple") || subtitle.includes("facility") ||
                   titleLower.includes("library") || titleLower.includes("public") || titleLower.includes("museum") || titleLower.includes("temple") || titleLower.includes("facility")) {
          category = "public";
        } else if (subtitle.includes("urban") || subtitle.includes("city") || subtitle.includes("landscape") || subtitle.includes("street") || subtitle.includes("plan") ||
                   titleLower.includes("urban") || titleLower.includes("city") || titleLower.includes("landscape") || titleLower.includes("street") || titleLower.includes("plan")) {
          category = "urban";
        } else {
          const categories: WorkCategory[] = ["residential", "resort", "commercial", "public"];
          category = categories[index % categories.length];
        }
      }

      // Span layout
      const span = (category === "residential" || category === "resort" || category === "public") ? "wide" : "narrow";

      return {
        id: w.id,
        title,
        type,
        category,
        image: w.image,
        videoUrl: w.videoUrl,
        vrUrl: w.vrUrl,
        bg: placeholderColors[index % placeholderColors.length],
        span: span as "wide" | "narrow",
        clientName: w.subtitle
      };
    });
  }, [initialWorks, locale]);

  const filtered = useMemo(() => {
    return mappedWorks.filter((w) => {
      const typeOk = activeType === "all" || w.type === activeType;
      const catOk = activeCat === "all" || w.category === activeCat;
      return typeOk && catOk;
    });
  }, [mappedWorks, activeType, activeCat]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex max-w-[1920px] mx-auto px-6 md:px-[60px] pt-24 md:pt-[120px] pb-24 gap-12">
        
        {/* ========== DESKTOP SIDEBAR ========== */}
        <aside className="w-[240px] shrink-0 hidden md:flex flex-col justify-between sticky top-[100px] h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin">
          <div>
            {/* Page title */}
            <h1 className="text-[32px] font-normal text-[#111] tracking-[0.03em] font-serif mb-6">{t("title")}</h1>

            {/* Filter heading */}
            <div className="text-[14px] font-semibold text-[#111] tracking-[0.08em] uppercase mb-1">{t("filter")}</div>
            <div className="border-b-[0.5px] border-[#e5e5e5] mb-5" />

            {/* TYPE group */}
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999] mb-3">
              {t("typeLabel")}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveType("all")}
                className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                  activeType === "all"
                    ? "text-[#111] font-medium border-[#111]"
                    : "text-[#555] hover:text-[#111] border-transparent"
                }`}
              >
                {showAllLabel}
              </button>
              {TYPE_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveType(key)}
                  className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                    activeType === key
                      ? "text-[#111] font-medium border-[#111]"
                      : "text-[#555] hover:text-[#111] border-transparent"
                  }`}
                >
                  {t(`types.${key}`)}
                </button>
              ))}
            </div>

            <div className="border-b-[0.5px] border-[#e5e5e5] my-5" />

            {/* CATEGORY group */}
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999] mb-3">
              {t("categoryLabel")}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveCat("all")}
                className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                  activeCat === "all"
                    ? "text-[#111] font-medium border-[#111]"
                    : "text-[#555] hover:text-[#111] border-transparent"
                }`}
              >
                {showAllLabel}
              </button>
              {CAT_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                    activeCat === key
                      ? "text-[#111] font-medium border-[#111]"
                      : "text-[#555] hover:text-[#111] border-transparent"
                  }`}
                >
                  {t(`categories.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* CTA & Social Links */}
          <div className="pt-6 border-t border-[#e5e5e5] mt-6">
            <p className="text-[14px] font-semibold text-[#111] tracking-wide mb-2.5 leading-snug">
              {ctaTitle}
            </p>
            <a
              href="/contact"
              className="text-[12px] font-semibold tracking-wider uppercase text-black hover:text-neutral-600 transition-colors border-b border-black pb-0.5 inline-block"
            >
              {ctaBtn}
            </a>

            {/* Socials */}
            <div className="flex gap-4 mt-6 text-[#999]">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" />
                </svg>
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                </svg>
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
                </svg>
              </a>
            </div>
          </div>
        </aside>

        {/* ========== MASONRY GRID ========== */}
        <main className="flex-1 min-w-0">
          {/* Mobile: page title & filter trigger */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <h1 className="text-[32px] font-normal text-[#111] tracking-[0.03em] font-serif">{t("title")}</h1>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="border border-[#111] text-[#111] text-[12px] uppercase tracking-[0.1em] font-semibold px-5 py-2 hover:bg-[#111] hover:text-white transition-colors duration-300"
            >
              {t("filter")}
            </button>
          </div>

          {filtered.length === 0 ? (
            <p className="text-[14px] text-[#999] mt-8">{t("emptyState")}</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
              {filtered.map((work) => (
                <div
                  key={work.id}
                  onClick={() => {
                    if (work.vrUrl) {
                      setVrModal({ url: work.vrUrl, title: work.title });
                    } else if (work.videoUrl) {
                      setLightbox({ src: work.videoUrl, alt: work.title, isVideo: true, type: work.type });
                    } else if (work.image) {
                      setLightbox({ src: work.image, alt: work.title, type: work.type });
                    }
                  }}
                  className="break-inside-avoid w-full group cursor-pointer inline-block"
                >
                  <div className="relative overflow-hidden w-full bg-gray-50 rounded-[3px] transition-transform duration-500 ease-out">
                    {work.image ? (
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-auto object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        style={{
                          backgroundColor: work.bg,
                          aspectRatio: work.span === "wide" ? "16/10" : "3/4"
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-3.5 mb-2">
                    <h3 className="text-[15px] font-normal text-[#111] tracking-[0.03em] leading-tight mb-1">
                      <span className="bg-left-bottom bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 pb-0.5">
                        {work.title}
                      </span>
                    </h3>
                    <p className="text-[12px] text-[#777] font-light tracking-[0.05em] uppercase">
                      {work.clientName || t(`types.${work.type}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ========== MOBILE DRAWER FILTER ========== */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-[1000] w-[85vw] max-w-[340px] bg-white p-8 flex flex-col justify-between overflow-y-auto md:hidden shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[24px] font-normal text-[#111] tracking-[0.03em] font-serif">{t("title")}</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-black">
                    <X size={20} />
                  </button>
                </div>

                {/* TYPE group */}
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999] mb-3">
                  {t("typeLabel")}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveType("all");
                      setIsFilterOpen(false);
                    }}
                    className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                      activeType === "all"
                        ? "text-[#111] font-medium border-[#111]"
                        : "text-[#555] hover:text-[#111] border-transparent"
                    }`}
                  >
                    {showAllLabel}
                  </button>
                  {TYPE_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveType(key);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                        activeType === key
                          ? "text-[#111] font-medium border-[#111]"
                          : "text-[#555] hover:text-[#111] border-transparent"
                      }`}
                    >
                      {t(`types.${key}`)}
                    </button>
                  ))}
                </div>

                <div className="border-b-[0.5px] border-[#e5e5e5] my-5" />

                {/* CATEGORY group */}
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999] mb-3">
                  {t("categoryLabel")}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveCat("all");
                      setIsFilterOpen(false);
                    }}
                    className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                      activeCat === "all"
                        ? "text-[#111] font-medium border-[#111]"
                        : "text-[#555] hover:text-[#111] border-transparent"
                    }`}
                  >
                    {showAllLabel}
                  </button>
                  {CAT_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveCat(key);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${
                        activeCat === key
                          ? "text-[#111] font-medium border-[#111]"
                          : "text-[#555] hover:text-[#111] border-transparent"
                      }`}
                    >
                      {t(`categories.${key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer CTA & Socials */}
              <div className="pt-6 border-t border-[#e5e5e5] mt-8">
                <p className="text-[14px] font-semibold text-[#111] tracking-wide mb-2.5 leading-snug">
                  {ctaTitle}
                </p>
                <a
                  href="/contact"
                  className="text-[12px] font-semibold tracking-wider uppercase text-black hover:text-neutral-600 transition-colors border-b border-black pb-0.5 inline-block"
                >
                  {ctaBtn}
                </a>

                {/* Socials */}
                <div className="flex gap-4 mt-6 text-[#999]">
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Instagram">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" />
                    </svg>
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                    </svg>
                  </a>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isVideo={lightbox.isVideo}
          type={lightbox.type}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* VR360 Fullscreen Modal */}
      {mounted && vrModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" onClick={() => setVrModal(null)}>
          <div className="relative w-[95vw] h-[90vh] max-w-[1600px]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVrModal(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm flex items-center gap-1.5 transition-colors z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Close
            </button>
            <div className="absolute -top-10 left-0 text-white/70 text-sm">{vrModal.title}</div>
            <iframe
              src={vrModal.url}
              className="w-full h-full rounded-lg border-0"
              allowFullScreen
              allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={vrModal.title}
            />
            <a
              href={vrModal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 bg-white/90 text-gray-800 text-xs px-3 py-1.5 rounded-lg hover:bg-white transition-colors shadow-md"
            >
              ↗ Open in new tab
            </a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
