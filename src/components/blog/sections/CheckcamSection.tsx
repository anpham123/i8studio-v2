import { sanitizeHtml } from "@/lib/sanitize";
import { translateBlogEyebrow, translateBlogBadge } from "@/lib/blog-categories";

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
  additionalImages?: (string | { image: string; caption?: string })[];
  additionalImageCaptions?: string[];
  tags?: {
    label?: string;
    ok?: string[];
    ng?: string[];
  };
  grid?: { label: string; image?: string }[];
}

function renderFormattedBody(paragraphs: string[]) {
  return paragraphs.map((para, pIdx) => {
    const raw = (para || "").trim();
    if (!raw) return null;

    const lines = raw.split(/<br\s*\/?>|\r?\n/).map((l) => l.trim()).filter(Boolean);
    const hasBullets = lines.some((l) => l.startsWith("・") || l.startsWith("-") || l.startsWith("•") || l.startsWith("*"));

    if (hasBullets) {
      const normalLines: string[] = [];
      const bulletItems: string[] = [];
      let headerText = "";

      for (const line of lines) {
        if (line.startsWith("・") || line.startsWith("-") || line.startsWith("•") || line.startsWith("*")) {
          bulletItems.push(line.replace(/^[・\-•*]\s*/, ""));
        } else if (bulletItems.length === 0) {
          if (
            line.endsWith("内容") ||
            line.endsWith("項目") ||
            line.endsWith("ポイント") ||
            line.endsWith("Points") ||
            line.endsWith("Items") ||
            line.endsWith(":") ||
            line.endsWith("：")
          ) {
            headerText = line;
          } else {
            normalLines.push(line);
          }
        } else {
          normalLines.push(line);
        }
      }

      return (
        <div key={pIdx} className="space-y-4 my-4">
          {normalLines.length > 0 && (
            <div
              className="text-[#222] text-[15.5px] sm:text-[16.5px] leading-[1.95]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(normalLines.join("<br/>")) }}
            />
          )}

          {bulletItems.length > 0 && (
            <div className="bg-[#fafaf9] border border-gray-200/80 rounded-none p-5 sm:p-7 shadow-xs my-5">
              {headerText && (
                <div className="font-serif font-bold text-[15px] sm:text-[16.5px] text-[#111] mb-4 pb-2.5 border-b border-gray-200/60 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b8935a]" />
                  <span>{headerText}</span>
                </div>
              )}
              <ul className="space-y-3">
                {bulletItems.map((item, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 text-[14.5px] sm:text-[15.5px] text-[#333] leading-relaxed">
                    <span className="text-[#b8935a] font-bold text-base select-none shrink-0 mt-0.5">•</span>
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={pIdx}
        className="text-[#222] text-[15.5px] sm:text-[16.5px] leading-[1.95] mb-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(raw) }}
      />
    );
  });
}

export default function CheckcamSection({ data, locale = "ja" }: { data: SectionData; locale?: string }) {
  const checkLabel = locale === "ja" ? "確認できること" : "What can be confirmed";
  const missingLabel = locale === "ja" ? "まだ不足している要素" : "Elements still missing";
  const bodyParagraphs = Array.isArray(data?.body) ? data.body : (data?.body ? [data.body] : []);

  return (
    <section className="bg-[var(--surface)] py-[24px] sm:py-[32px]">
      <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* 1. Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          {data?.num && (
            <div className="font-roboto text-[48px] sm:text-[62px] leading-none text-[#111] font-black tracking-tight shrink-0 select-none">
              {data.num}
            </div>
          )}
          <div className="flex-1">
            {(data?.eyebrow || data?.eyebrowBadge) && (
              <div className="flex items-center gap-2.5 mb-2">
                {data?.eyebrow && (
                  <span className="text-[#b8935a] text-[11.5px] uppercase tracking-[0.2em] font-bold">
                    {translateBlogEyebrow(data.eyebrow, locale === "ja")}
                  </span>
                )}
                {data?.eyebrowBadge && (
                  <span className="bg-[#b8935a] text-white text-[10px] px-2.5 py-0.5 rounded-none font-bold uppercase tracking-wider">
                    {translateBlogBadge(data.eyebrowBadge, locale === "ja")}
                  </span>
                )}
              </div>
            )}
            {data?.title && (
              <h2
                className="font-serif lining-nums text-[24px] sm:text-[28px] font-bold leading-[1.35] text-[#111]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
              />
            )}
          </div>
        </div>

        {/* 2. Main image (if provided and no grid, rounded-none) */}
        {data.image && (!data.grid || data.grid.length === 0) && (
          <div className="w-full bg-white rounded-none overflow-hidden border border-gray-200/90 shadow-xs flex flex-col mb-8 hover:shadow-md transition-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} className="w-full h-auto max-h-[580px] object-cover block rounded-none" />
            {data.caption && (
              <p
                className="w-full text-[13px] text-gray-600 italic py-2.5 px-4 border-t border-gray-100 bg-[#fafaf8] text-center leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.caption) }}
              />
            )}
          </div>
        )}

        {/* 3. 5-cell grid */}
        {data.grid && data.grid.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
            {data.grid.map((cell, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-gradient-to-br from-[#f0ede6] to-[#e8e4dc] border border-gray-200/90 overflow-hidden rounded-none shadow-2xs group"
              >
                {cell.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cell.image}
                    alt={cell.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                  />
                )}
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white px-2.5 py-0.5 text-[10.5px] font-medium tracking-wider rounded-none">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Structured Body Content */}
        <div className="space-y-4">
          {renderFormattedBody(bodyParagraphs)}
        </div>

        {/* 5. Tags */}
        {data.tags && (
          <div className="mt-8 space-y-4 pt-4">
            {data.tags.ok && data.tags.ok.length > 0 && (
              <div>
                <span className="text-gray-600 text-[11.5px] uppercase tracking-[0.16em] font-bold block mb-2.5">
                  ✓ {data.tags.label || checkLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.tags.ok.map((t, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12.5px] px-3.5 py-1 rounded-none font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.tags.ng && data.tags.ng.length > 0 && (
              <div>
                <span className="text-gray-600 text-[11.5px] uppercase tracking-[0.16em] font-bold block mb-2.5">
                  ✕ {missingLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.tags.ng.map((t, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 border border-amber-200 text-amber-800 text-[12.5px] px-3 py-1 rounded-none font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Additional images */}
        {data.additionalImages && data.additionalImages.length > 0 && (
          <div className="mt-8 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-stretch">
              {data.additionalImages.map((item, i) => {
                const imgSrc = typeof item === "string" ? item : item.image;
                const imgCap = typeof item === "string" ? (data.additionalImageCaptions?.[i] || "") : (item.caption || "");

                return (
                  <div key={i} className="flex flex-col bg-white rounded-none border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    <div className="h-[200px] sm:h-[220px] w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgCap || `${data.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} - ${i + 1}`}
                        className="w-full h-full object-cover rounded-none hover:scale-105 transition-transform duration-300 block drop-shadow-xs"
                      />
                    </div>
                    {imgCap && (
                      <p
                        className="text-[12px] text-gray-500 italic p-2 text-center leading-relaxed border-t border-gray-100 bg-white mt-auto font-serif"
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
