import { sanitizeHtml } from "@/lib/sanitize";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export default function BlogHero({
  category,
  eyebrow,
  title,
  subtitle,
  heroImage,
  locale = "ja",
}: {
  category: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  locale?: string;
}) {
  const isJa = locale === "ja";
  const categoryLabel = isJa ? "カテゴリー" : "Category";
  const catObj = BLOG_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === (category || "").toLowerCase() ||
      c.aliases?.some((a) => a.toLowerCase() === (category || "").toLowerCase()) ||
      c.nameEn.toLowerCase() === (category || "").toLowerCase()
  );
  const localizedCategory = isJa ? (catObj?.nameJa || category) : (catObj?.nameEn || category);

  const getEyebrowText = (eb?: string) => {
    if (!eb) return "";
    if (!isJa) return eb;
    const map: Record<string, string> = {
      "i8 Life Gallery": "i8 ライフギャラリー",
      "I8 LIFE GALLERY": "i8 ライフギャラリー",
      "Process Case Study · 2026": "プロセス・ケーススタディ · 2026",
      "Architectural Visualization": "建築ビジュアライゼーション",
      "Architectural Visualization ": "建築ビジュアライゼーション",
    };
    return map[eb.trim()] || eb;
  };

  return (
    <section className="relative">
      {/* Eyebrow top-right */}
      {eyebrow && (
        <div className="absolute top-8 right-6 sm:right-10 lg:right-12 z-20 text-white/60 text-[11px] uppercase tracking-[0.24em]">
          {getEyebrowText(eyebrow)}
        </div>
      )}

      {/* Hero image — full-viewport like About Us */}
      <div className="relative w-full h-[calc(100vh-var(--header-h,76px))] min-h-[600px] max-h-[1200px] overflow-hidden">
        {heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0c0a] via-[#1e1b14] to-[#2a2318]" />
        )}
        {/* Bottom fade gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,147,90,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,147,90,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Title section BELOW image */}
      <div className="bg-[var(--surface)] pt-10 sm:pt-14 pb-2 sm:pb-4">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          {/* Title - Single line on desktop */}
          <h1
            className="font-serif text-[clamp(22px,3.2vw,40px)] font-semibold leading-[1.3] tracking-tight text-[#111] mb-4 max-w-full [&>br]:hidden md:[&>br]:inline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(title.replace(/<br\s*\/?>/gi, " ")) }}
          />

          {/* Subtitle - Single line on desktop */}
          {subtitle && (
            <p
              className="font-serif text-[16px] sm:text-[18px] lg:text-[20px] text-[#444] font-medium leading-[1.65] max-w-full mb-4 tracking-normal [&>br]:hidden md:[&>br]:inline"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  subtitle
                    .replace(/<br\s*\/?>/gi, " ")
                    .replace(/\r?\n+/g, " ")
                    .trim()
                ),
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

