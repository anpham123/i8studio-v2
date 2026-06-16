export default function BlogHero({
  category,
  eyebrow,
  title,
  subtitle,
  heroImage,
}: {
  category: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
}) {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0c0a] via-[#1e1b14] to-[#2a2318]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,147,90,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,147,90,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Optional hero image */}
      {heroImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 pb-[80px] sm:pb-[120px] pt-[180px] sm:pt-[200px] w-full">
        {/* Accent line */}
        <div className="h-[1px] w-[80px] bg-[var(--accent)] mb-8" />

        {/* Meta */}
        {category && (
          <div className="flex gap-6 text-[#9a9a9a] text-xs uppercase tracking-[0.2em] mb-10 sm:mb-12">
            <div>
              <span className="opacity-60">カテゴリー</span>
              <span className="ml-3 text-white/80">{category}</span>
            </div>
          </div>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] font-medium">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="font-serif text-white font-light leading-[1.2] text-[clamp(32px,5vw,68px)] mb-8"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {/* Subtitle */}
        {subtitle && (
          <p className="text-white/60 text-[15px] sm:text-[16px] leading-[1.9] max-w-[680px] font-light">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
