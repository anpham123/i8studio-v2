import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
// Social icons as SVG since lucide-react v1 removed brand icons
const FBIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IGIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const LIIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FooterProps {
  settings: Record<string, string>;
  services: { slug: string; name: string; nameJa: string }[];
}

export default function Footer({ settings, services }: FooterProps) {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");
  const locale = useLocale();

  const navLinks = [
    { label: navT("service"), href: `/${locale}/service` },
    { label: navT("works"), href: `/${locale}/works` },
    { label: navT("aboutUs"), href: `/${locale}/about-us` },
    { label: navT("insights"), href: `/${locale}/insights` },
    { label: navT("news"), href: `/${locale}/news` },
    { label: navT("qa"), href: `/${locale}/qa` },
    { label: navT("blog"), href: `/${locale}/blog` },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Logo + tagline */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                i8 STUDIO
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              {t("tagline")}
            </p>
            <div className="flex gap-3">
              {settings.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600/20 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all">
                  <FBIcon />
                </a>
              )}
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-pink-600/20 flex items-center justify-center text-white/40 hover:text-pink-400 transition-all">
                  <IGIcon />
                </a>
              )}
              {settings.socialLinkedin && (
                <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-700/20 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all">
                  <LIIcon />
                </a>
              )}
              {!settings.socialFacebook && (
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                  <FBIcon />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">{t("navigation")}</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">{t("services")}</h4>
            <ul className="space-y-2.5">
              {services.slice(0, 6).map((s) => {
                const name = locale === "ja" ? s.nameJa || s.name : s.name;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/${locale}/service/${s.slug}`}
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">{t("contact")}</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && <li>{settings.address}</li>}
              <li>Mon-Fri 9:00-18:00 JST</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">{t("rights")}</p>
          <p className="text-white/20 text-xs">{t("trust")}</p>
        </div>
      </div>
    </footer>
  );
}
