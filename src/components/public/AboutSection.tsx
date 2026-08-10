import Link from "next/link";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface AboutSectionProps {
  locale: string;
  showLearnMore?: boolean;
  settings?: Record<string, string>;
}

export default function AboutSection({ locale, showLearnMore = true, settings }: AboutSectionProps) {
  const t = useTranslations("about");
  const isJa = locale === "ja";

  const title = isJa
    ? (settings?.aboutTitleJa || settings?.aboutTitle || t("title"))
    : (settings?.aboutTitle || t("title"));

  const desc1 = isJa
    ? (settings?.aboutDesc1Ja || settings?.aboutDesc1 || t("description1"))
    : (settings?.aboutDesc1 || t("description1"));

  const desc2 = isJa
    ? (settings?.aboutDesc2Ja || settings?.aboutDesc2 || t("description2"))
    : (settings?.aboutDesc2 || t("description2"));

  const milestoneList = [
    {
      year: settings?.aboutMilestone1Year || "2019",
      text: isJa
        ? (settings?.aboutMilestone1TextJa || settings?.aboutMilestone1Text || t("milestones.2019"))
        : (settings?.aboutMilestone1Text || t("milestones.2019")),
    },
    {
      year: settings?.aboutMilestone2Year || "2020",
      text: isJa
        ? (settings?.aboutMilestone2TextJa || settings?.aboutMilestone2Text || t("milestones.2020"))
        : (settings?.aboutMilestone2Text || t("milestones.2020")),
    },
    {
      year: settings?.aboutMilestone3Year || "2022",
      text: isJa
        ? (settings?.aboutMilestone3TextJa || settings?.aboutMilestone3Text || t("milestones.2022"))
        : (settings?.aboutMilestone3Text || t("milestones.2022")),
    },
    {
      year: settings?.aboutMilestone4Year || "2024",
      text: isJa
        ? (settings?.aboutMilestone4TextJa || settings?.aboutMilestone4Text || t("milestones.2024"))
        : (settings?.aboutMilestone4Text || t("milestones.2024")),
    },
  ];

  return (
    <section id="about" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text */}
          <FadeIn direction="left">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                i8 Studio
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">
                {title}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                {desc1}
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                {desc2}
              </p>
              {showLearnMore && (
                <Link
                  href={`/${locale}/about-us`}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {t("learnMore")}
                </Link>
              )}
            </div>

            {/* Timeline */}
            <div className="mt-12 relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-6">
                {milestoneList.map((m, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-6 pl-10 relative">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold text-sm">{m.year}</div>
                        <div className="text-gray-500 text-sm mt-0.5">
                          {m.text}
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
              <div className="col-span-2 aspect-video rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative group">
                {settings?.aboutImageTeam ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.aboutImageTeam} alt="Our Team" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
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
                )}
              </div>
              <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative group">
                {settings?.aboutImageOffice ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.aboutImageOffice} alt="Da Nang Office" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-300 text-xs text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded bg-gray-200 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                      </div>
                      Da Nang Office
                    </div>
                  </div>
                )}
              </div>
              <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative group">
                {settings?.aboutImageQuality ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.aboutImageQuality} alt="Quality First" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-300 text-xs text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded bg-gray-200 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      Quality First
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
