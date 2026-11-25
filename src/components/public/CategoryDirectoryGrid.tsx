"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export interface CategoryCardItem {
  label: string;
  href: string;
  thumbnail?: string;
}

interface CategoryDirectoryGridProps {
  title: string;
  items: CategoryCardItem[];
  gridCols?: string;
}

export default function CategoryDirectoryGrid({
  title,
  items,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: CategoryDirectoryGridProps) {
  const locale = useLocale();

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-14 py-12 sm:py-16">
        {/* Centered Header Title with symmetric divider lines */}
        <div className="flex items-center justify-center gap-5 mb-10 sm:mb-14">
          <span className="hidden sm:block flex-1 max-w-[220px] h-px bg-gray-200" />
          <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold uppercase tracking-[0.22em] text-[#b8935a] text-center">
            {title}
          </h1>
          <span className="hidden sm:block flex-1 max-w-[220px] h-px bg-gray-200" />
        </div>

        {/* Larger Full-Image Grid */}
        <div className={`grid ${gridCols} gap-6 sm:gap-8`}>
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group relative block aspect-[16/9] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200/80 bg-gray-950"
            >
              {child.thumbnail ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={child.thumbnail}
                  alt={child.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2d34] via-[#1a1c22] to-[#111]" />
              )}

              {/* Base bottom gradient for readability when not hovered */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Black Backdrop smoothly sliding UP from bottom on hover */}
              <div className="absolute inset-0 bg-black/65 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] pointer-events-none" />

              {/* Title: At bottom normally, slides up to center on hover along with rising black overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 text-center z-10 pointer-events-none w-full">
                <span
                  className="w-full text-white text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] font-black uppercase tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] translate-y-[44px] sm:translate-y-[54px] md:translate-y-[64px] group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] leading-none whitespace-nowrap px-2 block"
                  style={{
                    fontFamily:
                      "var(--font-bebas), var(--font-anton), var(--font-noto-serif-jp), 'Bebas Neue', 'Impact', sans-serif",
                  }}
                >
                  {child.label}
                </span>
              </div>

              {/* View Details / 詳しくはこちら anchored at the bottom */}
              <div className="absolute bottom-3.5 sm:bottom-5 left-0 right-0 z-10 text-center pointer-events-none opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1] delay-75">
                <span className="text-[12px] sm:text-[14px] font-medium text-white/95 tracking-wider inline-flex items-center justify-center gap-1 drop-shadow-md whitespace-nowrap">
                  {locale === "ja" ? "詳しくはこちら ›" : "View Details →"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
