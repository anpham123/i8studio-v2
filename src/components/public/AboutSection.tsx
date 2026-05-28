import Link from "next/link";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

const milestones = [
  { year: "2019", key: "2019" },
  { year: "2020", key: "2020" },
  { year: "2022", key: "2022" },
  { year: "2024", key: "2024" },
];

export default function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-20 lg:py-28" style={{ background: "#fafaf8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text */}
          <FadeIn direction="left">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                i8 Studio
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {t("title")}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We are a Vietnamese CG studio specializing in high-quality 3DCG, Animation,
                VR, and BIM services for the Japanese architecture and real estate market.
                Founded in 2019, we&apos;ve grown to serve 50+ Japanese companies with
                photorealistic visuals that win client trust.
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                Our team combines Japanese-standard quality expectations with
                cost-effective production from Vietnam — giving our clients the best
                of both worlds. We support NDA, work with all major 3D formats, and
                offer flexible, iterative workflows.
              </p>
              <Link
                href={`/${locale}/about-us`}
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t("learnMore")}
              </Link>
            </div>

            {/* Timeline */}
            <div className="mt-12 relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <FadeIn key={m.year} delay={i * 0.1}>
                    <div className="flex items-start gap-6 pl-10 relative">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold text-sm">{m.year}</div>
                        <div className="text-gray-500 text-sm mt-0.5">
                          {t(`milestones.${m.key as "2019" | "2020" | "2022" | "2024"}`)}
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: Image grid */}
          <FadeIn direction="right">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 aspect-video rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span className="text-sm">Our Team</span>
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <div className="text-gray-300 text-xs text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded bg-gray-200 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  Da Nang Office
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <div className="text-gray-300 text-xs text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded bg-gray-200 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  Quality First
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
