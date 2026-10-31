"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

export interface DeliverablePhotoItem {
  url?: string;
  tag?: string;
  title?: string;
}

export interface DeliverableCollectionItem {
  id?: string | number;
  name?: string;
  badge?: string;
  thumbnail?: string;
  photos?: DeliverablePhotoItem[];
}

interface LandingDeliverablesShowcaseProps {
  title?: string;
  collections?: DeliverableCollectionItem[];
  backBtnText?: string;
  closeZoomBtnText?: string;
  style?: React.CSSProperties;
}

type GalleryMode = "cylinder" | "collection" | "zoom";

const FALLBACK_ARCHITECTURAL_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85",
];

const VIRTUAL_SLOTS = [-3, -2, -1, 0, 1, 2, 3];
const STAGGER_Y_PATTERN = [-24, 48, -38, 42];
const AUTO_ROTATE_MS = 3200;

function extractShortCollectionTitle(rawName?: string, idx: number = 0): string {
  if (!rawName || !rawName.trim()) {
    return `COLLECTION 0${idx + 1}`;
  }
  const cleaned = rawName
    .replace(/^(?:コレクション|COLLECTION|BỘ SƯU TẬP)\s*\d+\s*[:：\-・]\s*/i, "")
    .trim();
  return cleaned || rawName.trim();
}

function detectLightBackground(style?: React.CSSProperties): boolean {
  const raw = String(style?.background || style?.backgroundColor || "").trim();
  if (!raw) return false;

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

  return false;
}

const verticalTitleVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? "75%" : "-75%",
    opacity: 0,
  }),
  center: {
    y: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? "-75%" : "75%",
    opacity: 0,
  }),
};

