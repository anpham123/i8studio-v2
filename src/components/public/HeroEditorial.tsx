"use client";

import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Masonry image data                                                 */
/* ------------------------------------------------------------------ */
interface HeroImage {
  bg: string;
  alt: string;
  span: string;        // Tailwind grid span classes
  aspect: string;      // aspect-ratio class
  imageUrl?: string;
}

const heroImages: HeroImage[] = [
  { bg: "#c8c2b8", alt: "Exterior building",  span: "col-span-1",                aspect: "aspect-[4/3]" },
  { bg: "#b8b0a4", alt: "Plaza view",         span: "col-span-2",                aspect: "aspect-[16/9]" },
  { bg: "#a8a498", alt: "Aerial shot",        span: "col-span-1",                aspect: "aspect-[3/4]" },
  { bg: "#d4cec4", alt: "Pool interior",      span: "col-span-1",                aspect: "aspect-[4/3]" },
  { bg: "#bcb8ae", alt: "Autumn scene",       span: "col-span-1",                aspect: "aspect-[1/1]" },
  { bg: "#c4c0b8", alt: "Night scene",        span: "col-span-2",                aspect: "aspect-[21/9]" },
  { bg: "#d0c8be", alt: "Garden view",        span: "col-span-1",                aspect: "aspect-[4/3]" },
  { bg: "#bab4aa", alt: "Interior living",    span: "col-span-1",                aspect: "aspect-[3/4]" },
  { bg: "#ccc6bc", alt: "Residential facade", span: "col-span-2",                aspect: "aspect-[16/9]" },
  { bg: "#a4a098", alt: "Rooftop view",       span: "col-span-1",                aspect: "aspect-[4/3]" },
  { bg: "#b0aca2", alt: "Commercial tower",   span: "col-span-1",                aspect: "aspect-[1/1]" },
  { bg: "#c0bab0", alt: "Urban landscape",    span: "col-span-1",                aspect: "aspect-[4/3]" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroEditorial() {
  const t = useTranslations("home");

  return (
    <section className="bg-white">
      {/* ========== TEXT ========== */}
      <div className="max-w-[900px] mx-auto text-center pt-[88px] pb-12 px-6">
        {/* Main heading — serif */}
        <h1 className="font-serif text-[64px] md:text-[72px] font-normal text-[#111] tracking-[0.02em] leading-[1.1] mb-5">
          {t("hero.title")}
        </h1>

        {/* Japanese subtitle — serif */}
        <p className="font-serif text-[28px] md:text-[32px] font-light text-[#222] tracking-[0.12em] mb-8">
          {t("hero.subtitle")}
        </p>

        {/* Description */}
        <p className="text-[14px] text-[#888] leading-[2] max-w-[640px] mx-auto whitespace-pre-line">
          {t("hero.description")}
        </p>
      </div>

      {/* ========== MASONRY GRID ========== */}
      <div className="max-w-[1400px] mx-auto px-[60px] pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className={`${img.span} ${img.aspect} relative overflow-hidden rounded-sm`}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundColor: img.bg,
                  backgroundImage: img.imageUrl
                    ? `url(${img.imageUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
