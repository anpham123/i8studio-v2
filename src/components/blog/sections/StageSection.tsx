import { sanitizeHtml } from "@/lib/sanitize";
import type { SectionData } from "./CheckcamSection";

export default function StageSection({ data, locale = "ja" }: { data: SectionData; locale?: string }) {
  const improvedLabel = locale === "ja" ? "改善された点" : "Improvements made";
  const missingLabel = locale === "ja" ? "まだ不足している要素" : "Elements still missing";
  const hasImage = Boolean(data.image);

  return (
    <section className="bg-[var(--surface)] py-[45px] sm:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        <div
          className={
            hasImage
              ? `grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center ${
                  data.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`
              : ""
          }
        >
          {/* Image column (only when image exists) */}
          {hasImage && (
            <div className="relative">
              <div className="w-full bg-[var(--surface-warm)]/60 rounded-lg overflow-hidden border border-gray-200/40 p-2 sm:p-3 flex flex-col items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.image}
                  alt={data.title.replace(/<[^>]*>/g, "")}
                  className="w-full h-auto max-h-[600px] object-contain rounded"
                />
                {data.caption && (
                  <p
                    className="w-full text-[12px] sm:text-[13px] text-[var(--ink-muted)] italic mt-2.5 pt-2 border-t border-gray-200/60 text-center leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.caption) }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Text column */}
          <div>
            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8">
              <div className="font-display text-[48px] sm:text-[64px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
                {data.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {data.eyebrow && (
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em]">
                      {data.eyebrow}
                    </span>
                  )}
                  {data.eyebrowBadge && (
                    <span className="bg-[var(--accent)] text-black text-[10px] px-2 py-1 rounded">
                      {data.eyebrowBadge.trim()}
                    </span>
                  )}
                </div>
                <h2
                  className="font-serif lining-nums text-[20px] sm:text-[26px] font-medium leading-[1.4] text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
                />
              </div>
            </div>

            <div className="blog-content">
              {data.body.map((p, i) => (
                <div
                  key={i}
                  className="text-[#111] leading-[1.9] mb-4 text-[14px] sm:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(p) }}
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
          <div
            className={`mt-10 ${
              data.additionalImages.length === 1
                ? "w-full"
                : data.additionalImages.length === 2
                ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                : data.additionalImages.length === 3
                ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            }`}
          >
            {data.additionalImages.map((item, i) => {
              const imgSrc = typeof item === "string" ? item : item.image;
              const imgCap = typeof item === "string" ? (data.additionalImageCaptions?.[i] || "") : (item.caption || "");

              return (
                <div key={i} className="flex flex-col">
                  <div
                    className={`rounded-lg overflow-hidden border border-gray-200/40 shadow-sm bg-[var(--surface-warm)] ${
                      data.additionalImages!.length === 1 ? "w-full aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={imgCap || `${data.title.replace(/<[^>]*>/g, "")} - ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {imgCap && (
                    <p
                      className="text-[12px] sm:text-[13px] text-[var(--ink-muted)] italic mt-2 text-center leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(imgCap) }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
