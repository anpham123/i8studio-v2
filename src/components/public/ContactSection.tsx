"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, Send } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

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
  const [form, setForm] = useState({ fullName: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const services = serviceNames && serviceNames.length > 0
    ? [...serviceNames, "Other"]
    : DEFAULT_SERVICES;

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
        setForm({ fullName: "", email: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Contact
          </div>
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
                      placeholder="Tanaka Hiroshi"
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
                      placeholder="hello@company.jp"
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
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-300 text-sm resize-none focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                      placeholder="Tell us about your project..."
                    />
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

                  <div className="flex items-center gap-4 text-gray-400 text-xs">
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
                  label: "Email",
                  value: settings.email || "info@i8studio.vn",
                  href: `mailto:${settings.email || "info@i8studio.vn"}`,
                },
                {
                  icon: Phone,
                  label: "Phone / WhatsApp",
                  value: settings.phone || "0914 049 090",
                  href: `tel:${settings.phone || "0914049090"}`,
                },
                {
                  icon: MessageCircle,
                  label: "Line",
                  value: settings.lineUrl || "Contact via Line",
                  href: settings.lineUrl || "#",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: settings.address || "Da Nang, Vietnam",
                  href: null,
                },
                {
                  icon: Clock,
                  label: "Working Hours",
                  value: settings.workingHours || t("workingHours"),
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <item.icon size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-gray-700 text-sm">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="mt-8 border border-gray-200 rounded-xl p-5 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "200+ Projects",
                    "50+ Clients",
                    "NDA Available",
                    "Fast Turnaround",
                  ].map((badge) => (
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
                <div className="flex gap-3">
                  {[
                    { path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", href: settings.socialFacebook || "https://facebook.com/i8studio", label: "Facebook" },
                    { path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", href: settings.socialInstagram || "https://instagram.com/i8studio", label: "Instagram" },
                    { path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z", href: settings.socialLinkedin || "https://linkedin.com/company/i8studio", label: "LinkedIn" },
                    { path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z", href: settings.socialYoutube || "https://youtube.com/@i8studio", label: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-[10px] bg-gray-50 border border-gray-200 flex items-center justify-center text-[#111] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
