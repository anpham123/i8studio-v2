import { sanitizeHtml } from "@/lib/sanitize";
import type { SectionData } from "./CheckcamSection";

export default function TableSection({
  data,
  locale = "ja",
}: {
  data: SectionData;
  locale?: string;
}) {
  const headers = data.tableHeaders && data.tableHeaders.length > 0
    ? data.tableHeaders
    : ["技術", "基本的な特徴", "建築・不動産での例"];

  const rows = data.tableRows && data.tableRows.length > 0
    ? data.tableRows
    : [
        ["AR", "現実空間にデジタル情報を重ねて表示する", "現地での建物表示、家具配置、施工・設備情報の確認"],
        ["VR", "視界を仮想空間に置き換え、没入して体験する", "完成前の空間体験、バーチャル内覧、設計レビュー"],
        ["MR", "現実空間を認識し、デジタル情報を空間に固定・操作する体験を重視する", "実寸確認、複数人での設計検討、作業支援"],
      ];

  return (
    <section className="bg-[var(--surface)] py-[45px] sm:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        {/* Header */}
        {(data.num || data.title || data.eyebrow) && (
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8 sm:mb-10">
            {data.num && (
              <div className="font-display text-[48px] sm:text-[64px] leading-none text-[var(--accent)]/40 font-bold tracking-tight">
                {data.num}
              </div>
            )}
            <div className="flex-1">
              {(data.eyebrow || data.eyebrowBadge) && (
                <div className="flex items-center gap-3 mb-4">
                  {data.eyebrow && (
                    <span className="text-[var(--accent)] text-[11px] uppercase tracking-[0.2em]">
                      {data.eyebrow}
                    </span>
                  )}
                  {data.eyebrowBadge && (
                    <span className="bg-[var(--accent)] text-black text-[10px] px-2 py-1 rounded">
                      {data.eyebrowBadge.trim()}
                    </span>
                  )}
                </div>
              )}
              {data.title && (
                <h2
                  className="font-serif text-[20px] sm:text-[26px] font-medium leading-[1.4] text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
                />
              )}
            </div>
          </div>
        )}

        {/* Body intro paragraphs */}
        {data.body && data.body.length > 0 && data.body.some(Boolean) && (
          <div className="max-w-[1000px] mb-8 space-y-3">
            {data.body.map((p, i) => (
              <p
                key={i}
                className="text-[#111] leading-[1.9] text-[14px] sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(p) }}
              />
            ))}
          </div>
        )}

        {/* Comparison Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-300/80 shadow-sm bg-white my-6">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-[#f0f4f8] border-b border-gray-300">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={`py-3.5 px-4 sm:px-5 font-bold text-[#1a202c] border-r last:border-r-0 border-gray-300 ${
                      i === 0 ? "w-[15%] min-w-[90px] text-center" : i === 1 ? "w-[40%] min-w-[200px]" : "w-[45%] min-w-[220px]"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50/60 transition-colors">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`py-4 px-4 sm:px-5 text-[#2d3748] leading-[1.75] border-r last:border-r-0 border-gray-300 align-middle ${
                        ci === 0 ? "font-semibold text-center text-[#1a202c] bg-gray-50/40" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
