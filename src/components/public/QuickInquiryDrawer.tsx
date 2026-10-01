"use client";

import { useState, useEffect } from "react";
import { X, Send, Clock, Shield, Check } from "lucide-react";
import { useLocale } from "next-intl";

const INQUIRY_EVENT = "i8-open-inquiry-drawer";

export function openInquiryDrawer(service?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(INQUIRY_EVENT, { detail: { service } }));
  }
}

export default function QuickInquiryDrawer() {
  const locale = useLocale();
  const isJa = locale === "ja";

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    service: "",
    hearAboutUs: "",
    referrer: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const services = isJa
    ? ["CGパース制作", "CG動画・アニメーション", "VR体験・ウォークスルー", "BIMモデリング", "パチンコ・パチスロCG", "アニメ・イラスト制作", "その他"]
    : [
        "3D CG Visualization",
        "3D Animation",
        "VR Experience",
        "BIM Services",
        "Pachinko & Slot CG",
        "Anime & Illustration",
        "Other",
      ];

  const channels = [
    {
      key: "facebook",
      label: isJa ? "Facebook" : "Facebook",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: isJa ? "Instagram" : "Instagram",
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
      label: isJa ? "LinkedIn" : "LinkedIn",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      key: "twitter",
      label: isJa ? "Twitter" : "Twitter",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: "youtube",
      label: isJa ? "YouTube" : "YouTube",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      key: "google",
      label: isJa ? "Google検索" : "Google Search",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      key: "referral",
      label: isJa ? "ご紹介 / 口コミ" : "Referral / Word of Mouth",
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
      label: isJa ? "その他" : "Other",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
  ];

  // Auto detect referrer
  useEffect(() => {
    try {
      const rawReferrer = typeof document !== "undefined" ? document.referrer : "";
      setForm((prev) => ({ ...prev, referrer: rawReferrer || "Direct / Quick Form" }));
    } catch {
      // ignore
    }
  }, []);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ service?: string }>;
      if (customEvent.detail?.service) {
        setForm((prev) => ({ ...prev, service: customEvent.detail.service || "" }));
      }
      setStatus("idle");
      setIsOpen(true);
    };

    window.addEventListener(INQUIRY_EVENT, handleOpen);
    return () => window.removeEventListener(INQUIRY_EVENT, handleOpen);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer / Modal Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[560px] bg-white text-gray-900 border-l border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-form-title"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100">
          <div>
            <h2 id="quick-form-title" className="text-lg sm:text-xl font-bold text-gray-900">
              {isJa ? "お問い合わせ・お見積り" : "Contact & Estimate"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isJa ? "プロジェクトのご相談はこちらから承ります" : "Tell us about your project"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Exactly matching user screenshot */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {status === "success" ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <Send size={28} className="text-green-500" />
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-2">
                {isJa ? "メッセージが送信されました" : "Message Sent"}
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {isJa
                  ? "お問い合わせいただきありがとうございます。24時間以内に担当者よりご連絡いたします。"
                  : "We respond within 24 hours. Our team will review your inquiry shortly."}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {isJa ? "閉じる" : "Close"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name * */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isJa ? "お名前" : "Full Name"} *
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

              {/* Email * */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isJa ? "メールアドレス" : "Email"} *
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

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isJa ? "サービス" : "Service"}
                </label>
                <div className="relative">
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm appearance-none focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors bg-white pr-10 cursor-pointer"
                  >
                    <option value="">{isJa ? "サービスを選択してください" : "Select a service"}</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message * */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isJa ? "お問い合わせ内容" : "Message"} *
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

              {/* Survey: How did you hear about us? */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isJa ? "当スタジオをどこでお知りになりましたか？" : "How did you hear about us?"}
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {isJa ? "チャンネルを選択（任意）" : "Select a channel (Optional)"}
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
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
                <p className="text-red-500 text-sm">
                  {isJa ? "送信に失敗しました。時間をおいて再試行してください。" : "Failed to send message. Please try again later."}
                </p>
              )}

              {/* Send Message Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#121826] hover:bg-gray-900 text-white font-semibold py-3.5 rounded-lg transition-colors text-base disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isJa ? "送信中..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{isJa ? "メッセージを送信" : "Send Message"}</span>
                  </>
                )}
              </button>

              {/* Response Time & NDA Notes */}
              <div className="flex items-center gap-4 text-black text-xs font-semibold pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-700" />
                  <span>{isJa ? "24時間以内に返信" : "We respond within 24 hours"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={13} className="text-gray-700" />
                  <span>{isJa ? "秘密保持契約（NDA）対応" : "NDA available upon request"}</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
