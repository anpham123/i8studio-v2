"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocale } from "next-intl";

export default function FloatingBackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)));
      }

      // Show when scrolled past 400px
      setVisible(scrollTop > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const tooltipText = locale === "ja" ? "トップへ戻る" : "Back to top";

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
        className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/25 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={tooltipText}
      >
        {/* Circular progress ring indicating page scroll depth */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="19"
            className="stroke-white/15"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="19"
            className="stroke-white transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={119.4}
            strokeDashoffset={119.4 - (119.4 * scrollProgress) / 100}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Up arrow icon */}
        <ArrowUp size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />

        {/* Hover Tooltip (Desktop) */}
        <span className="hidden lg:block absolute right-14 px-2.5 py-1 bg-black/90 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-lg">
          {tooltipText} ({Math.round(scrollProgress)}%)
        </span>
      </button>
    </div>
  );
}
