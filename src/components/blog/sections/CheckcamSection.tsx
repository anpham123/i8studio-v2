export interface SectionData {
  type: "checkcam" | "stage" | "comparison" | "insight";
  num: string;
  eyebrow?: string;
  eyebrowBadge?: string;
  title: string;
  body: string[];
  image?: string;
  reverse?: boolean;
  caption?: string;
  additionalImages?: string[];
  tags?: {
    label?: string;
    ok?: string[];
    ng?: string[];
  };
  grid?: { label: string; image?: string }[];
}

export default function CheckcamSection({ data, locale = "ja" }: { data: SectionData; locale?: string }) {
  const checkLabel = locale === "ja" ? "確認できること" : "What can be confirmed";
  const missingLabel = locale === "ja" ? "まだ不足している要素" : "Elements still missing";
  return (
    <section className="bg-[#faf8f3] text-[var(--ink)] py-[70px] sm:py-[100px]">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-12 sm:mb-16">
          <div className="font-display text-[80px] sm:text-[120px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
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
                  {data.eyebrowBadge}
                </span>
              )}
            </div>
            <h2
              className="font-serif text-[28px] sm:text-[36px] font-medium leading-[1.4]"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
          </div>
        </div>

        {/* Main image (if provided and no grid) */}
        {data.image && (!data.grid || data.grid.length === 0) && (
          <div className="relative aspect-[16/9] mb-12 rounded-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.title.replace(/<[^>]*>/g, "")} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 5-cell grid */}
        {data.grid && data.grid.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12 sm:mb-16">
            {data.grid.map((cell, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-gradient-to-br from-[#f0ede6] to-[#e8e4dc] border border-[var(--line)] overflow-hidden rounded-sm"
              >
                {cell.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cell.image}
                    alt={cell.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 bg-white/80 text-[var(--ink)] px-2 py-1 text-[10px] tracking-wider rounded-sm">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Body + tags */}
        {(() => {
          const hasTags = data.tags && (
            (data.tags.ok && data.tags.ok.length > 0) ||
            (data.tags.ng && data.tags.ng.length > 0)
          );
          return (
            <div className={hasTags ? "grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12" : ""}>
              <div className="blog-content">
                {data.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-[var(--ink-light)] leading-[1.9] mb-4 text-[14px] sm:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </div>
              {hasTags && data.tags && (
                <div>
                  {data.tags.ok && data.tags.ok.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-[0.16em] block mb-3">
                        {data.tags.label || checkLabel}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.ok.map((t, i) => (
                          <span
                            key={i}
                            className="border border-[var(--accent)]/40 text-[var(--accent-light)] text-[12px] px-3 py-1 rounded-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.tags.ng && data.tags.ng.length > 0 && (
                    <div>
                      <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-[0.16em] block mb-3">
                        {missingLabel}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.ng.map((t, i) => (
                          <span
                            key={i}
                            className="border border-red-400/30 text-red-300/80 text-[12px] px-3 py-1 rounded-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

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
