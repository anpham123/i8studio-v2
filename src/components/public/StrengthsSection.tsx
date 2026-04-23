import FadeIn from "./FadeIn";
import { Check } from "lucide-react";

const strengths = [
  "Photorealistic quality that wins client trust",
  "Fast turnaround — 3-5 days for single renders",
  "50+ Japanese company partnerships",
  "NDA available, strict data confidentiality",
  "Flexible workflow: Revit, SketchUp, AutoCAD accepted",
];

export default function StrengthsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center text-white/20">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="m3 9 4-4 4 4 4-4 4 4" />
                      <path d="m3 15 4-4 4 4 4-4 4 4" />
                    </svg>
                  </div>
                  <span className="text-sm">Studio Portfolio</span>
                </div>
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50 rounded-tl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-500/50 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/50 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-purple-500/50 rounded-br" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 shadow-xl">
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-xs text-white/70">Projects Delivered</div>
              </div>
            </div>
          </FadeIn>

          {/* Strengths list */}
          <FadeIn direction="right">
            <div>
              <div className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
                Why Choose Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">
                High Quality CG at{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Competitive Price
                </span>
              </h2>

              <div className="space-y-4">
                {strengths.map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mt-0.5">
                        <Check size={13} strokeWidth={3} className="text-white" />
                      </div>
                      <p className="text-white/80 leading-relaxed">{item}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
