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
    <section id="about" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text */}
          <FadeIn direction="left">
            <div>
              <div className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
                i8 Studio
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
                {t("title")}
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                We are a Vietnamese CG studio specializing in high-quality 3DCG, Animation,
                VR, and BIM services for the Japanese architecture and real estate market.
                Founded in 2019, we&apos;ve grown to serve 50+ Japanese companies with
                photorealistic visuals that win client trust.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Our team combines Japanese-standard quality expectations with
                cost-effective production from Vietnam — giving our clients the best
                of both worlds. We support NDA, work with all major 3D formats, and
                offer flexible, iterative workflows.
              </p>
              <Link
                href={`/${locale}/about-us`}
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3"
              >
                {t("learnMore")}
              </Link>
            </div>

            {/* Timeline */}
            <div className="mt-12 relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 to-transparent" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <FadeIn key={m.year} delay={i * 0.1}>
                    <div className="flex items-start gap-6 pl-10 relative">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-blue-400 font-bold text-sm">{m.year}</div>
                        <div className="text-white/70 text-sm mt-0.5">
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
              <div className="col-span-2 aspect-video rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/20">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 flex items-center justify-center">
                <div className="text-white/20 text-xs text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded bg-white/5 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  Da Nang Office
                </div>
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-white/10 flex items-center justify-center">
                <div className="text-white/20 text-xs text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded bg-white/5 flex items-center justify-center">
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
