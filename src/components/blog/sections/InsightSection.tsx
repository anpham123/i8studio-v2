import { sanitizeHtml } from "@/lib/sanitize";
import type { SectionData } from "./CheckcamSection";

export default function InsightSection({ data }: { data: SectionData }) {
  const bodyParagraphs = Array.isArray(data?.body) ? data.body : (data?.body ? [data.body] : []);
  return (
    <section className="bg-[#fbf6ec] border-y border-[#ebd9be] py-[50px] sm:py-[65px]">
      <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8">
          {data?.num && (
            <div className="font-roboto text-[48px] sm:text-[64px] leading-none text-[#b8935a] font-bold tracking-tight">
              {data.num}
            </div>
          )}
          <div className="flex-1">
            {data?.title && (
              <h3
                className="font-serif lining-nums text-[20px] sm:text-[26px] font-bold leading-[1.4] text-[#111]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
              />
            )}
          </div>
        </div>
        <div
          className="blog-content text-[14px] sm:text-[15px] leading-[1.9] text-[#111]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyParagraphs.join("\n")) }}
        />

        {/* Image if provided */}
        {data.image && (
          <div className="mt-10 aspect-[16/9] rounded-none overflow-hidden border border-gray-200/40 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.title ? data.title.replace(/<[^>]*>/g, "") : "Main image"} className="w-full h-full object-cover rounded-none" />
          </div>
        )}

        {/* Additional images */}
        {data.additionalImages && data.additionalImages.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {data.additionalImages.map((item, i) => {
                const imgSrc = typeof item === "string" ? item : item.image;
                const imgCap = typeof item === "string" ? (data.additionalImageCaptions?.[i] || "") : (item.caption || "");

                return (
                  <div key={i} className="flex flex-col bg-white rounded-none border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    <div className="h-[180px] sm:h-[200px] w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgCap || `${data.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} - ${i + 1}`}
                        className="w-full h-full object-cover rounded-none hover:scale-105 transition-transform duration-300 block drop-shadow-xs"
                      />
                    </div>
                    {imgCap && (
                      <p
                        className="text-[12px] sm:text-[13px] text-[var(--ink-muted)] italic p-2 text-center leading-relaxed border-t border-gray-100 bg-white mt-auto font-serif"
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
