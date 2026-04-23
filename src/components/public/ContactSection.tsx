"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, Send } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface ContactSectionProps {
  settings: Record<string, string>;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ fullName: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const services = [
    "3D CG Visualization",
    "3D Animation",
    "VR Experience",
    "BIM Services",
    "Pachinko & Slot CG",
    "Anime & Illustration",
    "Other",
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
        setForm({ fullName: "", email: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: Form */}
          <FadeIn direction="left">
            <div className="card-glass p-8">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Send size={28} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-white/60">{t("responseTime")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      {t("name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors text-sm"
                      placeholder="Tanaka Hiroshi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                      placeholder="hello@company.jp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      {t("service")}
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors text-sm appearance-none"
                    >
                      <option value="" className="bg-[#0a0a0f]">{t("selectService")}</option>
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0a0f]">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      {t("message")} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors text-sm resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full btn-gradient py-3.5 text-base disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t("submit")}
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4 text-white/40 text-xs">
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
                <h3 className="text-white font-bold text-xl mb-6">Get in touch</h3>
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
                  value: t("workingHours"),
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <item.icon size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white/80 hover:text-white transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-white/80 text-sm">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="mt-8 p-5 card-glass">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "200+ Projects",
                    "50+ Clients",
                    "NDA Available",
                    "Fast Turnaround",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-white/60 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {badge}
                    </div>
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
