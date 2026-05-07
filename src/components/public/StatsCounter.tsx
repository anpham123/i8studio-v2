"use client";

import CountUp from "react-countup";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: 200,  suffix: "+", label: "Projects Completed", grad: "from-blue-400 to-cyan-400",   orb: "rgba(59,130,246,0.35)"  },
  { value: 50,   suffix: "+", label: "Happy Clients",       grad: "from-purple-400 to-blue-400", orb: "rgba(139,92,246,0.35)"  },
  { value: 2019, suffix: "",  label: "Founded Since",       grad: "from-cyan-400 to-blue-400",   orb: "rgba(6,182,212,0.3)"    },
  { value: 5,    suffix: "+", label: "Countries Served",    grad: "from-blue-400 to-purple-400", orb: "rgba(99,102,241,0.35)"  },
];

export default function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative z-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient-x"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.18) 50%, rgba(59,130,246,0.15) 100%)",
        }}
      />
      <div className="absolute inset-0 border-y border-white/5" />
      {/* Central ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Per-stat orb */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 140, height: 140,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -60%)",
                  background: `radial-gradient(circle, ${stat.orb} 0%, transparent 70%)`,
                  filter: "blur(24px)",
                }}
              />

              <div className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${stat.grad} bg-clip-text text-transparent mb-2 animate-number-glow relative`}>
                {isInView ? (
                  <CountUp start={0} end={stat.value} duration={2.5} delay={i * 0.2} useEasing />
                ) : "0"}
                {stat.suffix}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
