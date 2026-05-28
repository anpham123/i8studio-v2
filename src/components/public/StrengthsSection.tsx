import FadeIn from "./FadeIn";
import { Check } from "lucide-react";

const strengths = [
  "Photorealistic quality that wins client trust",
  "Fast turnaround — 3-5 days for single renders",
  "50+ Japanese company partnerships",
  "NDA available, strict data confidentiality",
  "Flexible workflow: Revit, SketchUp, AutoCAD accepted",
];

interface StrengthsSectionProps {
  strengthsImage?: string;
}

export default function StrengthsSection({ strengthsImage }: StrengthsSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100">
                {strengthsImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={strengthsImage}
                    alt="Studio Portfolio"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center relative">
                    <div className="text-center text-gray-300">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="m3 9 4-4 4 4 4-4 4 4" />
                          <path d="m3 15 4-4 4 4 4-4 4 4" />
                        </svg>
                      </div>
                      <span className="text-sm">Studio Portfolio</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-gray-900 rounded-xl p-4 shadow-xl">
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-xs text-gray-400">Projects Delivered</div>
              </div>
            </div>
          </FadeIn>

          {/* Strengths list */}
          <FadeIn direction="right">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Why Choose Us
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                High Quality CG at Competitive Price
              </h2>

              <div className="space-y-4">
                {strengths.map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <Check size={13} strokeWidth={3} className="text-white" />
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed">{item}</p>
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
