"use client";

import { motion } from "framer-motion";

interface Partner {
  id: string;
  name: string;
  logo: string;
}

interface SocialProofBarProps {
  partners: Partner[];
}

export default function SocialProofBar({ partners }: SocialProofBarProps) {
  const hasLogos = partners.some((p) => p.logo);

  /* ── Fallback: stats bar ────────────────────────────────── */
  if (!hasLogos) {
    const stats = [
      { value: "200+", label: "Projects" },
      { value: "50+", label: "Clients" },
      { value: "2019", label: "Since" },
      { value: "5+", label: "Countries" },
    ];

    return (
      <section className="py-6 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-700 font-bold text-lg sm:text-xl tracking-tight">{s.value}</span>
                <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
                {i < stats.length - 1 && (
                  <span className="hidden sm:block ml-8 w-px h-5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Logo carousel ──────────────────────────────────────── */
  // Duplicate for seamless loop
  const logoList = [...partners, ...partners];

  return (
    <section className="py-8 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">
          Trusted by leading companies
        </p>
      </div>
      <div className="relative">
        {/* Left / right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-16 animate-scroll-left"
          style={{ width: "fit-content" }}
        >
          {logoList.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="shrink-0 h-8 sm:h-10 flex items-center grayscale opacity-40 hover:opacity-80 hover:grayscale-0 transition-all duration-500"
            >
              {partner.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-400 whitespace-nowrap">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
