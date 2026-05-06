"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: 200, suffix: "+", label: "Projects Completed", labelJa: "プロジェクト完了" },
  { value: 50, suffix: "+", label: "Happy Clients", labelJa: "満足いただいたクライアント" },
  { value: 2019, suffix: "", label: "Founded Since", labelJa: "設立年" },
  { value: 5, suffix: "+", label: "Countries Served", labelJa: "対応国数" },
];

export default function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative z-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20" />
      <div className="absolute inset-0 border-y border-white/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {isInView ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    delay={i * 0.2}
                    useEasing
                  />
                ) : (
                  "0"
                )}
                {stat.suffix}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
