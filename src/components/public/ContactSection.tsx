"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, Send, Check } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations, useLocale } from "next-intl";

interface ContactSectionProps {
  settings: Record<string, string>;
  serviceNames?: string[];
}

const DEFAULT_SERVICES = [
  "3D CG Visualization",
  "3D Animation",
  "VR Experience",
  "BIM Services",
  "Pachinko & Slot CG",
  "Anime & Illustration",
  "Other",
];

export default function ContactSection({ settings, serviceNames }: ContactSectionProps) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isJa = locale === "ja";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    service: "",
    hearAboutUs: "",
    referrer: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Auto-detect traffic source / referrer & UTM parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source");
      const utmMedium = params.get("utm_medium");
      const utmCampaign = params.get("utm_campaign");
      const rawReferrer = document.referrer;

      let detected = "";
      if (utmSource) {
        detected = `UTM: ${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}${utmCampaign ? ` (${utmCampaign})` : ""}`;
      } else if (rawReferrer) {
        try {
          const refUrl = new URL(rawReferrer);
          detected = refUrl.hostname;
        } catch {
          detected = rawReferrer.slice(0, 100);
        }
      } else {
        detected = "Direct / Organic";
      }

      setForm((prev) => ({ ...prev, referrer: detected }));
    } catch {
      // ignore
    }
  }, []);

  const services = serviceNames && serviceNames.length > 0
    ? [...serviceNames, isJa ? "その他" : "Other"]
    : (isJa
        ? ["CGパース制作", "CG動画・アニメーション", "VR体験・ウォークスルー", "BIMモデリング", "パチンコ・パチスロCG", "アニメ・イラスト制作", "その他"]
        : DEFAULT_SERVICES);

  const channels = [
    {
      key: "facebook",
      label: t("hearChannels.facebook"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: t("hearChannels.instagram"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      key: "linkedin",
      label: t("hearChannels.linkedin"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      key: "youtube",
      label: t("hearChannels.youtube"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      key: "google",
      label: t("hearChannels.google"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      key: "referral",
      label: t("hearChannels.referral"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: "other",
      label: t("hearChannels.other"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({
          fullName: "",
          email: "",
          service: "",
          hearAboutUs: "",
          referrer: form.referrer,
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-noise pt-6 sm:pt-8 md:pt-10 pb-16 lg:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-8 sm:mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: Form */}
          <FadeIn direction="left">
            <div className="border border-gray-200 rounded-xl p-8 bg-white">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                    <Send size={28} className="text-green-500" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">{t("messageSent")}</h3>
                  <p className="text-gray-500">{t("responseTime")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                      placeholder={isJa ? "山田 太郎" : "Tanaka Hiroshi"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                      placeholder={isJa ? "info@example.co.jp" : "hello@company.jp"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("service")}
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm appearance-none focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors bg-white"
                    >
                      <option value="">{t("selectService")}</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("message")} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-300 text-sm resize-none focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                      placeholder={isJa ? "プロジェクトの概要、ご要望、スケジュールなどをご記入ください..." : "Tell us about your project..."}
                    />
                  </div>

                  {/* Survey: How did you hear about us? (4 main platforms: Facebook, Instagram, LinkedIn, YouTube + Google/Referral) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("howDidYouHear")}
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {t("howDidYouHearPlaceholder")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {channels.map((ch) => {
                        const isSelected = form.hearAboutUs === ch.label;
                        return (
                          <button
                            key={ch.key}
                            type="button"
                            onClick={() => setForm({ ...form, hearAboutUs: isSelected ? "" : ch.label })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                : "bg-gray-50/70 hover:bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            <span className="shrink-0 flex items-center justify-center">{ch.icon}</span>
                            <span className="truncate">{ch.label}</span>
                            {isSelected && <Check size={12} className="ml-auto text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm">{t("errorMessage")}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition-colors text-base disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t("submit")}
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4 text-black text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {t("responseTime")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={12} />
                      {t("nda")}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </FadeIn>

          {/* RIGHT: Contact info */}
          <FadeIn direction="right">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 font-bold text-xl mb-6">{t("getInTouch")}</h3>
              </div>

              {[
                {
                  icon: Mail,
                  label: isJa ? "メールアドレス" : "Email",
                  value: settings.email || "info@i8studio.vn",
                  href: `mailto:${settings.email || "info@i8studio.vn"}`,
                },
                {
                  icon: Phone,
                  label: isJa ? "お電話 / WhatsApp" : "Phone / WhatsApp",
                  value: settings.phone || "0914 049 090",
                  href: `tel:${settings.phone || "0914049090"}`,
                },
                {
                  icon: MessageCircle,
                  label: isJa ? "LINE" : "LINE",
                  value: settings.lineUrl ? (isJa ? "LINE公式アカウント" : "Contact via LINE") : (isJa ? "LINEでのお問い合わせ" : "Contact via LINE"),
                  href: settings.lineUrl || "#",
                },
                {
                  icon: MapPin,
                  label: isJa ? "所在地" : "Address",
                  value: isJa
                    ? (settings.addressJa || "ベトナム・ダナン")
                    : (settings.address || "Da Nang, Vietnam"),
                  href: null,
                },
                {
                  icon: Clock,
                  label: isJa ? "営業時間" : "Working Hours",
                  value: isJa
                    ? (settings.workingHoursJa || "月〜金 7:30〜16:30（ベトナム時間） / 9:30〜18:30（日本時間）")
                    : (settings.workingHours || "Mon - Fri 7:30 - 16:30 VN"),
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <item.icon size={18} className="text-black" />
                  </div>
                  <div>
                    <div className="text-black font-bold text-xs mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-black font-medium hover:underline transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-black font-medium text-sm">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="mt-8 border border-gray-200 rounded-xl p-5 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  {(isJa
                    ? [
                        "200件以上の実績",
                        "50社以上のクライアント",
                        "NDA対応可能",
                        "迅速な納期対応",
                      ]
                    : [
                        "200+ Projects",
                        "50+ Clients",
                        "NDA Available",
                        "Fast Turnaround",
                      ]
                  ).map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-gray-500 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="mt-6">
                <h4 className="text-gray-900 font-semibold text-sm mb-4">{t("followUs")}</h4>
                <div className="flex items-center gap-3.5">
                  {/* Facebook */}
                  <a
                    href={settings.socialFacebook || "https://www.facebook.com/i8studio.vn/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#333] hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={settings.socialInstagram || "https://www.instagram.com/i8studio_cg/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#333] hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={settings.socialTwitter || "https://x.com/i8studio_3d"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#333] hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href={settings.socialYoutube || "https://www.youtube.com/@i8studio"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#333] hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
