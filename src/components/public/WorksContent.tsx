"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import Lightbox from "@/components/public/Lightbox";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type WorkType = "still" | "animation" | "composite" | "vr360" | "walkthrough" | "ar" | "digital";
type WorkCategory = "residential" | "apartment" | "resort" | "commercial" | "office" | "public" | "urban";

interface DBWork {
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;
  category: string;
  type?: string;
  buildingCategory?: string;
  image: string;
  videoUrl: string;
  order: number;
  featured: boolean;
}

interface Work {
  id: string;
  title: string;
  type: WorkType;
  category: WorkCategory;
  bg: string;
  span: "wide" | "narrow";
  image?: string;
  videoUrl?: string;
}

/* ------------------------------------------------------------------ */
/*  Placeholder data (fallback if DB is empty)                        */
/* ------------------------------------------------------------------ */
const WORKS: Work[] = [
  { id: "1",  title: "Riverside Residence",   type: "still",      category: "residential",  bg: "#c8c2b8", span: "wide" },
  { id: "2",  title: "Forest Villa Aerial",   type: "still",      category: "resort",       bg: "#b0aca2", span: "wide" },
  { id: "3",  title: "Urban Tower",           type: "animation",  category: "commercial",   bg: "#a8a498", span: "narrow" },
  { id: "4",  title: "Autumn Apartment",      type: "still",      category: "apartment",    bg: "#c4bfa6", span: "narrow" },
  { id: "5",  title: "Luxury Pool Interior",  type: "composite",  category: "resort",       bg: "#bab4aa", span: "wide" },
  { id: "6",  title: "City Office Complex",   type: "vr360",      category: "office",       bg: "#9e9a92", span: "narrow" },
  { id: "7",  title: "Public Library",        type: "walkthrough", category: "public",      bg: "#c0bcb2", span: "narrow" },
  { id: "8",  title: "Seaside Resort",        type: "still",      category: "resort",       bg: "#d4cec4", span: "wide" },
  { id: "9",  title: "Shopping Mall",         type: "animation",  category: "commercial",   bg: "#b8b2a8", span: "narrow" },
  { id: "10", title: "Smart City Plan",       type: "digital",    category: "urban",        bg: "#a4a098", span: "narrow" },
  { id: "11", title: "Mountain Villa",        type: "composite",  category: "residential",  bg: "#ccc6bc", span: "wide" },
  { id: "12", title: "AR Showroom",           type: "ar",         category: "commercial",   bg: "#b4aea4", span: "narrow" },
];

const TYPE_KEYS: WorkType[] = ["still", "animation", "composite", "vr360", "walkthrough", "ar", "digital"];
const CAT_KEYS: WorkCategory[] = ["residential", "apartment", "resort", "commercial", "office", "public", "urban"];

