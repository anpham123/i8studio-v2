"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { useLocale } from "next-intl";

export default function FloatingBackToTop() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const locale = useLocale();

  const tooltipText = locale === "ja" ? "トップへ戻る" : "Back to top";

  useEffect(() => {
    let rafId: number | null = null;

    const updateVisibility = () => {
      rafId = null;
      const isVis = (window.scrollY || document.documentElement.scrollTop) > 400;
      if (visibleRef.current !== isVis) {
        visibleRef.current = isVis;
        setVisible(isVis);
      }
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Jump straight to the top — no smooth scroll, so the hero sequence doesn't "rewind" on the way up
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <div
      className={`fixed bottom-22 sm:bottom-24 right-4 sm:right-8 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-lg shadow-black/25 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={tooltipText}
      >
        {/* Up arrow icon */}
        <ArrowUp size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />

        {/* Hover Tooltip (Desktop) */}
        <span className="hidden lg:block absolute right-14 px-2.5 py-1 bg-black/90 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-lg">
          {tooltipText}
        </span>
      </button>
    </div>
  );
}
