import { sanitizeHtml } from "@/lib/sanitize";
import { translateBlogEyebrow, translateBlogBadge } from "@/lib/blog-categories";
import type { SectionData } from "./CheckcamSection";

export default function ComparisonSection({
  data,
  before: propBefore,
  after: propAfter,
  locale = "ja",
}: {
  data?: SectionData;
  before?: string;
  after?: string;
  locale?: string;
}) {
  const isJa = locale === "ja";
  const firstAdditional =
    Array.isArray(data?.additionalImages) && data.additionalImages.length > 0
      ? typeof data.additionalImages[0] === "string"
        ? data.additionalImages[0]
        : data.additionalImages[0].image
      : "";

  const before = propBefore || data?.image || "";
  const after = propAfter || firstAdditional || "";

  // The remaining additional images to render at the bottom (excluding the 1st one if it was used for the comparison pair)
  const isComparisonPair = Boolean(before && after && before !== after);
  const remainingImages = isComparisonPair
    ? (data?.additionalImages && data.additionalImages.length > 1 ? data.additionalImages.slice(1) : [])
    : (data?.additionalImages || []);
  const remainingCaptions = isComparisonPair
    ? (data?.additionalImageCaptions && data.additionalImageCaptions.length > 1 ? data.additionalImageCaptions.slice(1) : [])
    : (data?.additionalImageCaptions || []);

  const bodyParagraphs = Array.isArray(data?.body) ? data.body : data?.body ? [data.body] : [];
  const hasImages = Boolean(before || after);

  if (!hasImages && !data?.title && bodyParagraphs.length === 0) return null;

  return (
    <section className="bg-[var(--surface)] py-[45px] sm:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        {/* Optional Header from Section Data */}
        {data && (data.title || data.num || data.eyebrow) && (
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8 sm:mb-12">
            {data.num && (
              <div className="font-roboto text-[48px] sm:text-[64px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
                {data.num}
              </div>
            )}
            <div className="flex-1">
              {(data.eyebrow || data.eyebrowBadge) && (
                <div className="flex items-center gap-3 mb-4">
                  {data.eyebrow && (
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em] font-medium">
                      {translateBlogEyebrow(data.eyebrow, isJa)}
                    </span>
                  )}
                  {data.eyebrowBadge && (
                    <span className="bg-[var(--accent)] text-black text-[10px] px-2 py-1 rounded font-medium">
                      {translateBlogBadge(data.eyebrowBadge, isJa)}
                    </span>
                  )}
                </div>
              )}
              {data.title && (
                <h2
                  className="font-serif lining-nums text-[20px] sm:text-[26px] font-bold leading-[1.4] text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
                />
              )}
            </div>
          </div>
        )}

        {/* Body Paragraphs & Tables */}
        {bodyParagraphs.length > 0 && (
          <div
            className="blog-content mb-10 max-w-[900px] text-[#111] leading-[1.9] text-[14px] sm:text-[15px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyParagraphs.join("\n")) }}
          />
        )}

        {/* Comparison Images Grid */}
        {hasImages && (
          <div>
            {!data && (
              <div className="text-center mb-10">
                <h3 className="font-serif text-[22px] sm:text-[28px] font-medium text-[var(--ink)]">
                  Before → After
                </h3>
              </div>
            )}
            <div className={`grid ${before && after && before !== after ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-[800px]"} gap-6`}>
              {before && (
                <div className="relative">
                  {before !== after && (
                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-sm z-10">
                      Before
                    </span>
                  )}
                  {before.startsWith("/") || before.startsWith("http") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={before}
                      alt="Before"
                      className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-[var(--surface-warm)] rounded-sm flex items-center justify-center p-8">
                      <p className="text-[var(--ink-light)] text-sm leading-relaxed">{before}</p>
                    </div>
                  )}
                </div>
              )}
              {after && before !== after && (
                <div className="relative">
                  <span className="absolute top-3 left-3 bg-[var(--accent)] text-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-sm z-10">
                    After
                  </span>
                  {after.startsWith("/") || after.startsWith("http") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={after}
                      alt="After"
                      className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-[var(--surface-warm)] rounded-sm flex items-center justify-center p-8">
                      <p className="text-[var(--ink-light)] text-sm leading-relaxed">{after}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional images */}
        {remainingImages && remainingImages.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {remainingImages.map((item, i) => {
                const imgSrc = typeof item === "string" ? item : item.image;
                const imgCap = typeof item === "string" ? (remainingCaptions?.[i] || "") : (item.caption || "");

                return (
                  <div key={i} className="flex flex-col bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    <div className="h-[180px] sm:h-[200px] w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgCap || `${data?.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} - ${i + 1}`}
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
