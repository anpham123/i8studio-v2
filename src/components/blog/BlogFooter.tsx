export default function BlogFooter({ locale = "ja" }: { locale?: string }) {
  const tagline =
    locale === "ja"
      ? "完成は、引き算からはじまる。"
      : "Perfection begins with subtraction.";

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--line)] py-14 text-center">
      <p className="font-serif text-[20px] sm:text-[24px] text-[var(--ink-light)] font-medium italic mb-3">
        {tagline}
      </p>
      <p className="text-[13px] sm:text-[14px] text-[var(--ink-muted)] tracking-wider">
        © 2026 · i8 STUDIO
      </p>
    </footer>
  );
}

