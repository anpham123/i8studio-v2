"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface HeaderProps {
  logoImage?: string;
}

export default function Header({ logoImage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("service"), href: `/${locale}/service` },
    { label: t("works"), href: `/${locale}/works` },
    { label: t("aboutUs"), href: `/${locale}/about-us` },
    { label: t("insights"), href: `/${locale}/insights` },
    { label: t("news"), href: `/${locale}/news` },
    { label: t("qa"), href: `/${locale}/qa` },
    { label: t("blog"), href: `/${locale}/blog` },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 shadow-lg transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt="i8 STUDIO"
                className="object-contain"
                style={{ height: 44, width: "auto", maxWidth: 200 }}
              />
            ) : (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                i8 STUDIO
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="text-sm text-white/60 hover:text-white transition-colors px-2 py-1"
            >
              {t("lang")}
            </button>
            <Link
              href={`/${locale}/contact`}
              className="btn-gradient text-sm px-5 py-2.5"
            >
              {t("getQuote")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0a0f]/98 backdrop-blur-md border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/5 flex items-center gap-3">
              <button
                onClick={toggleLocale}
                className="text-sm text-white/60 hover:text-white"
              >
                {t("lang")}
              </button>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="btn-gradient text-sm px-5 py-2.5 flex-1 text-center"
              >
                {t("getQuote")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
