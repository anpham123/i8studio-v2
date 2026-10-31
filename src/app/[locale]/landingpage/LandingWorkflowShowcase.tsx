"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Bookmark } from "lucide-react";

export interface WorkflowStepItem {
  stepNumber?: string;
  stepTime?: string;
  stepBadge?: string;
  stepTitle?: string;
  stepDesc?: string;
  points?: string[];
  stepImage?: string;
  stepBgImage?: string;
  stepStageTag?: string;
  titleColor?: string;
  descColor?: string;
  step?: string;
  title?: string;
  sub?: string;
  desc?: string;
  timeline?: string;
  deliverable?: string;
  img?: string;
}

interface LandingWorkflowShowcaseProps {
  title?: string;
  steps?: WorkflowStepItem[];
  contactHref?: string;
  stepTitleColor?: string;
  stepDescColor?: string;
  ctaText?: string;
  ctaHref?: string;
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
];

function parseStepBullets(step: WorkflowStepItem): string[] {
  const rawDesc = step.stepDesc || step.desc || "";
  if (rawDesc.trim()) {
    const lines = rawDesc
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length > 1) {
      return lines
        .map((line) => line.replace(/^[・•\-*]\s*/, "").trim())
        .filter(Boolean);
    }

    const bulletSplit = rawDesc
      .split(/[・•]/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (bulletSplit.length > 1) {
      return bulletSplit;
    }

    return [rawDesc.replace(/^[・•\-*]\s*/, "").trim()];
  }

  if (Array.isArray(step.points) && step.points.length > 0) {
    return step.points.map((p) => p.trim()).filter(Boolean);
  }

  return [];
}

const titleSlideVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? "106%" : "-106%",
    opacity: 0.2,
  }),
  center: {
    y: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? "-106%" : "106%",
    opacity: 0,
  }),
};

const descSlideVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? 22 : -22,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? -18 : 18,
    opacity: 0,
  }),
};

const cardQueueVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 84 : -96,
    opacity: 0,
    scale: dir >= 0 ? 0.92 : 1.04,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -104 : 84,
    opacity: 0,
    scale: dir >= 0 ? 1.05 : 0.92,
  }),
};

const AUTOPLAY_MS = 1500;

