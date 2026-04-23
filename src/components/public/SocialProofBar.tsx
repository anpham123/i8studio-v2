"use client";

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

  if (!hasLogos) {
    return (
      <section className="py-8 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[
              { value: "200+", label: "Projects" },
              { value: "50+", label: "Clients" },
              { value: "2019", label: "Since" },
              { value: "5+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const doubled = [...partners, ...partners];

  return (
    <section className="py-8 border-y border-white/5 bg-white/[0.01] overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
        <div className="flex animate-scroll-left">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex-shrink-0 mx-12 flex items-center"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 opacity-40 hover:opacity-70 transition-opacity grayscale"
                />
              ) : (
                <span className="text-white/30 text-sm font-medium whitespace-nowrap">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
