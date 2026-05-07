"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface Slide {
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;
  subtitleJa: string;
  gradient: string;
}

interface HeroSliderProps {
  slides: Slide[];
  bgHero?: string;
  overlayOpacity?: number;
}

const shapes = [
  { left: "7%",  top: "22%", size: 48, type: "square",   color: "border-blue-400/25",   delay: 0,   dur: 9  },
  { left: "87%", top: "14%", size: 36, type: "circle",   color: "border-purple-400/20", delay: 1.5, dur: 12 },
  { left: "72%", top: "68%", size: 52, type: "triangle", color: "text-cyan-400/15",      delay: 0.8, dur: 10 },
  { left: "14%", top: "73%", size: 32, type: "square",   color: "border-purple-400/20", delay: 2,   dur: 8  },
  { left: "50%", top: "10%", size: 22, type: "circle",   color: "border-blue-300/15",   delay: 0.3, dur: 14 },
  { left: "93%", top: "48%", size: 40, type: "triangle", color: "text-blue-400/10",      delay: 1,   dur: 11 },
];

function FloatingShape({ cfg }: { cfg: typeof shapes[0] }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: cfg.left, top: cfg.top, width: cfg.size, height: cfg.size }}
      animate={{ y: [0, -22, 0], rotate: cfg.type === "circle" ? 0 : [0, 360], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: cfg.dur, repeat: Infinity, ease: "easeInOut", delay: cfg.delay }}
    >
      {cfg.type === "square" && (
        <div className={`w-full h-full border ${cfg.color} rotate-12`} />
      )}
      {cfg.type === "circle" && (
        <div className={`w-full h-full border ${cfg.color} rounded-full`} />
      )}
      {cfg.type === "triangle" && (
        <svg viewBox="0 0 40 40" className={`w-full h-full ${cfg.color}`} fill="none">
          <polygon points="20,2 38,38 2,38" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </motion.div>
  );
}

export default function HeroSlider({ slides, bgHero, overlayOpacity = 0.7 }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const locale = useLocale();
  const t = useTranslations("hero");

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const title = locale === "ja" ? slide.titleJa || slide.title : slide.title;
  const subtitle = locale === "ja" ? slide.subtitleJa || slide.subtitle : slide.subtitle;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background — custom image or default animated gradient */}
      {bgHero ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={bgHero}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(10,10,15,${overlayOpacity})` }}
          />
        </div>
      ) : (
        <>
          {/* Animated slide gradient */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient || "from-blue-900 via-purple-900 to-slate-900"}`}
            />
          </AnimatePresence>
          {/* Animated mesh gradient overlay */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.35) 0%, transparent 60%), " +
                "radial-gradient(ellipse 60% 50% at 85% 110%, rgba(139,92,246,0.3) 0%, transparent 60%), " +
                "radial-gradient(ellipse 50% 40% at 5% 60%, rgba(6,182,212,0.2) 0%, transparent 60%)",
            }}
          />
        </>
      )}

      {/* Grid pattern 60px */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Moving glow orbs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 640, height: 640,
          top: "-15%", left: "-12%",
          background: "radial-gradient(circle, rgba(59,130,246,0.28) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 560, height: 560,
          bottom: "-12%", right: "-8%",
          background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -65, 0], y: [0, 55, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420, height: 420,
          top: "20%", right: "15%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 45, 0], y: [0, 65, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating geometric shapes */}
      {shapes.map((s, i) => (
        <FloatingShape key={i} cfg={s} />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-white/80">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t("trust")}
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
              style={{
                textShadow:
                  "0 0 80px rgba(99,102,241,0.45), 0 0 160px rgba(139,92,246,0.25)",
              }}
            >
              {title.split(" ").map((word, i) => (
                <span key={i}>
                  {i === 0 || i === 1 ? (
                    <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      {word}{" "}
                    </span>
                  ) : (
                    word + " "
                  )}
                </span>
              ))}
            </h1>

            <p
              className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ textShadow: "0 0 40px rgba(99,102,241,0.22)" }}
            >
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="btn-gradient inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                {t("cta1")}
              </Link>
              <Link
                href={`/${locale}/works`}
                className="btn-outline inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                {t("cta2")}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots navigation */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-8 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
