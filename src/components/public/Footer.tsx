import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import ScrollToTopButton from "@/components/public/ScrollToTopButton";

interface FooterProps {
  settings: Record<string, string>;
  services: { slug: string; name: string; nameJa: string }[];
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIAL = [
  { key: "socialFacebook",  Icon: IconFacebook,  label: "Facebook",    defaultUrl: "https://www.facebook.com/i8studio.vn/" },
  { key: "socialInstagram", Icon: IconInstagram, label: "Instagram",   defaultUrl: "https://www.instagram.com/i8studio_cg/" },
  { key: "socialTwitter",   Icon: IconX,         label: "X (Twitter)", defaultUrl: "https://x.com/i8studio_3d" },
  { key: "socialYoutube",   Icon: IconYoutube,   label: "YouTube",     defaultUrl: "https://www.youtube.com/@i8studio" },
];

// ─── CHỈNH KÍCH THƯỚC LOGO TẠI ĐÂY (px) ──────────────────────────
const FOOTER_LOGO_HEIGHT = 75; // Kích cỡ logo sau khi cắt sạch khoảng trắng (Rất to & sắc nét)

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

  const aboutLinks = [
    { label: navT("aboutSub.companyOverview"), href: `/${locale}/about-us` },
    { label: navT("aboutSub.portfolio"),       href: `/${locale}/about-us/portfolio` },
    { label: navT("aboutSub.workflow"),        href: `/${locale}/about-us/workflow` },
  ];

  const blogLinks = [
    { label: navT("blogSub.caseStudy"),        href: `/${locale}/blogs/case-study` },
    { label: navT("blogSub.techniqueSharing"), href: `/${locale}/blogs/tips` },
    { label: navT("blogSub.knowledge"),        href: `/${locale}/blogs/knowledge` },
    { label: navT("blogSub.ai"),               href: `/${locale}/blogs/ai-feature` },
    { label: navT("blogSub.lifeGallery"),      href: `/${locale}/blogs/life-gallery` },
  ];

  return (
    <footer className="bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* ── BỐ CỤC FOOTER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* Cột 1 (Phần 1): Logo + Slogan + Socials + Contact Info */}
          <div className="lg:col-span-4 flex flex-col lg:pr-8 xl:pr-12">
            {/* Logo */}
            <div className="mb-3">
              <Link href={`/${locale}`} className="inline-block">
                <img
                  src="/images/logo.webp"
                  alt={settings.siteName || "i8 STUDIO"}
                  style={{
                    height: parseInt(settings.logoFooterHeight) ? Math.max(FOOTER_LOGO_HEIGHT, parseInt(settings.logoFooterHeight)) : FOOTER_LOGO_HEIGHT,
                    width: "auto",
                    objectFit: "contain",
                  }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>

            <p className="text-black text-[14px] sm:text-[15px] leading-relaxed mb-4 font-normal whitespace-pre-line">
              {locale === "ja"
                ? (settings.footerTaglineJa || t("tagline"))
                    .replace("、高品質", "、\n高品質")
                    .replace("伝える高品質", "伝える、\n高品質")
                    .replace("伝える\n高品質", "伝える、\n高品質")
                : (settings.footerTaglineEn || t("tagline"))
                    .replace("to life high", "to life, high")
                    .replace("to life\n", "to life,\n")
                    .replace("to life ", "to life, ")
                    .replace("to life,,", "to life,")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mb-5">
              {SOCIAL.map(({ key, Icon, label, defaultUrl }) => {
                const raw = settings[key] || defaultUrl;
                const url = raw && !raw.startsWith("http") ? `https://${raw}` : raw;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#333] hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

            {/* Contact Details (Liền mạch và gọn gàng) */}
            <ul className="space-y-2 text-[14px] sm:text-[15px] text-black font-medium">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:underline transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="hover:underline transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              <li>
                {locale === "ja"
                  ? (settings.addressJa || "ベトナム・ダナン")
                  : (settings.address || "Da Nang, Vietnam")}
              </li>
              <li>
                {(() => {
                  if (locale === "ja") {
                    if (settings.workingHoursJa && settings.workingHoursJa.trim()) {
                      return settings.workingHoursJa;
                    }
                    const raw = settings.workingHours || t("workingHours");
                    return raw
                      .replace(/Mon\s*-\s*Fri/gi, "月〜金")
                      .replace(/\bVN\b/gi, "(ベトナム時間)")
                      .replace(/Vietnam\s*Time/gi, "(ベトナム時間)");
                  }
                  return settings.workingHours || "Mon - Fri 7:30 - 16:30 VN";
                })()}
              </li>
            </ul>
          </div>

          {/* Cụm 3 cột (Phần 2): NAVIGATION, ABOUT US, BLOGS với khoảng cách thoáng rộng */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 xl:gap-14 lg:pl-10 xl:pl-20">

            {/* Col 2: NAVIGATION */}
            <div className="flex flex-col">
              <h4 className="text-black font-bold text-[16px] sm:text-[17px] mb-4 uppercase tracking-wider">
                {t("navigation")}
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-black hover:text-neutral-600 text-[15px] sm:text-[16px] transition-colors font-medium hover:translate-x-1 inline-block transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: ABOUT US */}
            <div className="flex flex-col">
              <h4 className="text-black font-bold text-[16px] sm:text-[17px] mb-4 uppercase tracking-wider">
                {navT("aboutUs")}
              </h4>
              <ul className="space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-black hover:text-neutral-600 text-[15px] sm:text-[16px] transition-colors font-medium hover:translate-x-1 inline-block transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: BLOGS */}
            <div className="flex flex-col">
              <h4 className="text-black font-bold text-[16px] sm:text-[17px] mb-4 uppercase tracking-wider">
                {navT("blogs")}
              </h4>
              <ul className="space-y-3">
                {blogLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-black hover:text-neutral-600 text-[15px] sm:text-[16px] transition-colors font-medium hover:translate-x-1 inline-block transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-black font-medium text-[14px] sm:text-[15px]">{t("rights")}</p>
          <div className="flex items-center gap-4">
            <p className="text-black font-medium text-[14px] sm:text-[15px]">{t("trust")}</p>
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
