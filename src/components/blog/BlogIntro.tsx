export default function BlogIntro({
  dropcapText,
  pullquote,
}: {
  dropcapText?: string;
  pullquote?: string;
}) {
  if (!dropcapText && !pullquote) return null;

  const firstChar = dropcapText ? dropcapText.charAt(0) : "";
  const restText = dropcapText ? dropcapText.slice(1) : "";

  return (
    <section className="bg-[var(--surface)] py-[70px] sm:py-[100px]">
      <div className="max-w-[760px] mx-auto px-6 sm:px-10">
        {/* Lead paragraph with dropcap */}
        {dropcapText && (
          <div className="text-[14px] sm:text-[15px] leading-[2] text-[var(--ink)] mb-10 font-light">
            <span className="font-serif text-[44px] sm:text-[52px] leading-none float-left mr-3 mt-1 text-[var(--accent)]">
              {firstChar}
            </span>
            <span dangerouslySetInnerHTML={{ __html: restText }} />
          </div>
        )}

        {/* Pullquote */}
        {pullquote && (
          <blockquote className="border-l-[3px] border-[var(--accent)] pl-6 sm:pl-8 py-2 my-12">
            <p
              className="font-serif text-[16px] sm:text-[18px] leading-[1.7] text-[var(--ink)] font-light italic"
              dangerouslySetInnerHTML={{ __html: pullquote }}
            />
          </blockquote>
        )}
      </div>
    </section>
  );
}
