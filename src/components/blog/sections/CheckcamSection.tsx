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

export default function CheckcamSection({ data }: { data: SectionData }) {
  return (
    <section className="bg-[#1a1814] text-white py-[70px] sm:py-[100px]">
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
                className="relative aspect-[4/3] bg-gradient-to-br from-[#2a2520] to-[#1a1814] border border-white/10 overflow-hidden rounded-sm"
              >
                {cell.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cell.image}
                    alt={cell.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-[10px] tracking-wider rounded-sm">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2-column body + tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div className="blog-content">
            {data.body.map((p, i) => (
              <p
                key={i}
                className="text-white/70 leading-[1.9] mb-4 text-[14px] sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
          {data.tags && (
            <div>
              {data.tags.ok && data.tags.ok.length > 0 && (
                <div className="mb-6">
                  <span className="text-white/40 text-[11px] uppercase tracking-[0.16em] block mb-3">
                    {data.tags.label || "確認できること"}
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
                  <span className="text-white/40 text-[11px] uppercase tracking-[0.16em] block mb-3">
                    まだ不足している要素
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
