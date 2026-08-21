import { sanitizeHtml } from "@/lib/sanitize";
import type { SectionData } from "./CheckcamSection";

export default function InsightSection({ data }: { data: SectionData }) {
  return (
    <section className="bg-[var(--surface-warm)] py-[70px] sm:py-[100px]">
      <div className="max-w-[780px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8">
          {data.num && (
            <div className="font-display text-[48px] sm:text-[64px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
              {data.num}
            </div>
          )}
          <div className="flex-1">
            <h3
              className="font-serif lining-nums text-[20px] sm:text-[26px] font-medium leading-[1.4] text-[var(--ink)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
            />
          </div>
        </div>
        <div className="blog-content">
          {data.body.map((p, i) => (
            <div
              key={i}
              className="text-[14px] sm:text-[15px] leading-[1.9] text-[#111] mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(p) }}
            />
          ))}
        </div>

        {/* Image if provided */}
        {data.image && (
          <div className="mt-10 aspect-[16/9] rounded-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.title.replace(/<[^>]*>/g, "")} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