export default function LandingDeliverablesShowcase({
  title,
  collections = [],
  backBtnText,
  closeZoomBtnText,
  style,
}: LandingDeliverablesShowcaseProps) {
  const safeCollections = collections.length > 0 ? collections : [];
  const colCount = safeCollections.length;

  const [mode, setMode] = useState<GalleryMode>("cylinder");
  const [colBaseStep, setColBaseStep] = useState(0);
  const [colDir, setColDir] = useState(1);
  const [photoBaseStep, setPhotoBaseStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [imgRatios, setImgRatios] = useState<Record<string, number>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Continuous physics state refs (60/120fps without React re-renders per frame)
  const modeRef = useRef<GalleryMode>(mode);
  modeRef.current = mode;

  const colPosRef = useRef(0);
  const colTargetRef = useRef(0);
  const colBaseRef = useRef(0);

  const photoPosRef = useRef(0);
  const photoTargetRef = useRef(0);
  const photoBaseRef = useRef(0);

  const zoomMixRef = useRef(0);

  // Pointer drag & velocity tracking
  const isPointerDownRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragOriginPosRef = useRef(0);
  const pointerSamplesRef = useRef<Array<{ x: number; t: number }>>([]);
  const wheelSnapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DOM node maps keyed by virtualIndex
  const cylCardMapRef = useRef<Map<number, HTMLElement>>(new Map());
  const cylImgMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const photoCardMapRef = useRef<Map<number, HTMLElement>>(new Map());

  const activeColIdx =
    colCount > 0 ? ((colBaseStep % colCount) + colCount) % colCount : 0;
  const activeCollection = safeCollections[activeColIdx] || {};
  const activePhotos: DeliverablePhotoItem[] =
    Array.isArray(activeCollection.photos) && activeCollection.photos.length > 0
      ? activeCollection.photos
      : [
          {
            url:
              activeCollection.thumbnail ||
              FALLBACK_ARCHITECTURAL_IMAGES[
                activeColIdx % FALLBACK_ARCHITECTURAL_IMAGES.length
              ],
            tag: activeCollection.badge || `COLLECTION 0${activeColIdx + 1}`,
            title: activeCollection.name || `Collection 0${activeColIdx + 1}`,
          },
        ];
  const photoCount = activePhotos.length;

  const isLightBg = detectLightBackground(style);

  // Compute current stride in pixels for responsive 1:1 pointer tracking
  const getStridePx = useCallback((forMode: GalleryMode) => {
    const w = stageRef.current?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1440);
    const isMobile = w <= 960;
    if (forMode === "cylinder") {
      return w * (isMobile ? 0.65 : 0.342);
    }
    if (forMode === "zoom") {
      return w * (isMobile ? 0.92 : 0.64);
    }
    return w * (isMobile ? 0.64 : 0.305);
  }, []);

  // Synchronous frame painter for State 1 (Concave 3D Cylinder)
  const paintCylinderFrame = useCallback(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const w = stageEl.clientWidth || 1440;
    const isMobile = w <= 960;
    const stride = w * (isMobile ? 0.65 : 0.342);
    const pos = colPosRef.current;

    cylCardMapRef.current.forEach((el, vIdx) => {
      const d = vIdx - pos;
      const absD = Math.abs(d);
      const xPx = d * stride;
      const opacity = absD > 2.4 ? 0 : absD > 1.85 ? (2.4 - absD) / 0.55 : 1;

      el.style.transform = `translate3d(${xPx.toFixed(2)}px, 0px, 0px)`;
      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.pointerEvents = absD < 1.65 ? "auto" : "none";
      el.style.zIndex = String(20 - Math.round(absD * 4));

      const imgEl = cylImgMapRef.current.get(vIdx);
      if (imgEl) {
        // Parabolic vertical expansion matching the outer cylinder flare
        const normD = Math.min(1.25, absD);
        const scaleY = 0.61 + 0.41 * Math.pow(normD, 1.35);
        const parallaxX = Math.max(-7, Math.min(7, -d * 4.2));
        imgEl.style.transform = `translate3d(${parallaxX.toFixed(2)}%, 0, 0) scale(1.12, ${scaleY.toFixed(4)})`;
      }
    });
  }, []);

  // Synchronous frame painter for State 2 (Staggered) & State 3 (Zoom)
  const paintPhotosFrame = useCallback(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const w = stageEl.clientWidth || 1440;
    const isMobile = w <= 960;
    const mix = zoomMixRef.current;

    const baseStride = w * (isMobile ? 0.64 : 0.305);
    const zoomStride = w * (isMobile ? 0.92 : 0.64);
    const stride = baseStride + (zoomStride - baseStride) * mix;
    const pos = photoPosRef.current;

    photoCardMapRef.current.forEach((el, vIdx) => {
      const d = vIdx - pos;
      const absD = Math.abs(d);
      const xPx = d * stride;

      // Artistic editorial vertical wave in State 2 -> centers smoothly in State 3
      const patternIdx = ((vIdx % 4) + 4) % 4;
      const baseStaggerY = (isMobile ? 0.55 : 1) * STAGGER_Y_PATTERN[patternIdx];
      const yPx = baseStaggerY * (1 - mix * Math.max(0, 1 - absD * 0.65));

      const neighborDim = mix > 0.05 && absD > 0.45 ? 1 - 0.22 * mix : 1;
      const edgeFade = absD > 2.6 ? 0 : absD > 2.0 ? (2.6 - absD) / 0.6 : 1;
      const opacity = Math.max(0, Math.min(1, edgeFade * neighborDim));

      el.style.transform = `translate3d(${xPx.toFixed(2)}px, ${yPx.toFixed(2)}px, 0px)`;
      el.style.opacity = String(opacity);
      el.style.pointerEvents = absD < 1.8 ? "auto" : "none";
      el.style.zIndex = absD < 0.45 ? "18" : String(14 - Math.round(absD * 3));
    });
  }, []);

  // Ensure newly mounted virtual slots are positioned BEFORE browser paint (zero flash)
  useLayoutEffect(() => {
    if (mode === "cylinder") {
      paintCylinderFrame();
    } else {
      paintPhotosFrame();
    }
  }, [mode, colBaseStep, photoBaseStep, paintCylinderFrame, paintPhotosFrame]);

  // Continuous 60/120fps physics animation loop
  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const curMode = modeRef.current;
      const dragging = isPointerDownRef.current;

      if (curMode === "cylinder") {
        const lerpFactor = dragging ? 0.36 : 0.105;
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

        paintCylinderFrame();
      } else {
        const lerpFactor = dragging ? 0.36 : 0.115;
        const diff = photoTargetRef.current - photoPosRef.current;
        if (Math.abs(diff) > 0.0004) {
          photoPosRef.current += diff * lerpFactor;
        } else {
          photoPosRef.current = photoTargetRef.current;
        }

        const targetZoom = curMode === "zoom" ? 1 : 0;
        const zDiff = targetZoom - zoomMixRef.current;
        if (Math.abs(zDiff) > 0.001) {
          zoomMixRef.current += zDiff * 0.14;
        } else {
          zoomMixRef.current = targetZoom;
        }

        const rounded = Math.round(photoPosRef.current);
        if (rounded !== photoBaseRef.current) {
          photoBaseRef.current = rounded;
          setPhotoBaseStep(rounded);
        }

        paintPhotosFrame();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [paintCylinderFrame, paintPhotosFrame]);

  // Observe section visibility & first-time entrance reveal
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
      { threshold: 0.12 }
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

  const stepPhotoBy = useCallback(
    (delta: number) => {
      if (photoCount <= 0 || delta === 0) return;
      photoTargetRef.current = Math.round(photoTargetRef.current + delta);
    },
    [photoCount]
  );

  // Gentle auto-glide in State 1 when visible, idle, and not hovered
  useEffect(() => {
    if (
      mode !== "cylinder" ||
      !isInView ||
      isHovered ||
      isDraggingUI ||
      colCount <= 1
    ) {
      return;
    }
    const timer = setInterval(() => {
      if (!isPointerDownRef.current) {
        stepCollectionBy(1);
      }
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [mode, isInView, isHovered, isDraggingUI, colCount, stepCollectionBy]);

  // Global window pointer move/up listeners for smooth uninterrupted phone-like swiping
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;

      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;

      if (!didDragRef.current && Math.hypot(dx, dy) > 7) {
        didDragRef.current = true;
        setIsDraggingUI(true);
      }

      if (didDragRef.current) {
        const curMode = modeRef.current;
        const stride = getStridePx(curMode);
        const nextTarget = dragOriginPosRef.current - dx / stride;

        if (curMode === "cylinder") {
          colTargetRef.current = nextTarget;
        } else {
          photoTargetRef.current = nextTarget;
        }
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
        const curMode = modeRef.current;
        const stride = getStridePx(curMode);
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
          -4.5,
          Math.min(4.5, (-vxPxPerMs * 1000) / stride)
        );

        const activeTarget =
          curMode === "cylinder" ? colTargetRef.current : photoTargetRef.current;
        let snapped = Math.round(activeTarget + vCardsPerSec * 0.22);

        // Ensure deliberate short flicks (> 42px) advance at least 1 item
        const totalDx =
          (clientX ?? (samples[samples.length - 1]?.x || dragStartXRef.current)) -
          dragStartXRef.current;
        const originRounded = Math.round(dragOriginPosRef.current);
        if (snapped === originRounded && Math.abs(totalDx) > 42) {
          snapped = originRounded + (totalDx < 0 ? 1 : -1);
        }

        if (curMode === "cylinder") {
          setColDir(snapped >= colBaseRef.current ? 1 : -1);
          colTargetRef.current = snapped;
        } else {
          photoTargetRef.current = snapped;
        }

        setIsDraggingUI(false);
        // Keep didDragRef true across the synchronous click dispatch, then clear
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 40);
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
  }, [getStridePx]);

  // Keyboard navigation (Left/Right/Escape)
  useEffect(() => {
    if (!isInView) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode === "zoom") setMode("collection");
        else if (mode === "collection") setMode("cylinder");
      } else if (e.key === "ArrowRight") {
        if (mode === "cylinder") stepCollectionBy(1);
        else stepPhotoBy(1);
      } else if (e.key === "ArrowLeft") {
        if (mode === "cylinder") stepCollectionBy(-1);
        else stepPhotoBy(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInView, mode, stepCollectionBy, stepPhotoBy]);

  if (colCount === 0) {
    return null;
  }

  const resolveImageUrl = (rawUrl: string | undefined, fallbackSeed: number) => {
    const fallback =
      FALLBACK_ARCHITECTURAL_IMAGES[
        Math.abs(fallbackSeed) % FALLBACK_ARCHITECTURAL_IMAGES.length
      ];
    if (!rawUrl || !rawUrl.trim() || failedUrls[rawUrl]) {
      return fallback;
    }
    return rawUrl;
  };

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

  const getZoomFittedStyle = (src: string): React.CSSProperties | undefined => {
    const ratio = imgRatios[src];
    if (!ratio) return undefined;
    const stageW =
      stageRef.current?.clientWidth ||
      (typeof window !== "undefined" ? window.innerWidth : 1440);
    const stageH =
      stageRef.current?.clientHeight ||
      (typeof window !== "undefined" ? window.innerHeight * 0.8 : 740);
    const isMobile = stageW <= 960;

    const maxW = isMobile ? stageW * 0.9 : Math.min(stageW * 0.78, 1320);
    const maxH = isMobile ? stageH * 0.82 : Math.min(stageH * 0.9, 820);

    const fitW = Math.min(maxW, maxH * ratio);
    const fitH = fitW / ratio;

    return {
      width: `${Math.round(fitW)}px`,
      height: `${Math.round(fitH)}px`,
    };
  };

  const getCollectionCover = (cIdx: number) => {
    const col = safeCollections[cIdx];
    const candidate = col?.thumbnail || col?.photos?.[0]?.url;
    return resolveImageUrl(candidate, cIdx);
  };

  const handleStagePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("button")) return;

    isPointerDownRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;

    if (mode === "cylinder") {
      colTargetRef.current = colPosRef.current;
      dragOriginPosRef.current = colPosRef.current;
    } else {
      photoTargetRef.current = photoPosRef.current;
      dragOriginPosRef.current = photoPosRef.current;
    }

    pointerSamplesRef.current = [{ x: e.clientX, t: performance.now() }];
  };

  // Horizontal trackpad two-finger glide (does not block vertical page scroll)
  const handleStageWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 3) {
      return;
    }
    const stride = getStridePx(mode);
    const deltaCards = e.deltaX / stride;

    if (mode === "cylinder") {
      colTargetRef.current += deltaCards;
    } else {
      photoTargetRef.current += deltaCards;
    }

    if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
    wheelSnapTimerRef.current = setTimeout(() => {
      if (modeRef.current === "cylinder") {
        colTargetRef.current = Math.round(colTargetRef.current);
      } else {
        photoTargetRef.current = Math.round(photoTargetRef.current);
      }
    }, 160);
  };

  const openCollectionAt = (virtualColIdx: number) => {
    if (didDragRef.current) return;
    colPosRef.current = virtualColIdx;
    colTargetRef.current = virtualColIdx;
    colBaseRef.current = virtualColIdx;
    setColBaseStep(virtualColIdx);

    photoPosRef.current = 0;
    photoTargetRef.current = 0;
    photoBaseRef.current = 0;
    zoomMixRef.current = 0;
    setPhotoBaseStep(0);
    setMode("collection");
  };

  const handlePhotoClick = (virtualPhotoIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragRef.current) return;

    if (mode === "zoom") {
      if (virtualPhotoIdx === photoBaseStep) {
        setMode("collection");
      } else {
        photoTargetRef.current = virtualPhotoIdx;
        photoBaseRef.current = virtualPhotoIdx;
        setPhotoBaseStep(virtualPhotoIdx);
      }
    } else {
      photoTargetRef.current = virtualPhotoIdx;
      photoBaseRef.current = virtualPhotoIdx;
      setPhotoBaseStep(virtualPhotoIdx);
      setMode("zoom");
    }
  };

  const activeVerticalTitle = extractShortCollectionTitle(
    activeCollection.name,
    activeColIdx
  );
  const isLongVerticalTitle = activeVerticalTitle.length > 13;

  return (
    <section
      ref={sectionRef}
      className={`deliverables-compare-section deliv-v2-section deliv-first-reveal mode-${mode} ${
        isLightBg ? "is-light-bg" : "is-dark-bg"
      } ${isDraggingUI ? "is-dragging" : ""} ${hasEntered ? "is-entered" : ""}`}
      id="bo-suu-tap"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Exact Parabolic Concave Cylinder Clip-Path (works with ANY Admin background color!) */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <clipPath
            id="delivConcaveCylinderClip"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M -0.01,-0.01 Q 0.5,0.47 1.01,-0.01 L 1.01,1.01 Q 0.5,0.53 -0.01,1.01 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="deliv-v2-shell">
        {/* TOP HEADER & CONTEXTUAL NAVIGATION BAR */}
        <div className="deliv-v2-top-bar">
          <div className="deliv-v2-brand-title">
            <h2 className="deliv-v2-main-heading">
              {title || "お客様へのお届け成果物コレクション"}
            </h2>
          </div>

          <div className="deliv-v2-context-action">
            <AnimatePresence mode="wait">
              {mode === "collection" && (
                <motion.button
                  key="btn-back-collections"
                  type="button"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="deliv-v2-top-action-btn"
                  onClick={() => setMode("cylinder")}
                >
                  <ArrowLeft size={14} />
                  <span>{(backBtnText && backBtnText.trim()) || "一覧へ戻る"}</span>
                </motion.button>
              )}

              {mode === "zoom" && (
                <motion.button
                  key="btn-close-zoom"
                  type="button"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="deliv-v2-top-action-btn is-close"
                  onClick={() => setMode("collection")}
                >
                  <X size={14} />
                  <span>{(closeZoomBtnText && closeZoomBtnText.trim()) || "拡大表示を閉じる"}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="deliv-v2-side-stamp" aria-hidden="true">
            <span>ARCHIVE GALLERY</span>
          </div>
        </div>

        {/* MAIN 3-STATE INTERACTIVE STAGE */}
        <div
          ref={stageRef}
          className="deliv-v2-stage-viewport"
          onPointerDown={handleStagePointerDown}
          onWheel={handleStageWheel}
          onClick={(e) => {
            if (didDragRef.current) return;
            const target = e.target as HTMLElement;
            if (
              mode === "zoom" &&
              (target.classList.contains("deliv-v2-stage-viewport") ||
                target.classList.contains("deliv-v2-staggered-scene"))
            ) {
              setMode("collection");
            }
          }}
        >
          {/* GIANT VERTICAL ROTATED DISPLAY TITLE (In front in State 1, behind center photo in State 2, hidden in State 3) */}
          <div
            className={`deliv-v2-vertical-title-layer ${
              mode === "cylinder"
                ? "layer-front"
                : mode === "collection"
                ? "layer-behind"
                : "layer-hidden"
            } ${isLongVerticalTitle ? "is-compact" : ""}`}
            aria-hidden="true"
          >
            <div className="deliv-v2-vertical-rotator">
              <div className="deliv-v2-vertical-mask">
                <AnimatePresence initial={false} custom={colDir}>
                  <motion.span
                    key={`vtitle-${activeColIdx}`}
                    custom={colDir}
                    variants={verticalTitleVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    className="deliv-v2-vertical-text"
                  >
                    {activeVerticalTitle}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* STATE 1 vs STATE 2/3 TRACK */}
          <AnimatePresence mode="wait">
            {mode === "cylinder" ? (
              /* ============================================================
                 STATE 1: DRAMATIC CONCAVE CYLINDRICAL PANORAMA (COLLECTIONS)
                 ============================================================ */
              <motion.div
                key="stage-cylinder"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="deliv-v2-cylinder-clip"
                style={{
                  clipPath: "url(#delivConcaveCylinderClip)",
                  WebkitClipPath: "url(#delivConcaveCylinderClip)",
                }}
              >
                <div className="deliv-v2-cylinder-scene">
                  {VIRTUAL_SLOTS.map((slotOffset) => {
                    const virtualIdx = colBaseStep + slotOffset;
                    const cIdx = ((virtualIdx % colCount) + colCount) % colCount;
                    const col = safeCollections[cIdx];
                    const rawThumb = col?.thumbnail || col?.photos?.[0]?.url;
                    const imgSrc = getCollectionCover(cIdx);
                    const isCenter = slotOffset === 0;

                    return (
                      <article
                        key={`cyl-${virtualIdx}`}
                        ref={(el) => {
                          if (el) cylCardMapRef.current.set(virtualIdx, el);
                          else cylCardMapRef.current.delete(virtualIdx);
                        }}
                        className={`deliv-v2-cyl-card ${
                          isCenter ? "is-center" : "is-side"
                        }`}
                        onClick={() => openCollectionAt(virtualIdx)}
                      >
                        <img
                          ref={(imgEl) => {
                            if (imgEl)
                              cylImgMapRef.current.set(virtualIdx, imgEl);
                            else cylImgMapRef.current.delete(virtualIdx);
                          }}
                          src={imgSrc}
                          alt={col?.name || `Collection ${cIdx + 1}`}
                          className="deliv-v2-cyl-img"
                          draggable={false}
                          onError={() => markUrlFailed(rawThumb)}
                        />
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ============================================================
                 STATE 2 & STATE 3: STAGGERED COLLECTION PHOTOS + ZOOM VIEW
                 ============================================================ */
              <motion.div
                key={`stage-collection-${activeColIdx}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="deliv-v2-staggered-scene"
              >
                {VIRTUAL_SLOTS.map((slotOffset) => {
                  const virtualPhotoIdx = photoBaseStep + slotOffset;
                  const pIdx =
                    ((virtualPhotoIdx % photoCount) + photoCount) % photoCount;
                  const photo = activePhotos[pIdx];
                  const rawUrl = photo?.url;
                  const imgSrc = resolveImageUrl(
                    rawUrl,
                    activeColIdx * 10 + pIdx
                  );
                  const isCenter = slotOffset === 0;
                  const isZoom = mode === "zoom";
                  const shapeVariant = ((virtualPhotoIdx % 3) + 3) % 3;
                  const zoomFittedStyle =
                    isZoom && isCenter ? getZoomFittedStyle(imgSrc) : undefined;

                  return (
                    <article
                      key={`photo-${virtualPhotoIdx}`}
                      ref={(el) => {
                        if (el) photoCardMapRef.current.set(virtualPhotoIdx, el);
                        else photoCardMapRef.current.delete(virtualPhotoIdx);
                      }}
                      className={`deliv-v2-photo-card shape-${shapeVariant} ${
                        isCenter ? "is-center" : "is-neighbor"
                      } ${isZoom && isCenter ? "is-zoomed" : ""}`}
                      style={zoomFittedStyle}
                      onClick={(e) => handlePhotoClick(virtualPhotoIdx, e)}
                    >
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
                        alt={
                          photo?.title ||
                          photo?.tag ||
                          `Deliverable ${pIdx + 1}`
                        }
                        className="deliv-v2-photo-img"
                        draggable={false}
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
                    </article>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
