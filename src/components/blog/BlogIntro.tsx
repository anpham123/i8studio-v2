import { sanitizeHtml } from "@/lib/sanitize";

function parseDropcap(htmlOrText: string) {
  if (!htmlOrText) return { firstChar: "", restHtml: "" };

  const raw = htmlOrText.trim();
  const textOnly = raw.replace(/<[^>]+>/g, "").trim();
  if (!textOnly) return { firstChar: "", restHtml: "" };

  // Strip leading tags like <p>, <div>, <span> to find the first real text character
  const tagMatch = raw.match(/^((?:<[^>]+>)*)([^<])([\s\S]*)$/);
  if (tagMatch) {
    const prefixTags = tagMatch[1]; // e.g. <p>
    const firstChar = tagMatch[2];   // e.g. 完 or 建
    const afterFirst = tagMatch[3];  // rest of the content
    const restHtml = prefixTags + afterFirst;
    return { firstChar, restHtml };
  }

  return {
    firstChar: textOnly.charAt(0),
    restHtml: raw,
  };
}

export default function BlogIntro({
  dropcapText,
  pullquote,
}: {
  dropcapText?: string;
  pullquote?: string;
}) {
  const { firstChar, restHtml } = parseDropcap(dropcapText || "");
  const hasDropcap = Boolean(firstChar);

  if (!hasDropcap && !pullquote) return null;

  return (
    <section className="bg-[var(--surface)] pt-2 pb-3 sm:pb-5">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        {/* Lead paragraph with large styled dropcap */}
        {hasDropcap && (
          <div className="text-[14px] sm:text-[15px] leading-[2] text-[#111] mb-5 clearfix max-w-[1000px]">
            {firstChar && (
              <span className="font-serif text-[48px] sm:text-[56px] leading-[0.8] float-left mr-3.5 mt-1 font-normal text-[#b8935a] select-none">
                {firstChar}
              </span>
            )}
            <span
              className="[&>p:first-child]:inline [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(restHtml) }}
            />
          </div>
        )}

        {/* Pullquote */}
        {pullquote && (
          <blockquote className="border-l-[3px] border-[var(--accent)] pl-6 sm:pl-8 py-2.5 mt-6 sm:mt-8 mb-2 sm:mb-3 bg-[var(--surface-warm)]/40 rounded-r-sm">
            <p
              className="font-serif text-[15px] sm:text-[17px] leading-[1.8] text-[#111] font-medium italic"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(pullquote) }}
            />
          </blockquote>
        )}
      </div>
    </section>
  );
}
