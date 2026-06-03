"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  logoImage?: string;
  logoHeight?: number;
}

export default function Header({ logoImage, logoHeight = 48 }: HeaderProps) {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [aboutOpen, setAboutOpen]     = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const t        = useTranslations("nav");
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
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

  const allMobileLinks = [
    ...topLinks,
    ...aboutDropdown,
    ...afterAboutLinks,
  ];

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const newPath   = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const linkCls = (href: string) =>
    `px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
      isActive(href)
        ? "text-gray-900"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : "border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt="i8 STUDIO"
                style={{ height: logoHeight, maxHeight: 56, width: "auto", objectFit: "contain", display: "block" }}
              />
            ) : (
              <span className="text-xl font-bold text-gray-900 tracking-tight">i8 STUDIO</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {topLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkCls(link.href)}>
                {link.label}
                {/* Active underline */}
                <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-gray-900 transition-transform duration-200 origin-left ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            ))}

            {/* About dropdown */}
            <div ref={aboutRef} className="relative">
              <button
                onClick={() => setAboutOpen((v) => !v)}
                onMouseEnter={() => setAboutOpen(true)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  aboutDropdown.some((l) => isActive(l.href))
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
                <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-gray-900 transition-transform duration-200 origin-left ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors px-2 py-1 font-medium"
            >
              {t("lang")}
            </button>
            <Link
              href={`/${locale}/contact`}
              className="text-sm px-5 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-700 transition-colors"
            >
              {t("getQuote")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
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

      {/* Mobile menu — animated slide down */}
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
              {/* Top links */}
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

              {/* About expandable */}
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
    </header>
  );
}
