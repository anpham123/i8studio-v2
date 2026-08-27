import { sanitizeHtml } from "@/lib/sanitize";
import { translateBlogEyebrow, translateBlogBadge } from "@/lib/blog-categories";
import type { SectionData } from "./CheckcamSection";

export default function StageSection({ data, locale = "ja" }: { data: SectionData; locale?: string }) {
  const isJa = locale === "ja";
  const improvedLabel = isJa ? "改善された点" : "Improvements made";
  const missingLabel = isJa ? "まだ不足している要素" : "Elements still missing";
  const hasImage = Boolean(data?.image);
  const bodyParagraphs = Array.isArray(data?.body) ? data.body : (data?.body ? [data.body] : []);

  return (
    <section className="bg-[var(--surface)] py-[45px] sm:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        <div
          className={
            hasImage
              ? `grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center ${data?.reverse ? "lg:[&>*:first-child]:order-2" : ""
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
                  alt={data?.title ? data.title.replace(/<[^>]*>/g, "") : "Section image"}
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
              {data?.num && (
                <div className="font-roboto text-[48px] sm:text-[64px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
                  {data.num}
                </div>
              )}
              <div className="flex-1">
                {(data?.eyebrow || data?.eyebrowBadge) && (
                  <div className="flex items-center gap-3 mb-4">
                    {data?.eyebrow && (
                      <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em] font-medium">
                        {translateBlogEyebrow(data.eyebrow, isJa)}
                      </span>
                    )}
                    {data?.eyebrowBadge && (
                      <span className="bg-[var(--accent)] text-black text-[10px] px-2 py-1 rounded font-medium">
                        {translateBlogBadge(data.eyebrowBadge, isJa)}
                      </span>
                    )}
                  </div>
                )}
                {data?.title && (
                  <h2
                    className="font-serif lining-nums text-[20px] sm:text-[26px] font-bold leading-[1.4] text-[var(--ink)]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
                  />
                )}
              </div>
            </div>

            <div
              className="blog-content text-[#111] leading-[1.9] text-[14px] sm:text-[15px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyParagraphs.join("\n")) }}
            />

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
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
              {data.additionalImages.map((item, i) => {
                const imgSrc = typeof item === "string" ? item : item.image;
                const imgCap = typeof item === "string" ? (data.additionalImageCaptions?.[i] || "") : (item.caption || "");

                return (
                  <div key={i} className="flex flex-col bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    <div className="h-[180px] sm:h-[200px] w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgCap || `${data.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} - ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 block drop-shadow-xs"
                      />
                    </div>
                    {imgCap && (
                      <p
                        className="text-[12px] sm:text-[13px] text-[var(--ink-muted)] italic p-2 text-center leading-relaxed border-t border-gray-100 bg-white mt-auto"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(imgCap) }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
