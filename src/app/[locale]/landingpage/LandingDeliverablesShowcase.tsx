"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export interface DeliverablePhotoItem {
  url?: string;
  tag?: string;
  title?: string;
}

export interface DeliverableCollectionItem {
  id?: string | number;
  name?: string;
  nameColor?: string;
  badge?: string;
  thumbnail?: string;
  photos?: DeliverablePhotoItem[];
}

interface LandingDeliverablesShowcaseProps {
  title?: string;
  collections?: DeliverableCollectionItem[];
  collectionNameColor?: string;
  backBtnText?: string;
  closeZoomBtnText?: string;
  style?: React.CSSProperties;
}

type ShowcaseMode = "carousel" | "collection";

const FALLBACK_ARCHITECTURAL_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85",
];

const VIRTUAL_SLOTS = [-2, -1, 0, 1, 2];

function detectLightBackground(style?: React.CSSProperties): boolean {
  const raw = String(style?.background || style?.backgroundColor || "").trim();
  if (!raw) {
    return true;
  }

  const hexMatch = raw.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.52;
  }

  const rgbMatch = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.52;
  }

  return true;
}

function getCollectionTitleStyle(
  rawColor: string | undefined,
  isLightBg: boolean
): React.CSSProperties | undefined {
  const chosen = String(rawColor || "").trim();
  if (!chosen) return undefined;

  const isWhiteish = /^#(?:fff|ffffff|fefefe|fafafa)$/i.test(chosen);
  if (isLightBg && isWhiteish) {
    return {
      color: chosen,
      textShadow:
        "0 1px 10px rgba(20, 21, 24, 0.45), 0 1px 3px rgba(20, 21, 24, 0.35)",
    };
  }

  return { color: chosen };
}

const horizTitleVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -24 : 24,
    opacity: 0,
  }),
};