/* ------------------------------------------------------------------ */
/*  Checkbox component                                                 */
/* ------------------------------------------------------------------ */
function FilterCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-2 py-[7px] -mx-2 rounded cursor-pointer hover:bg-[#f8f8f8] transition-colors"
      onClick={onChange}
    >
      <span
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "bg-[#111] border-[#111]" : "border-[#ccc] bg-white"
        }`}
      >
        {checked && <Check size={11} className="text-white" strokeWidth={3} />}
      </span>
      <span className="text-[14px] text-[#333] font-normal select-none">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function WorksContent({ initialWorks }: { initialWorks?: DBWork[] }) {
  const t = useTranslations("work");
  const locale = useLocale();
  const [selectedTypes, setSelectedTypes] = useState<WorkType[]>([]);
  const [selectedCats, setSelectedCats] = useState<WorkCategory[]>([]);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; isVideo?: boolean; type?: string } | null>(null);

  const toggleType = (key: WorkType) =>
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const toggleCat = (key: WorkCategory) =>
    setSelectedCats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // Dynamic mapper for database works
  const mappedWorks = useMemo(() => {
    if (!initialWorks || initialWorks.length === 0) {
      return WORKS;
    }

    const placeholderColors = [
      "#c8c2b8", "#b0aca2", "#a8a498", "#c4bfa6", "#bab4aa",
      "#9e9a92", "#c0bcb2", "#d4cec4", "#b8b2a8", "#a4a098",
      "#ccc6bc", "#b4aea4"
    ];

    return initialWorks.map((w, index) => {
      const title = locale === "ja" ? w.titleJa || w.title : w.title;
      const subtitle = w.subtitle ? w.subtitle.toLowerCase() : "";
      const titleLower = w.title ? w.title.toLowerCase() : "";

      // Map DB category (3DCG, Animation, VR, BIM) to Type
      let type: WorkType = (w.type as WorkType) || "still";
      if (!w.type) {
        const dbCat = w.category ? w.category.toUpperCase() : "3DCG";
        if (dbCat === "ANIMATION") {
          type = "animation";
        } else if (dbCat === "VR") {
          if (subtitle.includes("walkthrough") || titleLower.includes("walkthrough")) {
            type = "walkthrough";
          } else if (subtitle.includes("ar") || titleLower.includes("ar")) {
            type = "ar";
          } else {
            type = "vr360";
          }
        } else if (dbCat === "BIM") {
          type = "digital";
        } else { // 3DCG
          if (subtitle.includes("composite") || titleLower.includes("composite")) {
            type = "composite";
          } else if (subtitle.includes("model") || titleLower.includes("model")) {
            type = "digital";
          } else {
            type = "still";
          }
        }
      }

      // Map Subtitle/Title to Architectural Category
      let category: WorkCategory = (w.buildingCategory as WorkCategory) || "residential";
      if (!w.buildingCategory) {
        if (subtitle.includes("residence") || subtitle.includes("house") || subtitle.includes("villa") || subtitle.includes("home") ||
            titleLower.includes("residence") || titleLower.includes("house") || titleLower.includes("villa") || titleLower.includes("home")) {
          category = "residential";
        } else if (subtitle.includes("apartment") || subtitle.includes("condo") || subtitle.includes("mansion") ||
                   titleLower.includes("apartment") || titleLower.includes("condo") || titleLower.includes("mansion")) {
          category = "apartment";
        } else if (subtitle.includes("resort") || subtitle.includes("hotel") || subtitle.includes("pool") || subtitle.includes("sauna") ||
                   titleLower.includes("resort") || titleLower.includes("hotel") || titleLower.includes("pool") || titleLower.includes("sauna")) {
          category = "resort";
        } else if (subtitle.includes("commercial") || subtitle.includes("mall") || subtitle.includes("showroom") || subtitle.includes("shop") || subtitle.includes("store") ||
                   titleLower.includes("commercial") || titleLower.includes("mall") || titleLower.includes("showroom") || titleLower.includes("shop") || titleLower.includes("store")) {
          category = "commercial";
        } else if (subtitle.includes("office") || subtitle.includes("workspace") || subtitle.includes("tower") ||
                   titleLower.includes("office") || titleLower.includes("workspace") || titleLower.includes("tower")) {
          category = "office";
        } else if (subtitle.includes("library") || subtitle.includes("public") || subtitle.includes("museum") || subtitle.includes("temple") || subtitle.includes("facility") ||
                   titleLower.includes("library") || titleLower.includes("public") || titleLower.includes("museum") || titleLower.includes("temple") || titleLower.includes("facility")) {
          category = "public";
        } else if (subtitle.includes("urban") || subtitle.includes("city") || subtitle.includes("landscape") || subtitle.includes("street") || subtitle.includes("plan") ||
                   titleLower.includes("urban") || titleLower.includes("city") || titleLower.includes("landscape") || titleLower.includes("street") || titleLower.includes("plan")) {
          category = "urban";
        } else {
          const categories: WorkCategory[] = ["residential", "resort", "commercial", "public"];
          category = categories[index % categories.length];
        }
      }

      // Span layout
      const span = (category === "residential" || category === "resort" || category === "public") ? "wide" : "narrow";

      return {
        id: w.id,
        title,
        type,
        category,
        image: w.image,
        videoUrl: w.videoUrl,
        bg: placeholderColors[index % placeholderColors.length],
        span: span as "wide" | "narrow"
      };
    });
  }, [initialWorks, locale]);

  const filtered = useMemo(() => {
    return mappedWorks.filter((w) => {
      const typeOk = selectedTypes.length === 0 || selectedTypes.includes(w.type);
      const catOk = selectedCats.length === 0 || selectedCats.includes(w.category);
      return typeOk && catOk;
    });
  }, [mappedWorks, selectedTypes, selectedCats]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex px-[60px] pt-[80px] pb-16 gap-12">
        {/* ========== SIDEBAR ========== */}
        <aside className="w-[260px] shrink-0 hidden md:block">
          {/* Page title */}
          <h1 className="text-[32px] font-normal text-[#111] mb-8">{t("title")}</h1>

          {/* Filter heading */}
          <div className="text-[16px] font-medium text-[#111] mb-1">{t("filter")}</div>
          <div className="border-b-[0.5px] border-[#e0e0e0] mb-6" />

          {/* TYPE group */}
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#999] mb-4">
            {t("typeLabel")}
          </div>
          <div className="flex flex-col gap-0">
            {TYPE_KEYS.map((key) => (
              <FilterCheckbox
                key={key}
                checked={selectedTypes.includes(key)}
                label={t(`types.${key}`)}
                onChange={() => toggleType(key)}
              />
            ))}
          </div>
          <div className="border-b-[0.5px] border-[#e0e0e0] my-6" />

          {/* CATEGORY group */}
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#999] mb-4">
            {t("categoryLabel")}
          </div>
          <div className="flex flex-col gap-0">
            {CAT_KEYS.map((key) => (
              <FilterCheckbox
                key={key}
                checked={selectedCats.includes(key)}
                label={t(`categories.${key}`)}
                onChange={() => toggleCat(key)}
              />
            ))}
          </div>
        </aside>

        {/* ========== MASONRY GRID ========== */}
        <main className="flex-1 min-w-0">
          {/* Mobile: page title */}
          <h1 className="text-[32px] font-normal text-[#111] mb-6 md:hidden">{t("title")}</h1>

          {filtered.length === 0 ? (
            <p className="text-[14px] text-[#999] mt-8">{t("emptyState")}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Group items: 4 portrait + 1 wide, repeat */}
              {Array.from({ length: Math.ceil(filtered.length / 5) }).map((_, groupIdx) => {
                const start = groupIdx * 5;
                const portraitItems = filtered.slice(start, start + 4);
                const wideItem = filtered[start + 4];

                return (
                  <div key={groupIdx}>
                    {/* 4 portrait images — 3:5 ratio */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {portraitItems.map((work) => (
                        <div
                          key={work.id}
                          onClick={() => {
                            if (work.videoUrl) {
                              setLightbox({ src: work.videoUrl, alt: work.title, isVideo: true, type: work.type });
                            } else if (work.image) {
                              setLightbox({ src: work.image, alt: work.title, type: work.type });
                            }
                          }}
                          className="relative overflow-hidden group cursor-pointer aspect-[3/5]"
                        >
                          <div
                            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{
                              backgroundColor: work.bg,
                              backgroundImage: work.image ? `url(${work.image})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-center pb-10 p-4">
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-center">
                              <div className="text-white text-[18px] font-semibold tracking-wide">{work.title}</div>
                              <div className="text-white/70 text-[14px] mt-1.5">
                                {t(`types.${work.type}`)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 1 wide image — 16:9 ratio */}
                    {wideItem && (
                      <div
                        className="relative overflow-hidden group cursor-pointer aspect-[16/9] mt-3"
                        onClick={() => {
                          if (wideItem.videoUrl) {
                            setLightbox({ src: wideItem.videoUrl, alt: wideItem.title, isVideo: true, type: wideItem.type });
                          } else if (wideItem.image) {
                            setLightbox({ src: wideItem.image, alt: wideItem.title, type: wideItem.type });
                          }
                        }}
                      >
                        <div
                          className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]"
                          style={{
                            backgroundColor: wideItem.bg,
                            backgroundImage: wideItem.image ? `url(${wideItem.image})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-center pb-10 p-4">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-center">
                            <div className="text-white text-[20px] font-semibold tracking-wide">{wideItem.title}</div>
                            <div className="text-white/70 text-[14px] mt-1.5">
                              {t(`types.${wideItem.type}`)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isVideo={lightbox.isVideo}
          type={lightbox.type}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
