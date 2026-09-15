import { sanitizeHtml } from "@/lib/sanitize";
import { translateBlogEyebrow, translateBlogBadge } from "@/lib/blog-categories";
import BlogAdditionalGallery from "@/components/blog/BlogAdditionalGallery";
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
    <section className="bg-[var(--surface)] py-[24px] sm:py-[32px]">
      <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-0">
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

        {/* Comparison Images Grid (Full view for both portrait and landscape) */}
        {hasImages && (
          <div>
            {!data && (
              <div className="text-center mb-10">
                <h3 className="font-serif text-[22px] sm:text-[28px] font-medium text-[var(--ink)]">
                  Before → After
                </h3>
              </div>
            )}
            <div className={`grid ${before && after && before !== after ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-[800px]"} gap-6 items-start`}>
              {before && (
                <div className="relative bg-white border border-gray-200/90 overflow-hidden rounded-none shadow-xs flex flex-col items-center justify-center">
                  {before !== after && (
                    <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10.5px] uppercase tracking-wider px-3 py-1 rounded-none z-10 font-bold">
                      Before
                    </span>
                  )}
                  {before.startsWith("/") || before.startsWith("http") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={before}
                      alt="Before"
                      className="w-full h-auto object-contain block rounded-none"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[var(--surface-warm)] rounded-none flex items-center justify-center p-8">
                      <p className="text-[var(--ink-light)] text-sm leading-relaxed">{before}</p>
                    </div>
                  )}
                </div>
              )}
              {after && before !== after && (
                <div className="relative bg-white border border-gray-200/90 overflow-hidden rounded-none shadow-xs flex flex-col items-center justify-center">
                  <span className="absolute top-3 left-3 bg-[#b8935a] text-white text-[10.5px] uppercase tracking-wider px-3 py-1 rounded-none z-10 font-bold">
                    After
                  </span>
                  {after.startsWith("/") || after.startsWith("http") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={after}
                      alt="After"
                      className="w-full h-auto object-contain block rounded-none"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[var(--surface-warm)] rounded-none flex items-center justify-center p-8">
                      <p className="text-[var(--ink-light)] text-sm leading-relaxed">{after}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional images (Bento / Masonry with Full-View) */}
        <BlogAdditionalGallery
          images={remainingImages}
          captions={remainingCaptions}
          sectionTitle={data?.title}
        />
      </div>
    </section>
  );
}
