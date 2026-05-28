"use client";

import CountUp from "react-countup";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: 200,  suffix: "+", label: "Projects Completed" },
  { value: 50,   suffix: "+", label: "Happy Clients" },
  { value: 2019, suffix: "",  label: "Founded Since" },
  { value: 5,    suffix: "+", label: "Countries Served" },
];

export default function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center px-8 py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2 tracking-tight">
                {isInView ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2}
                    delay={i * 0.15}
                    useEasing
                    separator=""
                  />
                ) : "0"}
                {stat.suffix}
              </div>
              <div className="text-xs tracking-widest uppercase text-gray-400 font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
