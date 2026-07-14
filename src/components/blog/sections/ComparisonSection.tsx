export default function ComparisonSection({
  before,
  after,
}: {
  before?: string;
  after?: string;
}) {
  if (!before && !after) return null;

  return (
    <section className="bg-[var(--surface)] py-[70px] sm:py-[100px]">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="text-center mb-10">
          <h3 className="font-serif text-[22px] sm:text-[28px] font-light text-[var(--ink)]">
            Before → After
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {before && (
            <div className="relative">
              <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-sm z-10">
                Before
              </span>
              {before.startsWith("/") || before.startsWith("http") ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={before}
                  alt="Before"
                  className="w-full aspect-[4/3] object-cover rounded-sm"
                />
              ) : (
                <div className="aspect-[4/3] bg-[var(--surface-warm)] rounded-sm flex items-center justify-center p-8">
                  <p className="text-[var(--ink-light)] text-sm leading-relaxed">{before}</p>
                </div>
              )}
            </div>
          )}
          {after && (
            <div className="relative">
              <span className="absolute top-3 left-3 bg-[var(--accent)] text-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-sm z-10">
                After
              </span>
              {after.startsWith("/") || after.startsWith("http") ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={after}
                  alt="After"
                  className="w-full aspect-[4/3] object-cover rounded-sm"
                />
              ) : (
                <div className="aspect-[4/3] bg-[var(--surface-warm)] rounded-sm flex items-center justify-center p-8">
                  <p className="text-[var(--ink-light)] text-sm leading-relaxed">{after}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
