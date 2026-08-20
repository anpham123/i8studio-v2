import { sanitizeHtml } from "@/lib/sanitize";

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
  const categoryLabel = locale === "ja" ? "カテゴリー" : "Category";

  return (
    <section className="relative">
      {/* Eyebrow top-right */}
      {eyebrow && (
        <div className="absolute top-8 right-6 sm:right-10 lg:right-12 z-20 text-white/60 text-[11px] uppercase tracking-[0.24em]">
          {eyebrow}
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
        <div className="max-w-[760px] mx-auto px-6 sm:px-10">
          {/* Category */}
          {category && (
            <div className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em] mb-4">
              <span className="opacity-60 text-[var(--ink-muted)]">{categoryLabel}</span>
              <span className="ml-3">{category}</span>
            </div>
          )}

          {/* Title */}
          <h1
            className="font-serif text-[clamp(28px,4vw,48px)] font-semibold leading-[1.28] tracking-tight text-[#111] mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
          />

          {/* Subtitle */}
          {subtitle && (
            <p className="font-serif text-[18px] sm:text-[21px] text-[#444] font-medium leading-[1.65] max-w-[720px] mb-4 tracking-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

