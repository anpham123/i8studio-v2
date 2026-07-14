import type { SectionData } from "./CheckcamSection";

export default function StageSection({ data, locale = "ja" }: { data: SectionData; locale?: string }) {
  const improvedLabel = locale === "ja" ? "改善された点" : "Improvements made";
  const missingLabel = locale === "ja" ? "まだ不足している要素" : "Elements still missing";
  return (
    <section className="bg-[var(--surface)] py-[70px] sm:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center ${
            data.reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Image column */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[var(--surface-warm)] rounded-sm overflow-hidden">
              {data.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={data.image}
                  alt={data.title.replace(/<[^>]*>/g, "")}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {data.caption && (
              <p className="text-[12px] text-[var(--ink-muted)] italic mt-3 leading-relaxed">
                {data.caption}
              </p>
            )}
          </div>

          {/* Text column */}
          <div>
            <div className="font-display text-[60px] sm:text-[80px] leading-none text-[var(--accent)]/40 font-bold tracking-tight mb-4">
              {data.num}
            </div>

            <div className="flex items-center gap-3 mb-6">
              {data.eyebrow && (
                <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em]">
                  {data.eyebrow}
                </span>
              )}
              {data.eyebrowBadge && (
                <span className="bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] px-2 py-1 rounded">
                  {data.eyebrowBadge}
                </span>
              )}
            </div>

            <h2
              className="font-serif text-[26px] sm:text-[32px] font-medium leading-[1.4] text-[var(--ink)] mb-8"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />

            <div className="blog-content">
              {data.body.map((p, i) => (
                <p
                  key={i}
                  className="text-[var(--ink-light)] leading-[2] mb-5 text-[14px] sm:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>

            {data.tags && (
              <div className="mt-8">
                {data.tags.ok && data.tags.ok.length > 0 && (
                  <>
                    <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-[0.16em] block mb-3">
                      {improvedLabel}
                    </span>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {data.tags.ok.map((t, i) => (
                        <span
                          key={i}
                          className="border border-[var(--accent)]/40 text-[var(--accent)] text-[12px] px-3 py-1 rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {data.tags.ng && data.tags.ng.length > 0 && (
                  <>
                    <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-[0.16em] block mb-3">
                      {missingLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.ng.map((t, i) => (
                        <span
                          key={i}
                          className="border border-red-400/40 text-red-500/70 text-[12px] px-3 py-1 rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional images */}
        {data.additionalImages && data.additionalImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-12">
            {data.additionalImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${data.title.replace(/<[^>]*>/g, "")} - ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
