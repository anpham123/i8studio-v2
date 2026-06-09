"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  logoImage?: string;
  logoHeight?: number;
  headerHeight?: number;
}

export default function Header({ headerHeight = 76 }: HeaderProps) {
  const [, setScrolled]                    = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const t        = useTranslations("nav");
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  // Transparent mode disabled — editorial hero uses white bg
  const isHome    = pathname === `/${locale}` || pathname === `/${locale}/`;
  const transparent = false;

  // Synchronously reset on every navigation before paint
  useLayoutEffect(() => {
    // If arriving at home and not scrolled, force transparent immediately
    if (isHome) {
      setScrolled(window.scrollY > 80);
    } else {
      setScrolled(false);
    }
  }, [pathname, isHome]);

  // IntersectionObserver: turn opaque when hero leaves viewport
  useEffect(() => {
    if (!isHome) return;
    let observer: IntersectionObserver | null = null;
    let onScroll: (() => void) | null = null;

    // slight delay so hero renders in DOM after page transition
    const timer = setTimeout(() => {
      const hero = document.getElementById("hero-section");
      if (!hero) {
        onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0.05 }
      );
      observer.observe(hero);
    }, 50);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, [isHome, pathname]);



  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLinks = [
    { label: t("work"),    href: `/${locale}/works` },
    { label: t("solution"), href: `/${locale}/solution` },
    { label: t("aboutUs"), href: `/${locale}/about-us` },
    { label: t("contact"), href: `/${locale}/contact` },
    { label: t("blogs"),   href: `/${locale}/news` },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const newPath   = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const linkCls = (href: string) =>
    `px-3 py-2 text-[14px] font-medium transition-all duration-300 relative group ${
      isActive(href) ? "text-[#111]" : "text-gray-500 hover:text-[#111]"
    }`;

  const underlineCls = (href: string) =>
    `absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#111] transition-transform duration-200 origin-left ${
      isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[100]"
      animate={
        transparent
          ? { backgroundColor: "rgba(255,255,255,0)", backdropFilter: "blur(0px)", boxShadow: "none" }
          : { backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", boxShadow: "0 1px 24px rgba(0,0,0,0.07)" }
      }
      transition={
        transparent
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: headerHeight }}>

          {/* Logo — stacked i ✿ / studio */}
          <Link href={`/${locale}`} className="flex flex-col shrink-0 leading-[1.1]">
            <span className="text-[26px] font-normal text-[#111] tracking-tight">i ✿</span>
            <span className="text-[12px] font-normal text-[#111] tracking-[0.06em]">studio</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkCls(link.href)}>
                {link.label}
                <span className={underlineCls(link.href)} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="text-sm font-medium transition-all duration-300 px-2 py-1 text-gray-400 hover:text-gray-900"
            >
              {t("lang")}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 transition-colors ${
              transparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <button
                  onClick={toggleLocale}
                  className="text-sm text-gray-400 hover:text-gray-900 font-medium"
                >
                  {t("lang")}
                </button>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm px-5 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-700 transition-colors"
                >
                  {t("getQuote")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
