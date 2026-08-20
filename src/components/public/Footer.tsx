import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import ScrollToTopButton from "@/components/public/ScrollToTopButton";

interface FooterProps {
  settings: Record<string, string>;
  services: { slug: string; name: string; nameJa: string }[];
}

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const SOCIAL = [
  { key: "socialFacebook",  Icon: IconFacebook,  label: "Facebook" },
  { key: "socialInstagram", Icon: IconInstagram, label: "Instagram" },
  { key: "socialLinkedin",  Icon: IconLinkedin,  label: "LinkedIn" },
  { key: "socialYoutube",   Icon: IconYoutube,   label: "YouTube" },
];

export default function Footer({ settings }: FooterProps) {
  const t     = useTranslations("footer");
  const navT  = useTranslations("nav");
  const locale = useLocale();

  const navLinks = [
    { label: navT("work"),     href: `/${locale}/works` },
    { label: navT("solution"), href: `/${locale}/solution` },
    { label: navT("price"),    href: `/${locale}/price` },
    { label: navT("aboutUs"),  href: `/${locale}/about-us` },
    { label: navT("contact"),  href: `/${locale}/contact` },
    { label: navT("blogs"),    href: `/${locale}/blogs` },
  ];

  return (
    <footer className="bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1: Logo + tagline + social */}
          <div>
            <Link href={`/${locale}`} className="inline-block mb-3">
              {(settings.footerLogoImage || settings.logoImage) ? (
                <img
                  src={settings.footerLogoImage || settings.logoImage}
                  alt={settings.siteName || "i8 STUDIO"}
                  style={{ height: parseInt(settings.logoFooterHeight) || Math.min(48, parseInt(settings.logoHeight) || 40), width: "auto", objectFit: "contain" }}
                />
              ) : (
                <span className="text-xl font-bold text-gray-900 tracking-tight">i8 STUDIO</span>
              )}
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {t("tagline")}
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ key, Icon, label }) => {
                const raw = settings[key];
                const url = raw && !raw.startsWith("http") ? `https://${raw}` : raw;
                return (
                  <a
                    key={key}
                    href={url || "#"}
                    target={url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      url
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                        : "bg-gray-50 text-gray-200 cursor-default"
                    }`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-widest text-xs">
              {t("navigation")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-widest text-xs">
              {t("contact")}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-gray-900 transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="hover:text-gray-900 transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && <li>{settings.address}</li>}
              <li>{settings.workingHours || t("workingHours")}</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">{t("rights")}</p>
          <div className="flex items-center gap-4">
            <p className="text-gray-300 text-xs">{t("trust")}</p>
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
