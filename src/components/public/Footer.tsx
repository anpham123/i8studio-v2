import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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

export default function Footer({ settings, services }: FooterProps) {
  const t     = useTranslations("footer");
  const navT  = useTranslations("nav");
  const locale = useLocale();

  const navLinks = [
    { label: navT("works"),    href: `/${locale}/works` },
    { label: navT("service"),  href: `/${locale}/service` },
    { label: navT("aboutUs"),  href: `/${locale}/about-us` },
    { label: navT("insights"), href: `/${locale}/insights` },
    { label: navT("news"),     href: `/${locale}/news` },
    { label: navT("contact"),  href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Logo + tagline + social */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-3">
              <span className="text-xl font-bold text-gray-900 tracking-tight">i8 STUDIO</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {t("tagline")}
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ key, Icon, label }) => {
                const url = settings[key];
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

          {/* Col 3: Services */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-widest text-xs">
              {t("services")}
            </h4>
            <ul className="space-y-2.5">
              {services.slice(0, 6).map((s) => {
                const name = locale === "ja" ? s.nameJa || s.name : s.name;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/${locale}/service/${s.slug}`}
                      className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
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
              <li className="text-gray-400">Mon–Fri 9:00–18:00 JST</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">{t("rights")}</p>
          <p className="text-gray-300 text-xs">{t("trust")}</p>
        </div>
      </div>
    </footer>
  );
}
