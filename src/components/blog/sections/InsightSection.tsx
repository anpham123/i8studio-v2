import type { SectionData } from "./CheckcamSection";

export default function InsightSection({ data }: { data: SectionData }) {
  return (
    <section className="bg-[var(--surface-warm)] py-[70px] sm:py-[100px]">
      <div className="max-w-[780px] mx-auto px-6 sm:px-10">
        {data.num && (
          <div className="font-display text-[40px] sm:text-[52px] leading-none text-[var(--accent)]/40 font-bold tracking-tight mb-4">
            {data.num}
          </div>
        )}
        <h3
          className="font-serif text-[20px] sm:text-[26px] font-medium leading-[1.5] text-[var(--ink)] mb-8"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <div className="blog-content">
          {data.body.map((p, i) => (
            <p
              key={i}
              className="text-[14px] sm:text-[15px] leading-[2] text-[var(--ink-light)] mb-5"
              dangerouslySetInnerHTML={{ __html: p }}
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
