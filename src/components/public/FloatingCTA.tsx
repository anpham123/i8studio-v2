"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Phone, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function FloatingCTA() {
  const [hidden, setHidden] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const contactRef = useRef<Element | null>(null);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    contactRef.current = contact;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: pill fixed bottom-right */}
      <div
        className={`hidden lg:block fixed bottom-8 right-8 z-40 transition-all duration-300 ${
          hidden ? "translate-y-20 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <Link
          href={`/${locale}/contact`}
          className="bg-black/75 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md flex items-center gap-2 px-6 py-3 rounded-full shadow-lg shadow-black/10 transition-all duration-300 font-medium hover:scale-105 active:scale-95"
        >
          <MessageSquare size={16} />
          {t("getQuote")}
        </Link>
      </div>

      {/* Mobile: sticky bottom bar */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 w-full max-w-full transition-all duration-300 pointer-events-auto ${
          hidden ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="w-full bg-[#0d0d14]/95 backdrop-blur-md border-t border-white/10 px-3 sm:px-4 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] box-border">
          <div className="grid grid-cols-3 gap-2 w-full max-w-lg mx-auto">
            <a
              href="tel:0914049090"
              className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white transition-colors text-center select-none active:scale-95"
            >
              <Phone size={15} />
              <span className="text-[11px] sm:text-xs">Call</span>
            </a>
            <a
              href="mailto:info@i8studio.vn"
              className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white transition-colors text-center select-none active:scale-95"
            >
              <Mail size={15} />
              <span className="text-[11px] sm:text-xs">Email</span>
            </a>
            <Link
              href={`/${locale}/contact`}
              className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-white text-black hover:bg-white/90 transition-colors text-center select-none active:scale-95 shadow-sm"
            >
              <MessageSquare size={15} />
              <span className="text-[11px] sm:text-xs font-semibold truncate max-w-full px-0.5">{t("getQuote")}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
