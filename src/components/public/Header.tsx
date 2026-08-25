"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavChild {
  label: string;
  href: string;
  thumbnail?: string;  // for mega-menu items
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  megaMenu?: boolean;   // if true → dark panel mega-menu style
}

interface ServiceItem {
  slug: string;
  name: string;
  nameJa: string;
  image: string;
}

interface HeaderProps {
  logoImage?: string;
  logoHeight?: number;
  headerHeight?: number;
  services?: ServiceItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Header({ headerHeight = 76, logoImage, logoHeight = 48, services = [] }: HeaderProps) {
  const [, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrollHidden, setScrollHidden] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const navRef = useRef<HTMLElement>(null);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const transparent = false;

  /* ---- scroll / intersection logic ---- */
  useLayoutEffect(() => {
    if (isHome) {
      setScrolled(window.scrollY > 80);
    } else {
      setScrolled(false);
    }
  }, [pathname, isHome]);

  useEffect(() => {
    if (!isHome) return;
    let observer: IntersectionObserver | null = null;
    let onScroll: (() => void) | null = null;

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

  /* ---- close desktop dropdown on outside click ---- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDesktopMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---- close menus on navigation ---- */
  useEffect(() => {
    setOpenDesktopMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  /* ---- hide/show header on scroll direction ---- */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        // Always show when near top or when dropdown/mobile menu is open
        if (currentY < 100 || openDesktopMenu || mobileOpen) {
          setScrollHidden(false);
        } else if (currentY > lastY + 5) {
          setScrollHidden(true);  // scrolling down
        } else if (currentY < lastY - 5) {
          setScrollHidden(false); // scrolling up
        }
        lastY = currentY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [openDesktopMenu, mobileOpen]);

  /* ---- nav data ---- */
  const navLinks: NavItem[] = [
    { label: t("work"), href: `/${locale}/works` },
    {
      label: t("solution"),
      href: `/${locale}/solution`,
      megaMenu: true,
      children: services.map((svc) => ({
        label: locale === "ja" && svc.nameJa ? svc.nameJa : svc.name,
        href: `/${locale}/solution/${svc.slug}`,
        thumbnail: svc.image || undefined,
      })),
    },
    { label: t("price"), href: `/${locale}/price` },
    {
      label: t("aboutUs"),
      href: `/${locale}/about-us`,
      children: [
        { label: t("aboutSub.companyOverview"), href: `/${locale}/about-us` },
        { label: t("aboutSub.portfolio"), href: `/${locale}/about-us/portfolio` },
        { label: t("aboutSub.workflow"), href: `/${locale}/about-us/workflow` },
        { label: t("aboutSub.qa"), href: `/${locale}/qa` },
      ],
    },
    { label: t("contact"), href: `/${locale}/contact` },
    {
      label: t("blogs"),
      href: `/${locale}/blogs`,
      children: [
        { label: t("blogSub.caseStudy"), href: `/${locale}/blogs/case-study` },
        { label: t("blogSub.techniqueSharing"), href: `/${locale}/blogs/tips` },
        { label: t("blogSub.knowledge"), href: `/${locale}/blogs/knowledge` },
        { label: t("blogSub.ai"), href: `/${locale}/blogs/ai-feature` },
        { label: t("blogSub.lifeGallery"), href: `/${locale}/blogs/life-gallery` },
      ],
    },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0].split("#")[0];
    return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
  };

  const linkCls = (href: string, hasChildren?: boolean) =>
    `px-3 py-2 text-[15px] font-medium uppercase tracking-[0.06em] transition-all duration-300 relative group inline-flex items-center gap-1 ${isActive(href) ? "text-[#111]" : "text-gray-500 hover:text-[#111]"
    }${hasChildren ? " cursor-default" : ""}`;

  const underlineCls = (href: string) =>
    `absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#111] transition-transform duration-200 origin-left ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`;

  /* ---- Desktop dropdown hover handlers ---- */
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((key: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDesktopMenu(key);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setOpenDesktopMenu(null), 150);
  }, []);

  /* ---- Mobile accordion toggle ---- */
  const toggleMobileSubmenu = (key: string) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <motion.header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100]"
      animate={{
        ...(transparent
          ? { backgroundColor: "rgba(255,255,255,0)", backdropFilter: "blur(0px)", boxShadow: "none" }
          : { backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", boxShadow: "0 1px 24px rgba(0,0,0,0.07)" }),
        y: scrollHidden ? -headerHeight : 0,
      }}
      transition={{
        ...(transparent
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }),
        y: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: headerHeight }}>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            {logoImage ? (
              <img
                src={logoImage}
                alt="i8 studio logo"
                style={{ height: logoHeight, width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
              />
            ) : (
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[30px] font-medium text-[#111] tracking-tight">i ✿</span>
                <span className="text-[13px] font-medium text-[#111] tracking-[0.08em]">studio</span>
              </div>
            )}
          </Link>

          {/* ============ Desktop Nav ============ */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={link.children ? () => handleMouseEnter(link.href) : undefined}
                onMouseLeave={link.children ? handleMouseLeave : undefined}
              >
                {/* Top-level link */}
                {link.children ? (
                  <button
                    type="button"
                    className={linkCls(link.href, true)}
                    onClick={() => setOpenDesktopMenu((prev) => (prev === link.href ? null : link.href))}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${openDesktopMenu === link.href ? "rotate-180" : ""
                        }`}
                    />
                    <span className={underlineCls(link.href)} />
                  </button>
                ) : (
                  <Link href={link.href} className={linkCls(link.href)}>
                    {link.label}
                    <span className={underlineCls(link.href)} />
                  </Link>
                )}

                {/* ---- Mega-menu (SERVICE panel) ---- */}
                <AnimatePresence>
                  {link.megaMenu && link.children && openDesktopMenu === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="fixed left-0 right-0 top-full mt-0 z-50"
                      style={{ top: headerHeight }}
                    >
                      <div className="bg-white border-t border-gray-200 shadow-xl">
                        <div className="max-w-7xl mx-auto px-8 py-10">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-8">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                              {locale === "ja" ? "ソリューション" : "SERVICE"}
                            </span>
                            <span className="flex-1 h-px bg-gray-200" />
                          </div>

                          {/* 4-col Grid */}
                          <div className="grid grid-cols-4 gap-8">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="group relative block aspect-[16/10] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/80 bg-gray-900"
                              >
                                {child.thumbnail ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={child.thumbnail}
                                    alt={child.label}
                                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a2d34] via-[#1a1c22] to-[#111]" />
                                )}

                                {/* Dark overlay for text legibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20 group-hover:from-black/60 group-hover:via-black/25 group-hover:to-transparent transition-colors duration-300" />

                                {/* Label overlaid on image */}
                                <div className="absolute inset-0 flex items-center justify-center p-4 text-center z-10">
                                  <span className="text-white font-medium text-[13px] tracking-wide drop-shadow-md group-hover:scale-105 transition-transform duration-300 leading-snug">
                                    {child.label}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ---- Regular dropdown ---- */}
                <AnimatePresence>
                  {!link.megaMenu && link.children && openDesktopMenu === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-1 min-w-[220px] bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-5 py-2.5 text-[13px] font-medium tracking-wide transition-colors ${isActive(child.href)
                              ? "text-[#111] bg-gray-50"
                              : "text-gray-500 hover:text-[#111] hover:bg-gray-50/70"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            className={`lg:hidden p-2 transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"
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

      {/* ============ Mobile menu ============ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.children ? (
                    <>
                      {/* Accordion trigger */}
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(link.href)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                            ? "bg-gray-50 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${mobileExpanded === link.href ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {/* Accordion content */}
                      <AnimatePresence>
                        {mobileExpanded === link.href && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className={`pb-1 ${link.megaMenu ? "pl-3" : "pl-5"}`}>
                              {link.megaMenu ? (
                                /* Mega-menu items on mobile: compact grid with thumbnails */
                                <div className="grid grid-cols-2 gap-2.5 py-2">
                                  {link.children.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="group relative block aspect-[16/10] rounded-lg overflow-hidden shadow-sm bg-gray-900 border border-gray-200"
                                    >
                                      {child.thumbnail ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                          src={child.thumbnail}
                                          alt=""
                                          className="absolute inset-0 w-full h-full object-cover opacity-85"
                                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                                        />
                                      ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2d34] to-[#111]" />
                                      )}
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                                        <span className="text-white font-medium text-[12px] leading-tight drop-shadow">
                                          {child.label}
                                        </span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                /* Regular submenu items on mobile */
                                link.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive(child.href)
                                        ? "text-gray-900 bg-gray-50"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                      }`}
                                  >
                                    {child.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
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
