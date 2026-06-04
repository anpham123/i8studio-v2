"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  logoImage?: string;
  logoHeight?: number;
  headerHeight?: number;
}

export default function Header({ logoImage, logoHeight = 48, headerHeight = 76 }: HeaderProps) {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [aboutOpen, setAboutOpen]           = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const t        = useTranslations("nav");
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  // Transparent only on homepage, while hero is still in view
  const isHome    = pathname === `/${locale}` || pathname === `/${locale}/`;
  const transparent = isHome && !scrolled;

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const topLinks = [
    { label: t("works"),   href: `/${locale}/works` },
    { label: t("service"), href: `/${locale}/service` },
  ];

  const afterAboutLinks = [
    { label: t("news"),    href: `/${locale}/news` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  const aboutDropdown = [
    { label: t("aboutUs"),  href: `/${locale}/about-us` },
    { label: t("insights"), href: `/${locale}/insights` },
    { label: t("qa"),       href: `/${locale}/qa` },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const newPath   = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const linkCls = (href: string) =>
    `px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
      transparent
        ? isActive(href) ? "text-white" : "text-white/70 hover:text-white"
        : isActive(href) ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
    }`;

  const underlineCls = (href: string) =>
    `absolute bottom-0 left-3 right-3 h-[2px] transition-transform duration-200 origin-left ${
      transparent ? "bg-white" : "bg-gray-900"
    } ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`;

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

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt="i8 STUDIO"
                style={{
                  height: logoHeight,
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  filter: transparent ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            ) : (
              <span
                className="text-xl font-bold tracking-tight transition-colors duration-300"
                style={{ color: transparent ? "rgba(255,255,255,0.95)" : "#111827" }}
              >
                i8 STUDIO
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {topLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkCls(link.href)}>
                {link.label}
                <span className={underlineCls(link.href)} />
              </Link>
            ))}

            {/* About dropdown */}
            <div ref={aboutRef} className="relative">
              <button
                onClick={() => setAboutOpen((v) => !v)}
                onMouseEnter={() => setAboutOpen(true)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  transparent
                    ? aboutDropdown.some((l) => isActive(l.href))
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : aboutDropdown.some((l) => isActive(l.href))
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                About
                <ChevronDown size={14} className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setAboutOpen(false)}
                    className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50"
                  >
                    {aboutDropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive(item.href)
                            ? "text-gray-900 font-semibold bg-gray-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {afterAboutLinks.map((link) => (
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
              className={`text-sm font-medium transition-all duration-300 px-2 py-1 ${
                transparent ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {t("lang")}
            </button>
            <Link
              href={`/${locale}/contact`}
              className={`text-sm px-5 py-2.5 font-semibold rounded-full transition-all duration-300 ${
                transparent
                  ? "border border-white/50 text-white hover:bg-white hover:text-gray-900"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
            >
              {t("getQuote")}
            </Link>
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
              {topLinks.map((link) => (
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

              <button
                onClick={() => setMobileAboutOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                About
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileAboutOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-4"
                  >
                    {aboutDropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setMobileOpen(false); setMobileAboutOpen(false); }}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive(item.href)
                            ? "text-gray-900 font-semibold"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {afterAboutLinks.map((link) => (
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