export default function LandingDeliverablesShowcase({
  title,
  collections = [],
  collectionNameColor,
  backBtnText,
  closeZoomBtnText,
  style,
}: LandingDeliverablesShowcaseProps) {
  const safeCollections = useMemo(
    () =>
      Array.isArray(collections) && collections.length > 0 ? collections : [],
    [collections]
  );
  const colCount = safeCollections.length;

  const [mode, setMode] = useState<ShowcaseMode>("carousel");
  const [colBaseStep, setColBaseStep] = useState(0);
  const [colDir, setColDir] = useState(1);
  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: 1440,
    h: 860,
  });
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [imgRatios, setImgRatios] = useState<Record<string, number>>({});
  const [zoomPhotoIdx, setZoomPhotoIdx] = useState<number | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Continuous physics state for State 1 horizontal editorial carousel
  const modeRef = useRef<ShowcaseMode>(mode);
  modeRef.current = mode;

  const colPosRef = useRef(0);
  const colTargetRef = useRef(0);
  const colBaseRef = useRef(0);

  // Pointer drag & flick velocity tracking
  const isPointerDownRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragOriginPosRef = useRef(0);
  const pointerSamplesRef = useRef<Array<{ x: number; t: number }>>([]);
  const wheelSnapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DOM node map for carousel virtual cards
  const cardMapRef = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const w = stageRef.current?.clientWidth || window.innerWidth || 1440;
      const h = window.innerHeight || 860;
      setViewportSize({ w, h });
    };
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  // Lock body scroll only when Fullscreen Zoom Lightbox (State 3) is open
  useEffect(() => {
    if (zoomPhotoIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomPhotoIdx]);

  const resolveImageUrl = useCallback(
    (rawUrl: string | undefined, fallbackSeed: number) => {
      const fallback =
        FALLBACK_ARCHITECTURAL_IMAGES[
          Math.abs(fallbackSeed) % FALLBACK_ARCHITECTURAL_IMAGES.length
        ];
      if (!rawUrl || !rawUrl.trim() || failedUrls[rawUrl]) {
        return fallback;
      }
      return rawUrl.trim();
    },
    [failedUrls]
  );

  const getPhotosForCollection = useCallback(
    (cIdx: number): DeliverablePhotoItem[] => {
      const col = safeCollections[cIdx] || {};
      const rawPhotos = Array.isArray(col.photos) ? col.photos : [];
      const nonEmptyPhotos = rawPhotos.filter(
        (p) => p && typeof p.url === "string" && p.url.trim().length > 0
      );
      if (nonEmptyPhotos.length > 0) {
        return nonEmptyPhotos;
      }
      return [
        {
          url:
            col.thumbnail ||
            FALLBACK_ARCHITECTURAL_IMAGES[
              Math.abs(cIdx) % FALLBACK_ARCHITECTURAL_IMAGES.length
            ],
          tag: col.badge || `COLLECTION 0${cIdx + 1}`,
          title: col.name || `Collection 0${cIdx + 1}`,
        },
      ];
    },
    [safeCollections]
  );

  const activeColIdx =
    colCount > 0 ? ((colBaseStep % colCount) + colCount) % colCount : 0;
  const activeCollection = safeCollections[activeColIdx] || {};
  const activePhotos = useMemo(
    () => getPhotosForCollection(activeColIdx),
    [getPhotosForCollection, activeColIdx]
  );
  const photoCount = activePhotos.length;

  const isLightBg = detectLightBackground(style);
  const activeTitleColorStyle = getCollectionTitleStyle(
    activeCollection.nameColor || collectionNameColor,
    isLightBg
  );

  const getCarouselStridePx = useCallback(() => {
    const w =
      stageRef.current?.clientWidth ||
      (typeof window !== "undefined" ? window.innerWidth : 1440);
    if (w <= 768) return w * 0.64;
    if (w <= 960) return w * 0.56;
    return w * 0.5;
  }, []);

  const paintCarouselFrame = useCallback(() => {
    const stride = getCarouselStridePx();
    const pos = colPosRef.current;

    cardMapRef.current.forEach((el, vIdx) => {
      const d = vIdx - pos;
      const absD = Math.abs(d);
      const xPx = d * stride;
      const opacity = absD > 1.85 ? 0 : absD > 1.35 ? (1.85 - absD) / 0.5 : 1;

      el.style.transform = `translate3d(${xPx.toFixed(2)}px, 0px, 0px)`;
      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.pointerEvents = absD < 1.45 ? "auto" : "none";
      el.style.zIndex = String(20 - Math.round(absD * 5));
    });
  }, [getCarouselStridePx]);

  useLayoutEffect(() => {
    if (mode === "carousel") {
      paintCarouselFrame();
    }
  }, [mode, colBaseStep, viewportSize.w, paintCarouselFrame]);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      if (modeRef.current === "carousel") {
        const dragging = isPointerDownRef.current;
        const lerpFactor = dragging ? 0.34 : 0.1;
        const diff = colTargetRef.current - colPosRef.current;

        if (Math.abs(diff) > 0.0004) {
          colPosRef.current += diff * lerpFactor;
        } else {
          colPosRef.current = colTargetRef.current;
        }

        const rounded = Math.round(colPosRef.current);
        if (rounded !== colBaseRef.current) {
          setColDir(rounded > colBaseRef.current ? 1 : -1);
          colBaseRef.current = rounded;
          setColBaseStep(rounded);
        }

        paintCarouselFrame();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [paintCarouselFrame]);

  // First-time viewport entrance detection
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
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stepCollectionBy = useCallback(
    (delta: number) => {
      if (colCount <= 0 || delta === 0) return;
      setColDir(delta > 0 ? 1 : -1);
      colTargetRef.current = Math.round(colTargetRef.current + delta);
    },
    [colCount]
  );

  // Global pointer listeners for smooth horizontal drag in State 1
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || modeRef.current !== "carousel") return;

      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;

      if (!didDragRef.current) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.2) {
          isPointerDownRef.current = false;
          return;
        }
        if (Math.abs(dx) > 6) {
          didDragRef.current = true;
          setIsDraggingUI(true);
        }
      }

      if (didDragRef.current) {
        const stride = getCarouselStridePx();
        colTargetRef.current = dragOriginPosRef.current - dx / stride;
      }

      const now = performance.now();
      pointerSamplesRef.current.push({ x: e.clientX, t: now });
      while (
        pointerSamplesRef.current.length > 2 &&
        now - pointerSamplesRef.current[0].t > 100
      ) {
        pointerSamplesRef.current.shift();
      }
    };

    const finishDrag = (clientX?: number) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (didDragRef.current) {
        const stride = getCarouselStridePx();
        const now = performance.now();
        const samples = pointerSamplesRef.current;

        let vxPxPerMs = 0;
        if (samples.length >= 2) {
          const first = samples[0];
          const last = samples[samples.length - 1];
          const dt = last.t - first.t;
          if (dt > 4 && now - last.t < 90) {
            vxPxPerMs = (last.x - first.x) / dt;
          }
        }

        const vCardsPerSec = Math.max(
          -3.5,
          Math.min(3.5, (-vxPxPerMs * 1000) / stride)
        );

        let snapped = Math.round(colTargetRef.current + vCardsPerSec * 0.2);
        const totalDx =
          (clientX ?? (samples[samples.length - 1]?.x || dragStartXRef.current)) -
          dragStartXRef.current;
        const originRounded = Math.round(dragOriginPosRef.current);
        if (snapped === originRounded && Math.abs(totalDx) > 38) {
          snapped = originRounded + (totalDx < 0 ? 1 : -1);
        }

        setColDir(snapped >= colBaseRef.current ? 1 : -1);
        colTargetRef.current = snapped;
        setIsDraggingUI(false);

        window.setTimeout(() => {
          didDragRef.current = false;
        }, 45);
      }
    };

    const onWindowPointerUp = (e: PointerEvent) => finishDrag(e.clientX);
    const onWindowPointerCancel = () => finishDrag();

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", onWindowPointerUp, { passive: true });
    window.addEventListener("pointercancel", onWindowPointerCancel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerCancel);
    };
  }, [getCarouselStridePx]);

  const handleReturnToCarousel = useCallback(() => {
    setZoomPhotoIdx(null);
    setMode("carousel");
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < -80 || rect.top > window.innerHeight * 0.5) {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  // Keyboard shortcuts (Escape / Left / Right)
  useEffect(() => {
    if (!isInView && zoomPhotoIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (zoomPhotoIdx !== null) {
        if (e.key === "Escape") {
          setZoomPhotoIdx(null);
        } else if (e.key === "ArrowRight") {
          setZoomPhotoIdx((prev) =>
            prev === null ? null : (prev + 1) % Math.max(1, photoCount)
          );
        } else if (e.key === "ArrowLeft") {
          setZoomPhotoIdx((prev) =>
            prev === null
              ? null
              : (prev - 1 + Math.max(1, photoCount)) % Math.max(1, photoCount)
          );
        }
        return;
      }

      if (mode === "collection") {
        if (e.key === "Escape") {
          handleReturnToCarousel();
        }
        return;
      }

      if (e.key === "ArrowRight") {
        stepCollectionBy(1);
      } else if (e.key === "ArrowLeft") {
        stepCollectionBy(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isInView,
    mode,
    zoomPhotoIdx,
    photoCount,
    stepCollectionBy,
    handleReturnToCarousel,
  ]);

  if (colCount === 0) {
    return null;
  }

  const markUrlFailed = (rawUrl?: string) => {
    if (!rawUrl) return;
    setFailedUrls((prev) => (prev[rawUrl] ? prev : { ...prev, [rawUrl]: true }));
  };

  const recordImgRatio = (src: string, w: number, h: number) => {
    if (!src || !w || !h) return;
    const ratio = w / h;
    setImgRatios((prev) => {
      if (prev[src] && Math.abs(prev[src] - ratio) < 0.005) return prev;
      return { ...prev, [src]: ratio };
    });
  };

  const getCollectionCover = (cIdx: number) => {
    const col = safeCollections[cIdx];
    const photos = getPhotosForCollection(cIdx);
    const candidate =
      (col?.thumbnail && col.thumbnail.trim()) || photos[0]?.url;
    return resolveImageUrl(candidate, cIdx);
  };

  // Exact natural uploaded aspect ratio dimensions for State 1 cards
  const computeCarouselDims = (
    src: string
  ): { width: number; height: number } | null => {
    const ratio = imgRatios[src];
    if (!ratio) return null;

    const w = viewportSize.w || 1440;
    const h = viewportSize.h || 860;
    const isPhone = w <= 768;
    const isTablet = w > 768 && w <= 960;

    const maxW = isPhone
      ? w * 0.56
      : isTablet
      ? Math.min(w * 0.46, 420)
      : Math.min(Math.max(290, w * 0.34), 500);

    const maxH = isPhone
      ? Math.min(Math.max(210, h * 0.38), 310)
      : isTablet
      ? Math.min(Math.max(250, h * 0.44), 390)
      : Math.min(Math.max(280, h * 0.5), 470);

    const fitW = Math.min(maxW, maxH * ratio);
    const fitH = fitW / ratio;

    return {
      width: Math.round(fitW),
      height: Math.round(fitH),
    };
  };

  const getCarouselImgFittedStyle = (
    src: string
  ): React.CSSProperties | undefined => {
    const dims = computeCarouselDims(src);
    if (!dims) return undefined;
    return {
      width: `${dims.width}px`,
      height: `${dims.height}px`,
    };
  };

  // Match stage height tightly to the active center card so Collection Name sits right ABOVE the photo
  const activeCenterCoverSrc = getCollectionCover(activeColIdx);
  const activeCenterDims = computeCarouselDims(activeCenterCoverSrc);
  const stageDynamicStyle: React.CSSProperties | undefined = activeCenterDims
    ? { height: `${activeCenterDims.height}px`, minHeight: `${activeCenterDims.height}px` }
    : undefined;

  const handleStagePointerDown = (e: React.PointerEvent) => {
    if (mode !== "carousel") return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("button")) return;

    isPointerDownRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    colTargetRef.current = colPosRef.current;
    dragOriginPosRef.current = colPosRef.current;
    pointerSamplesRef.current = [{ x: e.clientX, t: performance.now() }];
  };

  const handleStageWheel = (e: React.WheelEvent) => {
    if (mode !== "carousel") return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 3) {
      return;
    }
    const stride = getCarouselStridePx();
    colTargetRef.current += e.deltaX / stride;

    if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
    wheelSnapTimerRef.current = setTimeout(() => {
      if (modeRef.current === "carousel") {
        const snapped = Math.round(colTargetRef.current);
        setColDir(snapped >= colBaseRef.current ? 1 : -1);
        colTargetRef.current = snapped;
      }
    }, 150);
  };

  const handleCarouselCardClick = (virtualColIdx: number, slotOffset: number) => {
    if (didDragRef.current) return;

    if (slotOffset !== 0) {
      setColDir(slotOffset > 0 ? 1 : -1);
      colTargetRef.current = virtualColIdx;
      return;
    }

    colPosRef.current = virtualColIdx;
    colTargetRef.current = virtualColIdx;
    colBaseRef.current = virtualColIdx;
    setColBaseStep(virtualColIdx);
    setMode("collection");
  };

  const activeCollectionDisplayName =
    (activeCollection.name && activeCollection.name.trim()) ||
    `コレクション 0${activeColIdx + 1}`;

  return (
    <section
      ref={sectionRef}
      className={`deliverables-compare-section deliv-v2-section deliv-editorial-v3 mode-${mode} ${
        isLightBg ? "is-light-bg" : "is-dark-bg"
      } ${isDraggingUI ? "is-dragging" : ""} ${hasEntered ? "is-entered" : ""}`}
      id="bo-suu-tap"
      style={style}
    >
      <div className="deliv-v2-shell">
        {/* MAIN SECTION HEADING */}
        <div className="deliv-v2-top-bar">
          <motion.div
            className="deliv-v2-brand-title"
            initial={{ opacity: 0, y: 26, filter: "blur(5px)" }}
            animate={
              hasEntered
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 26, filter: "blur(5px)" }
            }
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="deliv-v2-main-heading">
              {title || "お客様へのお届け成果物コレクション"}
            </h2>
          </motion.div>
        </div>

        {/* STATE 2 BACK BUTTON: CENTERED DIRECTLY BELOW MAIN HEADING (NO COLLECTION NAME) */}
        <AnimatePresence>
          {mode === "collection" && (
            <motion.div
              key="state2-under-title-btn"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="deliv-edit-under-title-bar"
            >
              <button
                type="button"
                onClick={handleReturnToCarousel}
                className="deliv-v2-top-action-btn"
              >
                <ArrowLeft size={14} />
                <span>
                  {(backBtnText && backBtnText.trim()) || "一覧へ戻る"}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mode === "carousel" ? (
            /* ================================================================
               STATE 1: MINIMAL EDITORIAL HORIZONTAL CAROUSEL
               - Collection Name positioned directly ABOVE the center image (never inside image)
               - First-time scroll entrance animation
               ================================================================ */
            <motion.div
              key="editorial-state-carousel"
              initial={{ opacity: 0, y: 36 }}
              animate={
                hasEntered
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 36 }
              }
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="deliv-edit-carousel-wrapper"
            >
              {/* Collection Name Directly ABOVE the Center Image (Outside Image) */}
              <motion.div
                className="deliv-edit-title-row"
                initial={{ opacity: 0, y: 18 }}
                animate={
                  hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{
                  duration: 0.68,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <AnimatePresence mode="wait" initial={false} custom={colDir}>
                  <motion.button
                    key={`htitle-${activeColIdx}`}
                    type="button"
                    custom={colDir}
                    variants={horizTitleVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="deliv-edit-collection-title-btn"
                    style={activeTitleColorStyle}
                    onClick={() => setMode("collection")}
                  >
                    {activeCollectionDisplayName}
                  </motion.button>
                </AnimatePresence>
              </motion.div>

              {/* Center + Far-Left / Far-Right Peeking Stage */}
              <motion.div
                ref={stageRef}
                className="deliv-edit-stage-viewport"
                style={stageDynamicStyle}
                initial={{ opacity: 0, y: 44, scale: 0.93 }}
                animate={
                  hasEntered
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 44, scale: 0.93 }
                }
                transition={{
                  duration: 0.88,
                  delay: 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onPointerDown={handleStagePointerDown}
                onWheel={handleStageWheel}
              >
                <div className="deliv-edit-track">
                  {VIRTUAL_SLOTS.map((slotOffset) => {
                    const virtualIdx = colBaseStep + slotOffset;
                    const cIdx =
                      ((virtualIdx % colCount) + colCount) % colCount;
                    const col = safeCollections[cIdx];
                    const colPhotos = getPhotosForCollection(cIdx);
                    const rawThumb =
                      (col?.thumbnail && col.thumbnail.trim()) ||
                      colPhotos[0]?.url;
                    const imgSrc = getCollectionCover(cIdx);
                    const isCenter = slotOffset === 0;
                    const fittedImgStyle = getCarouselImgFittedStyle(imgSrc);

                    return (
                      <article
                        key={`edit-col-${virtualIdx}`}
                        ref={(el) => {
                          if (el) cardMapRef.current.set(virtualIdx, el);
                          else cardMapRef.current.delete(virtualIdx);
                        }}
                        className={`deliv-edit-card ${
                          isCenter ? "is-center" : "is-peek"
                        }`}
                        onClick={() =>
                          handleCarouselCardClick(virtualIdx, slotOffset)
                        }
                      >
                        <div className="deliv-edit-card-frame">
                          <img
                            ref={(imgEl) => {
                              if (
                                imgEl &&
                                imgEl.complete &&
                                imgEl.naturalWidth > 0 &&
                                imgEl.naturalHeight > 0
                              ) {
                                recordImgRatio(
                                  imgSrc,
                                  imgEl.naturalWidth,
                                  imgEl.naturalHeight
                                );
                              }
                            }}
                            src={imgSrc}
                            alt={col?.name || `Collection 0${cIdx + 1}`}
                            className="deliv-edit-carousel-img"
                            style={fittedImgStyle}
                            draggable={false}
                            onLoad={(e) => {
                              const img = e.currentTarget;
                              recordImgRatio(
                                imgSrc,
                                img.naturalWidth,
                                img.naturalHeight
                              );
                            }}
                            onError={() => markUrlFailed(rawThumb)}
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ================================================================
               STATE 2: VERTICAL STAGGERED EDITORIAL LOOKBOOK
               - Photo #1: Centered hero, NO title
               - Photos #2+: Left image -> Title centered on Right; Right image -> Title centered on Left
               - No collection name, no bottom credits block
               - First-time reveal animation on open & scroll
               ================================================================ */
            <motion.div
              key={`editorial-lookbook-${activeColIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="deliv-edit-lookbook-wrap"
            >
              <div className="deliv-edit-lookbook-stream">
                {activePhotos.map((photo, pIdx) => {
                  const rawUrl = photo?.url;
                  const imgSrc = resolveImageUrl(
                    rawUrl,
                    activeColIdx * 10 + pIdx
                  );

                  // Photo #1 (index 0): Centered hero image, NO title
                  if (pIdx === 0) {
                    return (
                      <motion.figure
                        key={`lookbook-hero-${activeColIdx}-0`}
                        className="deliv-edit-hero-row"
                        initial={{
                          opacity: 0,
                          y: 52,
                          scale: 0.93,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.86,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div
                          className="deliv-edit-lookbook-card"
                          onClick={() => setZoomPhotoIdx(0)}
                        >
                          <img
                            src={imgSrc}
                            alt={
                              photo?.title ||
                              photo?.tag ||
                              `Deliverable 01`
                            }
                            className="deliv-edit-lookbook-img"
                            loading="eager"
                            onLoad={(e) => {
                              const img = e.currentTarget;
                              recordImgRatio(
                                imgSrc,
                                img.naturalWidth,
                                img.naturalHeight
                              );
                            }}
                            onError={() => markUrlFailed(rawUrl)}
                          />

                          <span
                            className="deliv-edit-lookbook-zoom-badge"
                            aria-hidden="true"
                          >
                            <ZoomIn size={14} />
                          </span>
                        </div>
                      </motion.figure>
                    );
                  }

                  // Photos #2+: Alternate Right image (Title on Left) & Left image (Title on Right)
                  const isImageRight = pIdx % 2 === 1;
                  const photoLabel =
                    (photo?.title && photo.title.trim()) ||
                    (photo?.tag && photo.tag.trim()) ||
                    "";

                  return (
                    <div
                      key={`lookbook-split-${activeColIdx}-${pIdx}`}
                      className={`deliv-edit-split-row ${
                        isImageRight ? "is-img-right" : "is-img-left"
                      }`}
                    >
                      <motion.div
                        className="deliv-edit-split-media-col"
                        initial={{
                          opacity: 0,
                          y: 54,
                          x: isImageRight ? 34 : -34,
                          scale: 0.95,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          x: 0,
                          scale: 1,
                        }}
                        viewport={{ once: true, amount: 0.18 }}
                        transition={{
                          duration: 0.85,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div
                          className="deliv-edit-lookbook-card"
                          onClick={() => setZoomPhotoIdx(pIdx)}
                        >
                          <img
                            src={imgSrc}
                            alt={photoLabel || `Deliverable ${pIdx + 1}`}
                            className="deliv-edit-lookbook-img"
                            loading={pIdx <= 2 ? "eager" : "lazy"}
                            onLoad={(e) => {
                              const img = e.currentTarget;
                              recordImgRatio(
                                imgSrc,
                                img.naturalWidth,
                                img.naturalHeight
                              );
                            }}
                            onError={() => markUrlFailed(rawUrl)}
                          />

                          <span
                            className="deliv-edit-lookbook-zoom-badge"
                            aria-hidden="true"
                          >
                            <ZoomIn size={14} />
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="deliv-edit-split-title-col"
                        initial={{
                          opacity: 0,
                          y: 22,
                          x: isImageRight ? -26 : 26,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          x: 0,
                        }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.76,
                          delay: 0.14,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {photoLabel && (
                          <p className="deliv-edit-side-photo-title">
                            {photoLabel}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STATE 3: FULLSCREEN UNCROPPED ZOOM LIGHTBOX PORTAL (NO TOP-LEFT CONTENT) */}
      {portalMounted &&
        zoomPhotoIdx !== null &&
        createPortal(
          <div
            className="deliv-edit-zoom-backdrop"
            onClick={() => setZoomPhotoIdx(null)}
          >
            <div
              className="deliv-edit-zoom-topbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomPhotoIdx(null)}
                className="deliv-edit-zoom-close-btn"
              >
                <X size={15} />
                <span>
                  {(closeZoomBtnText && closeZoomBtnText.trim()) ||
                    "拡大表示を閉じる"}
                </span>
              </button>
            </div>

            {photoCount > 1 && (
              <button
                type="button"
                className="deliv-edit-zoom-nav is-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomPhotoIdx(
                    (zoomPhotoIdx - 1 + photoCount) % photoCount
                  );
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              className="deliv-edit-zoom-stage"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resolveImageUrl(
                  activePhotos[zoomPhotoIdx]?.url,
                  activeColIdx * 10 + zoomPhotoIdx
                )}
                alt={
                  activePhotos[zoomPhotoIdx]?.title ||
                  `Deliverable ${zoomPhotoIdx + 1}`
                }
                className="deliv-edit-zoom-img"
              />
              {activePhotos[zoomPhotoIdx]?.title && (
                <p className="deliv-edit-zoom-caption">
                  {activePhotos[zoomPhotoIdx]?.title}
                </p>
              )}
            </div>

            {photoCount > 1 && (
              <button
                type="button"
                className="deliv-edit-zoom-nav is-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomPhotoIdx((zoomPhotoIdx + 1) % photoCount);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}