export default function LandingWorkflowShowcase({
  title,
  steps = [],
  contactHref = "/ja/contact",
  stepTitleColor,
  stepDescColor,
  ctaText,
  ctaHref,
  style,
}: LandingWorkflowShowcaseProps) {
  const safeSteps = steps.length > 0 ? steps : [];
  const totalSteps = safeSteps.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [failedBgImages, setFailedBgImages] = useState<Record<number, boolean>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex >= totalSteps && totalSteps > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSteps]);

  // Observe viewport visibility with pre-detection margin so step transitions begin promptly as user scrolls near/into section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasEntered(true);
          }
        });
      },
      { threshold: 0.02, rootMargin: "60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getStepCardImage = useCallback(
    (idx: number) => {
      const fallback = DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];
      if (failedImages[idx]) return fallback;
      const raw = safeSteps[idx]?.stepImage || safeSteps[idx]?.img;
      return raw && raw.trim() ? raw : fallback;
    },
    [failedImages, safeSteps]
  );

  const getStepBgImage = useCallback(
    (idx: number) => {
      const fallback = DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];
      if (failedBgImages[idx]) {
        const cardRaw = safeSteps[idx]?.stepImage || safeSteps[idx]?.img;
        if (!failedImages[idx] && cardRaw && cardRaw.trim()) {
          return cardRaw;
        }
        return fallback;
      }
      const rawBg = safeSteps[idx]?.stepBgImage;
      if (rawBg && rawBg.trim()) return rawBg;
      const rawCard = safeSteps[idx]?.stepImage || safeSteps[idx]?.img;
      return rawCard && rawCard.trim() ? rawCard : fallback;
    },
    [failedBgImages, failedImages, safeSteps]
  );

  // Preload adjacent step images so background & card transitions are instant
  useEffect(() => {
    if (totalSteps <= 1 || typeof window === "undefined") return;
    const nextIdx = (activeIndex + 1) % totalSteps;
    const urls = [getStepBgImage(nextIdx), getStepCardImage(nextIdx)];
    urls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [activeIndex, totalSteps, getStepBgImage, getStepCardImage]);

  const goToStep = useCallback(
    (targetIdx: number, explicitDir?: number) => {
      if (totalSteps <= 1) return;
      const normalized = ((targetIdx % totalSteps) + totalSteps) % totalSteps;
      if (normalized === activeIndex) return;

      if (explicitDir !== undefined) {
        setDirection(explicitDir);
      } else {
        setDirection(normalized > activeIndex ? 1 : -1);
      }
      setActiveIndex(normalized);
    },
    [activeIndex, totalSteps]
  );

  const handleNext = useCallback(() => {
    if (totalSteps <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    if (totalSteps <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  }, [totalSteps]);

  // Continuous 1.5s autoplay cycle immediately when scrolled into view
  useEffect(() => {
    if (!isInView || totalSteps <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isInView, totalSteps, handleNext, activeIndex]);

  if (totalSteps === 0) {
    return null;
  }

  const handleCardImageError = (idx: number) => {
    setFailedImages((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
  };

  const handleBgImageError = (idx: number) => {
    setFailedBgImages((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
  };

  const activeStep = safeSteps[activeIndex] || {};
  const activeStepNum = String(activeIndex + 1).padStart(2, "0");
  const totalStepNum = String(totalSteps).padStart(2, "0");
  const activeTitle =
    activeStep.stepTitle || activeStep.title || `ステップ ${activeStepNum}`;
  const activeBullets = parseStepBullets(activeStep);
  const activeBgSrc = getStepBgImage(activeIndex);

  // Build visible circular card queue starting at activeIndex
  const visibleCount = Math.min(totalSteps, 4);
  const visibleQueue = Array.from({ length: visibleCount }, (_, slotIdx) => {
    const stepIdx = (activeIndex + slotIdx) % totalSteps;
    return {
      slotIdx,
      stepIdx,
      step: safeSteps[stepIdx],
      numStr: String(stepIdx + 1).padStart(2, "0"),
      imgSrc: getStepCardImage(stepIdx),
    };
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 44) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  const progressPercent = ((activeIndex + 1) / totalSteps) * 100;
  const resolvedTitleColor = (activeStep.titleColor || stepTitleColor || "").trim();
  const resolvedDescColor = (activeStep.descColor || stepDescColor || "").trim();
  const resolvedCtaText = (ctaText && ctaText.trim()) || "無料相談・お問い合わせ";
  const resolvedCtaHref = (ctaHref && ctaHref.trim()) || contactHref;

  return (
    <section
      ref={sectionRef}
      className={`workflow-direct-section wf-v2-section wf-first-reveal ${
        hasEntered ? "is-entered" : ""
      }`}
      id="quy-trinh-thuc-hien"
      style={style}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={title || "プロジェクト進行プロセス"}
    >
      {/* FULL-BLEED PER-STEP BACKGROUND STAGE (No overlay so background image is 100% clear) */}
      <div className="wf-v2-bg-stage" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={`wf-bg-${activeIndex}`}
            className="wf-v2-bg-layer"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={activeBgSrc}
              alt=""
              className="wf-v2-bg-img"
              onError={() => handleBgImageError(activeIndex)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="workflow-fullwidth-container wf-v2-container">
        {/* SECTION HEADER (Lowered comfortably from top edge) */}
        <div className="workflow-title-center-wrap reveal-item wf-v2-header">
          <h2 className="workflow-single-line-title wf-v2-section-title">
            {title}
          </h2>
          <div className="workflow-title-decor" aria-hidden="true">
            <span className="workflow-decor-line left"></span>
            <span className="workflow-decor-sparkle">✦</span>
            <span className="workflow-decor-line right"></span>
          </div>
        </div>

        {/* MAIN INTERACTIVE SHOWCASE STAGE */}
        <div className="wf-v2-stage">
          {/* 1. LEFT VERTICAL TIMELINE SPINE */}
          <aside className="wf-v2-spine" aria-label="ステップ選択">
            <div className="wf-v2-spine-track">
              <div className="wf-v2-spine-line" />
              <div className="wf-v2-spine-nodes">
                {safeSteps.map((_, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`wf-v2-spine-node ${isActive ? "is-active" : ""}`}
                      onClick={() => goToStep(idx)}
                      aria-label={`ステップ ${idx + 1}`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span className="wf-v2-spine-dot" />
                      {isActive && (
                        <motion.span
                          layoutId="wfV2ActiveSpineBubble"
                          className="wf-v2-spine-active-bubble"
                          transition={{
                            type: "spring",
                            stiffness: 430,
                            damping: 32,
                          }}
                        >
                          <span className="wf-v2-spine-active-num">
                            {idx + 1}
                          </span>
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="wf-v2-spine-vertical-counter" aria-hidden="true">
              <span>{activeStepNum}</span>
              <span className="wf-v2-spine-slash">/</span>
              <span>{totalStepNum}</span>
            </div>
          </aside>

          {/* 2. CENTER-LEFT CONTENT COLUMN (Slot-Machine Title + Masked Bullets + CTA, without step/time pills) */}
          <div className="wf-v2-content-col">
            {/* Signature Masked Slot-Machine Title */}
            <div className="wf-v2-title-mask">
              <AnimatePresence initial={false} custom={direction}>
                <motion.h3
                  key={`title-${activeIndex}`}
                  custom={direction}
                  variants={titleSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  className="wf-v2-hero-title"
                  style={resolvedTitleColor ? { color: resolvedTitleColor } : undefined}
                >
                  {activeTitle}
                </motion.h3>
              </AnimatePresence>
            </div>

            {/* Masked Description / Bullet Points */}
            <div className="wf-v2-desc-mask">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={`desc-${activeIndex}`}
                  custom={direction}
                  variants={descSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.34,
                    delay: 0.02,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="wf-v2-desc-inner"
                >
                  {activeBullets.length > 0 && (
                    <ul
                      className="wf-v2-bullet-list"
                      style={resolvedDescColor ? { color: resolvedDescColor } : undefined}
                    >
                      {activeBullets.map((item, bIdx) => (
                        <li
                          key={bIdx}
                          className="wf-v2-bullet-item"
                          style={resolvedDescColor ? { color: resolvedDescColor } : undefined}
                        >
                          <span
                            className="wf-v2-bullet-dot"
                            style={resolvedDescColor ? { color: resolvedDescColor } : undefined}
                          >
                            ・
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action CTA Button */}
            <div className="wf-v2-cta-row">
              <a href={resolvedCtaHref} className="wf-v2-explore-btn">
                <span>{resolvedCtaText}</span>
                <ArrowRight size={17} className="wf-v2-explore-arrow" />
              </a>
            </div>
          </div>

          {/* 3. RIGHT HORIZONTAL CASCADING CARD CAROUSEL */}
          <div className="wf-v2-cards-col">
            <div className="wf-v2-cards-track">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                {visibleQueue.map((item) => {
                  const isLead = item.slotIdx === 0;
                  const cardTitle =
                    item.step?.stepTitle ||
                    item.step?.title ||
                    `ステップ ${item.numStr}`;

                  return (
                    <motion.article
                      layout
                      key={`wf-card-${item.stepIdx}`}
                      custom={direction}
                      variants={cardQueueVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        layout: {
                          duration: 0.38,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        duration: 0.34,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`wf-v2-card-unit ${
                        isLead ? "is-lead" : `is-trail slot-${item.slotIdx}`
                      }`}
                      onClick={() => {
                        if (!isLead) {
                          goToStep(item.stepIdx, 1);
                        }
                      }}
                    >
                      {/* Top Header Above Card (Title + Indicator Dots like Video) */}
                      <motion.div
                        layout="position"
                        className="wf-v2-card-top-meta"
                      >
                        <div className="wf-v2-card-top-label" title={cardTitle}>
                          {cardTitle}
                        </div>
                        <div className="wf-v2-card-stars" aria-hidden="true">
                          {safeSteps.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`wf-v2-card-star-dot ${
                                dotIdx <= item.stepIdx ? "filled" : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Image Frame */}
                      <div className="wf-v2-card-media">
                        <img
                          src={item.imgSrc}
                          alt={cardTitle}
                          className="wf-v2-card-img"
                          onError={() => handleCardImageError(item.stepIdx)}
                        />
                        <div className="wf-v2-card-gradient" />

                        {/* Top-Right Circular Badge */}
                        <motion.span
                          layout="position"
                          className="wf-v2-card-corner-badge"
                          aria-hidden="true"
                        >
                          <Bookmark size={14} strokeWidth={2.3} />
                        </motion.span>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM CONTROLS BAR (Center Prev/Next + Right Progress Counter) */}
        <div className="wf-v2-bottom-bar">
          <div className="wf-v2-bottom-spacer" aria-hidden="true" />

          <div className="wf-v2-nav-controls">
            <button
              type="button"
              className="wf-v2-circle-btn"
              onClick={handlePrev}
              aria-label="前のステップ"
            >
              <ChevronLeft size={19} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className="wf-v2-circle-btn"
              onClick={handleNext}
              aria-label="次のステップ"
            >
              <ChevronRight size={19} strokeWidth={2.2} />
            </button>
          </div>

          <div className="wf-v2-progress-block" aria-live="polite">
            <span className="wf-v2-progress-num current">{activeStepNum}</span>
            <div className="wf-v2-progress-track">
              <div
                className="wf-v2-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="wf-v2-progress-num total">{totalStepNum}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
