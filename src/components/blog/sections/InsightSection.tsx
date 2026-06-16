import type { SectionData } from "./CheckcamSection";

export default function InsightSection({ data }: { data: SectionData }) {
  return (
    <section className="bg-[var(--surface-warm)] py-[70px] sm:py-[100px]">
      <div className="max-w-[780px] mx-auto px-6 sm:px-10">
        {data.num && (
          <div className="font-serif text-[60px] sm:text-[80px] leading-none text-[var(--accent)] opacity-20 font-light mb-4">
            {data.num}
          </div>
        )}
        <h3
          className="font-serif text-[26px] sm:text-[34px] font-light leading-[1.5] text-[var(--ink)] mb-10"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        {data.body.map((p, i) => (
          <p
            key={i}
            className="text-[15px] sm:text-[16px] leading-[2] text-[var(--ink-light)] mb-5"
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
    </section>
  );
}
