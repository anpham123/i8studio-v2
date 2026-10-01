"use client";

import { useLocale } from "next-intl";
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { openInquiryDrawer } from "./QuickInquiryDrawer";

export default function MidPageInquiryBanner() {
  const locale = useLocale();
  const isJa = locale === "ja";

  return (
    <section className="relative w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0c0c11] border-t border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-neutral-300 text-xs tracking-wider uppercase mb-6">
          <Sparkles size={13} className="text-emerald-400" />
          <span>{isJa ? "プロジェクトのご相談・お見積り" : "Start Your Project"}</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          {isJa ? (
            <>
              理想の建築空間を、<br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-400">
                圧倒的なリアリティ
              </span>
              で具現化します
            </>
          ) : (
            <>
              Elevate Your Architecture with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-400">
                Cinematic Realism
              </span>
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isJa
            ? "平面図・スケッチ・3Dモデルをお持ちであれば、24時間以内に概算スケジュールとお見積りをお届けします。小規模プロジェクトから大型コンペまで柔軟に対応いたします。"
            : "From concept sketches to complex BIM models, our team delivers photorealistic 3D visuals within 24 hours of inquiry. Trusted by architects & developers worldwide."}
        </p>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-400" />
            <span>{isJa ? "最短即日〜24時間以内の見積り" : "Estimate within 24 Hours"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>{isJa ? "厳重な秘密保持（NDA対応）" : "Strict NDA Protection"}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openInquiryDrawer()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-wide shadow-xl shadow-white/10 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>{isJa ? "クイック見積もりを依頼する (無料)" : "Get a Free Quick Quote"}</span>
            <ArrowRight size={15} />
          </button>

          <a
            href={isJa ? "https://line.me/ti/p/~i8studio" : "https://wa.me/84914049090"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isJa ? "LINEで気軽に相談" : "Chat on WhatsApp"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
