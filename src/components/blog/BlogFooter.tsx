export default function BlogFooter({ locale = "ja" }: { locale?: string }) {
  const tagline =
    locale === "ja"
      ? "完成は、引き算からはじまる。"
      : "Perfection begins with subtraction.";

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--line)] py-12 text-center">
      <p className="font-serif text-[18px] sm:text-[20px] text-[var(--ink-light)] font-light italic mb-2">
        {tagline}
      </p>
      <p className="text-[12px] text-[var(--ink-muted)] tracking-wider">
        © 2026 · i8 STUDIO
      </p>
    </footer>
  );
}

