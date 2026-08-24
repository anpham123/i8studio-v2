"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Lightbox from "@/components/public/Lightbox";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  { id: "1", title: "Riverside Residence", type: "still", category: "residential", bg: "#c8c2b8", span: "wide" },
  { id: "2", title: "Forest Villa Aerial", type: "still", category: "resort", bg: "#b0aca2", span: "wide" },
  { id: "3", title: "Urban Tower", type: "animation", category: "commercial", bg: "#a8a498", span: "narrow" },
  { id: "4", title: "Autumn Apartment", type: "still", category: "apartment", bg: "#c4bfa6", span: "narrow" },
  { id: "5", title: "Luxury Pool Interior", type: "composite", category: "resort", bg: "#bab4aa", span: "wide" },
  { id: "6", title: "City Office Complex", type: "vr360", category: "office", bg: "#9e9a92", span: "narrow" },
  { id: "7", title: "Public Library", type: "walkthrough", category: "public", bg: "#c0bcb2", span: "narrow" },
  { id: "8", title: "Seaside Resort", type: "still", category: "resort", bg: "#d4cec4", span: "wide" },
  { id: "9", title: "Shopping Mall", type: "animation", category: "commercial", bg: "#b8b2a8", span: "narrow" },
  { id: "10", title: "Smart City Plan", type: "digital", category: "urban", bg: "#a4a098", span: "narrow" },
  { id: "11", title: "Mountain Villa", type: "composite", category: "residential", bg: "#ccc6bc", span: "wide" },
  { id: "12", title: "AR Showroom", type: "ar", category: "commercial", bg: "#b4aea4", span: "narrow" },
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

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const isFirstRender = useRef(true);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFlippingRef = useRef(false);

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

      if ((type as string) === "vr") {
        type = "vr360";
      }

      // Map Subtitle/Title to Architectural Category
      let category: WorkCategory = (w.buildingCategory as WorkCategory) || "residential";
      if (!w.buildingCategory) {
        if (subtitle.includes("residence") || subtitle.includes("house") || subtitle.includes("villa") || subtitle.includes("home") ||
          titleLower.includes("residence") || titleLower.includes("house") || titleLower.includes("villa") || titleLower.includes("home")) {
          category = "residential";
        } else if (subtitle.includes("apartment") || subtitle.includes("condo") || subtitle.includes("complex") ||
          titleLower.includes("apartment") || titleLower.includes("condo") || titleLower.includes("complex")) {
          category = "apartment";
        } else if (subtitle.includes("resort") || subtitle.includes("hotel") || subtitle.includes("spa") || subtitle.includes("sauna") ||
          titleLower.includes("resort") || titleLower.includes("hotel") || titleLower.includes("spa") || titleLower.includes("sauna")) {
          category = "resort";
        } else if (subtitle.includes("commercial") || subtitle.includes("mall") || subtitle.includes("shop") || subtitle.includes("store") || subtitle.includes("retail") || subtitle.includes("dining") || subtitle.includes("restaurant") ||
          titleLower.includes("commercial") || titleLower.includes("mall") || titleLower.includes("shop") || titleLower.includes("store") || titleLower.includes("retail") || titleLower.includes("dining") || titleLower.includes("restaurant")) {
          category = "commercial";
        } else if (subtitle.includes("office") || subtitle.includes("tower") || subtitle.includes("headquarter") ||
          titleLower.includes("office") || titleLower.includes("tower") || titleLower.includes("headquarter")) {
          category = "office";
        } else if (subtitle.includes("public") || subtitle.includes("museum") || subtitle.includes("library") || subtitle.includes("school") || subtitle.includes("terminal") ||
          titleLower.includes("public") || titleLower.includes("museum") || titleLower.includes("library") || titleLower.includes("school") || titleLower.includes("terminal")) {
          category = "public";
        } else if (subtitle.includes("urban") || subtitle.includes("masterplan") || subtitle.includes("city") || subtitle.includes("landscape") ||
          titleLower.includes("urban") || titleLower.includes("masterplan") || titleLower.includes("city") || titleLower.includes("landscape")) {
          category = "urban";
        }
      }

      // Aspect ratio determination based on order/index for aesthetic masonry flow
      const span = index % 5 === 0 || index % 5 === 3 ? "wide" : "narrow";

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

  // Initial page entrance animation (Row-by-Row Fly In)
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Sidebar entrance
      if (sidebarRef.current) {
        tl.fromTo(
          sidebarRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 },
          0
        );
      }

      // 2. Row-by-Row Fly In for cards (Row 1 -> Row 2 -> Row 3)
      const cards = containerRef.current?.querySelectorAll<HTMLElement>(".work-card");
      if (cards && cards.length > 0) {
        const numCols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        const rowGroups: HTMLElement[][] = [];

        Array.from(cards).forEach((card, idx) => {
          const rowIndex = Math.floor(idx / numCols);
          if (!rowGroups[rowIndex]) rowGroups[rowIndex] = [];
          rowGroups[rowIndex].push(card);
        });

        rowGroups.forEach((rowCards, rowIndex) => {
          const startTime = 0.05 + rowIndex * 0.1; // Snappier row progression
          tl.fromTo(
            rowCards,
            { opacity: 0, y: 60, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.03,
              clearProps: "transform,opacity",
            },
            startTime
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // Handle filter change with 3D Flip Card transition
  const handleFilterChange = (newType?: WorkType | "all", newCat?: WorkCategory | "all") => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !gridRef.current) {
      if (newType !== undefined) setActiveType(newType);
      if (newCat !== undefined) setActiveCat(newCat);
      return;
    }

    // Kill any running filter timeline to prevent overlapping or stuck states
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll(".work-card"), { clearProps: "all" });
      }
    }

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".work-card");
    if (!cards || cards.length === 0) {
      if (newType !== undefined) setActiveType(newType);
      if (newCat !== undefined) setActiveCat(newCat);
      return;
    }

    isFlippingRef.current = true;

    // 1. Flip out current cards from 0° -> 90° (Fast & unified, no lag)
    const tl = gsap.timeline({
      onComplete: () => {
        // Switch to new filter data in React immediately
        if (newType !== undefined) setActiveType(newType);
        if (newCat !== undefined) setActiveCat(newCat);
      },
    });

    activeTimelineRef.current = tl;

    tl.to(cards, {
      rotationY: 90,
      opacity: 0,
      scale: 0.95,
      transformPerspective: 1000,
      duration: 0.18,
      ease: "power2.in",
      stagger: 0.005,
    });
  };

  // 3D Flip In ONLY when filtered content updates via user filter click
  useIsomorphicLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only run 3D Flip In if user actively triggered a filter change
    if (!isFlippingRef.current) return;

    if (!gridRef.current) {
      isFlippingRef.current = false;
      return;
    }

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      isFlippingRef.current = false;
      return;
    }

    // 2. Flip in newly updated cards from -90° -> 0° (Seamless continuous motion)
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".work-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { rotationY: -90, opacity: 0, scale: 0.95, transformPerspective: 1000 },
        {
          rotationY: 0,
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.008,
          clearProps: "all",
          onComplete: () => {
            isFlippingRef.current = false;
            activeTimelineRef.current = null;
          },
        }
      );
    } else {
      isFlippingRef.current = false;
    }
  }, [filtered]);

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <div className="flex max-w-[1920px] mx-auto px-6 md:px-[60px] pt-4 md:pt-6 pb-24 gap-12">

        {/* ========== DESKTOP SIDEBAR ========== */}
        <aside
          ref={sidebarRef}
          className="w-[240px] shrink-0 hidden md:flex flex-col justify-between sticky top-[100px] h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin"
        >
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
                onClick={() => handleFilterChange("all", undefined)}
                className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeType === "all"
                  ? "text-[#111] font-medium border-[#111]"
                  : "text-[#555] hover:text-[#111] border-transparent"
                  }`}
              >
                {showAllLabel}
              </button>
              {TYPE_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key, undefined)}
                  className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeType === key
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
                onClick={() => handleFilterChange(undefined, "all")}
                className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeCat === "all"
                  ? "text-[#111] font-medium border-[#111]"
                  : "text-[#555] hover:text-[#111] border-transparent"
                  }`}
              >
                {showAllLabel}
              </button>
              {CAT_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(undefined, key)}
                  className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeCat === key
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
            <div
              ref={gridRef}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full"
            >
              {filtered.map((work) => (
                <div
                  key={work.id}
                  data-flip-id={work.id}
                  onClick={() => {
                    if (work.vrUrl) {
                      setVrModal({ url: work.vrUrl, title: work.title });
                    } else if (work.videoUrl) {
                      setLightbox({ src: work.videoUrl, alt: work.title, isVideo: true, type: work.type });
                    } else if (work.image) {
                      setLightbox({ src: work.image, alt: work.title, type: work.type });
                    }
                  }}
                  className="work-card break-inside-avoid w-full group cursor-pointer inline-block will-change-transform"
                >
                  <div
                    className="work-card-media relative overflow-hidden w-full bg-gray-100 rounded-[3px] transition-transform duration-500 ease-out will-change-transform"
                    style={{ aspectRatio: work.span === "wide" ? "16/10" : "3/4" }}
                  >
                    {work.image ? (
                      <img
                        src={work.image}
                        alt={work.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[0.7s] ease-out group-hover:scale-[1.035] opacity-0"
                        onLoad={(e) => {
                          e.currentTarget.classList.remove("opacity-0");
                          e.currentTarget.classList.add("opacity-100");
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full transition-transform duration-[0.7s] ease-out group-hover:scale-[1.035]"
                        style={{ backgroundColor: work.bg }}
                      />
                    )}
                  </div>
                  <div className="work-card-info mt-3.5 mb-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
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
                      handleFilterChange("all", undefined);
                      setIsFilterOpen(false);
                    }}
                    className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeType === "all"
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
                        handleFilterChange(key, undefined);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeType === key
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
                      handleFilterChange(undefined, "all");
                      setIsFilterOpen(false);
                    }}
                    className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeCat === "all"
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
                        handleFilterChange(undefined, key);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-[14px] py-1 transition-colors font-sans tracking-wide block w-full border-l-2 pl-3 ${activeCat === key
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
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
