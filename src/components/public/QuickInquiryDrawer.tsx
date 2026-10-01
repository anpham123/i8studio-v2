"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, CheckCircle2, MessageSquare, Mail, Phone, ExternalLink, Copy, Check } from "lucide-react";
import { useLocale } from "next-intl";

// Global custom event name for triggering the drawer from anywhere
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
  const [selectedService, setSelectedService] = useState<string>("3DCGパース");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneOrLine, setPhoneOrLine] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const services = isJa
    ? [
        { id: "3DCGパース", label: "3DCGパース（内観・外観）" },
        { id: "建築アニメーション", label: "建築アニメーション動画" },
        { id: "VR / 360°", label: "VR / 360° パノラマ" },
        { id: "BIMモデリング", label: "BIM / 3Dモデリング" },
        { id: "その他・総合相談", label: "その他・総合相談" },
      ]
    : [
        { id: "3D Rendering", label: "3D Architectural Renderings" },
        { id: "Animation", label: "Walkthrough & Cinematic Animation" },
        { id: "VR / 360°", label: "VR & 360° Interactive Tours" },
        { id: "BIM Modeling", label: "BIM & 3D CAD Modeling" },
        { id: "Other", label: "Other / General Consultation" },
      ];

  // Set default service on locale change
  useEffect(() => {
    setSelectedService(isJa ? "3DCGパース" : "3D Rendering");
  }, [isJa]);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ service?: string }>;
      if (customEvent.detail?.service) {
        setSelectedService(customEvent.detail.service);
      }
      setIsSuccess(false);
      setErrorMsg("");
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

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText("info@i8studio.vn");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg(isJa ? "有効なメールアドレスをご入力ください。" : "Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const detailsList = [
        phoneOrLine ? `[Contact / LINE / Phone]: ${phoneOrLine}` : null,
        driveLink ? `[Drawings / Cloud Link]: ${driveLink}` : null,
        message ? `[Project Scope / Details]:\n${message}` : null,
      ].filter(Boolean);

      const finalMessage = detailsList.length > 0 ? detailsList.join("\n\n") : "(No additional message provided)";

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || (isJa ? "クイック見積もり訪問者" : "Quick Inquiry Visitor"),
          email: email.trim(),
          service: selectedService,
          message: finalMessage,
          hearAboutUs: "Quick Inquiry Drawer",
          referrer: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || (isJa ? "送信に失敗しました。" : "Submission failed."));
      }

      setIsSuccess(true);
      // Reset form
      setFullName("");
      setEmail("");
      setPhoneOrLine("");
      setDriveLink("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || (isJa ? "送信エラーが発生しました。時間をおいて再試行してください。" : "An error occurred. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-[#0c0c11] text-white border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-7 border-b border-white/10 bg-white/[0.02]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] tracking-wider uppercase font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isJa ? "24時間以内にお見積り" : "Fast Quote in 24 Hours"}
            </div>
            <h2 id="inquiry-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isJa ? "プロジェクトのご相談・お見積り" : "Start Your Project"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              {isJa
                ? "図面やイメージをお持ちであれば即日概算をお届けします。"
                : "Share your drawings or briefs for a fast, detailed quotation."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors -mr-1 -mt-1 cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-6 space-y-6">
          {isSuccess ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isJa ? "お問い合わせを受け付けました" : "Inquiry Received!"}
              </h3>
              <p className="text-sm text-neutral-300 max-w-sm leading-relaxed">
                {isJa
                  ? "ご入力ありがとうございます。i8 STUDIOの担当ディレクターより、24時間以内に概算スケジュールとお見積りをご連絡いたします。"
                  : "Thank you for reaching out. Our team will review your project details and get back to you with an estimate within 24 hours."}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  {isJa ? "閉じる" : "Close"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
                  1. {isJa ? "ご希望の制作メニュー" : "Service Required"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedService(svc.id)}
                      className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer ${
                        selectedService === svc.id
                          ? "bg-white text-black border-white shadow-md font-semibold"
                          : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {svc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email (Required) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  2. {isJa ? "メールアドレス" : "Email Address"}{" "}
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isJa ? "info@yourcompany.co.jp" : "name@company.com"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Name & Company */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  3. {isJa ? "お名前・会社名" : "Name / Company"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isJa ? "例：山田 太郎（○○設計事務所）" : "e.g. John Doe (Studio Architecture)"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Phone / LINE ID / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  4. {isJa ? "お電話番号 または LINE ID (任意)" : "Phone / WhatsApp / LINE (Optional)"}
                </label>
                <input
                  type="text"
                  value={phoneOrLine}
                  onChange={(e) => setPhoneOrLine(e.target.value)}
                  placeholder={isJa ? "090-xxxx-xxxx または LINE ID" : "+1 ... or WhatsApp number"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Drive link / Cloud Folder */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  5. {isJa ? "図面・CAD・資料の共有リンク (任意)" : "Drawings / Cloud Folder Link (Optional)"}
                </label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder={isJa ? "Google Drive / Dropbox / Box 等の共有URL" : "Google Drive, Dropbox, Box or OneDrive URL"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  {isJa
                    ? "※ 大容量のCAD、PDF、SketchUpデータは共有リンクをご記入いただくとスムーズです。"
                    : "* For large CAD, PDF or 3D files, please paste a cloud share link."}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  6. {isJa ? "ご要望・納期・プロジェクト概要" : "Project Details & Timeline"}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isJa
                      ? "希望納期、アングル数、建築の規模（平米数や階数）などご自由にご記入ください。"
                      : "Describe project type, expected timeline, number of views or requirements..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>{isJa ? "送信中..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isJa ? "この内容で無料お見積りを依頼する" : "Submit Quick Inquiry (Free Quote)"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Direct Channels */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {isJa ? "または直接のお問い合わせ・ご相談" : "Direct Contact Channels"}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={isJa ? "https://line.me/ti/p/~i8studio" : "https://wa.me/84914049090"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
              >
                <MessageSquare size={13} className="text-emerald-400" />
                <span>{isJa ? "LINE 公式" : "WhatsApp"}</span>
                <ExternalLink size={11} className="text-neutral-500" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-neutral-400" />}
                <span>{copiedEmail ? (isJa ? "コピー完了" : "Copied!") : "Email コピー"}</span>
              </button>
            </div>
            <div className="text-center">
              <a
                href="tel:0914049090"
                className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                <Phone size={11} />
                <span>Hotline: +84 914 049 090</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
