"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export interface DeliverablePhotoItem {
  url?: string;
  tag?: string;
  title?: string;
  aspectRatio?: number;
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

interface NormalizedPhoto {
  url: string;
  rawUrl?: string;
  title: string;
  tag: string;
  aspectRatio?: number;
}

interface ComputedTile {
  photo: NormalizedPhoto;
  globalIndex: number;
  width: number;
  height: number;
}

interface ComputedRow {
  height: number;
  tiles: ComputedTile[];
}

const FALLBACK_ARCHITECTURAL_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85",
];

const MAX_STAGE_PHOTOS = 8;

function resolveCloseZoomLabel(raw?: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "拡大表示を閉じる";
  // Replace legacy Vietnamese placeholder text (e.g. "quay lại trang 2") with Japanese
  if (/quay\s*l[aạ]i|trang\s*\d|đóng/i.test(trimmed)) {
    return "拡大表示を閉じる";
  }
  return trimmed;
}

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

function getCollectionSubtitleStyle(
  rawColor: string | undefined,
  isLightBg: boolean
): React.CSSProperties {
  const chosen = String(rawColor || "").trim();
  if (!chosen) {
    return { color: "#c29b61" };
  }

  const isWhiteish = /^#(?:fff|ffffff|fefefe|fafafa)$/i.test(chosen);
  if (isLightBg && isWhiteish) {
    return { color: "#c29b61" };
  }

  return { color: chosen };
}

function getEnumeratedPartitions(
  n: number,
  maxRows: number,
  maxPerRow: number
): number[][][] {
  const results: number[][][] = [];

  function backtrack(start: number, current: number[][]) {
    if (start === n) {
      results.push(current.map((r) => [...r]));
      return;
    }
    const rowsLeft = maxRows - current.length;
    if (rowsLeft <= 0) return;

    for (let len = 1; len <= Math.min(maxPerRow, n - start); len++) {
      if (n - (start + len) <= (rowsLeft - 1) * maxPerRow) {
        current.push(Array.from({ length: len }, (_, k) => start + k));
        backtrack(start + len, current);
        current.pop();
      }
    }
  }

  backtrack(0, []);
  return results;
}

/**
 * Computes an organic, centered multi-row layout where every photo keeps 100%
 * of its authentic uploaded aspect ratio (width / height) with zero cropping
 * and without forcing rows into a rigid outer rectangular frame/mold.
 */
function computeNaturalMosaic(
  photos: NormalizedPhoto[],
  stageW: number,
  stageH: number,
  gap: number,
  ratioOverrides: Record<string, number>
): ComputedRow[] {
  const visible = photos.slice(0, MAX_STAGE_PHOTOS);
  const n = visible.length;
  if (n === 0 || stageW <= 0 || stageH <= 0) return [];

  const ratios = visible.map((p) => {
    const raw = ratioOverrides[p.url] ?? p.aspectRatio ?? 1.5;
    return Math.max(0.35, Math.min(3.6, raw));
  });

  if (n === 1) {
    const r = ratios[0];
    const w = Math.min(stageW, stageH * r);
    const h = w / r;
    return [
      {
        height: Math.floor(h),
        tiles: [
          {
            photo: visible[0],
            globalIndex: 0,
            width: Math.floor(w),
            height: Math.floor(h),
          },
        ],
      },
    ];
  }

  const isCompactViewport = stageW < 640;
  const maxRows = isCompactViewport ? Math.min(4, n) : n <= 2 ? 2 : 3;
  const maxPerRow = isCompactViewport ? Math.min(3, n) : Math.min(5, n);
  const minAllowedDim = isCompactViewport ? 46 : 65;
  const partitions = getEnumeratedPartitions(n, maxRows, maxPerRow);

  let bestScore = -1;
  let bestRows: ComputedRow[] = [];

  for (const part of partitions) {
    const numRows = part.length;
    const availH = stageH - (numRows - 1) * gap;
    if (availH < numRows * minAllowedDim) continue;

    const rowRatioSums = part.map((indices) =>
      indices.reduce((acc, idx) => acc + ratios[idx], 0)
    );
    const caps = part.map((indices, m) => {
      const availRowW = stageW - (indices.length - 1) * gap;
      return availRowW > 30 ? availRowW / rowRatioSums[m] : -1;
    });

    if (caps.some((c) => c < minAllowedDim)) continue;

    const heights = new Array<number>(numRows).fill(0);
    const locked = new Array<boolean>(numRows).fill(false);
    let remainingH = availH;
    let remainingCount = numRows;

    while (remainingCount > 0) {
      const share = remainingH / remainingCount;
      let lockedAny = false;
      for (let m = 0; m < numRows; m++) {
        if (!locked[m] && caps[m] <= share) {
          heights[m] = caps[m];
          locked[m] = true;
          remainingH -= caps[m];
          remainingCount--;
          lockedAny = true;
        }
      }
      if (!lockedAny) {
        for (let m = 0; m < numRows; m++) {
          if (!locked[m]) {
            heights[m] = share;
            locked[m] = true;
          }
        }
        break;
      }
    }

    if (numRows >= 2) {
      const minRowH = Math.min(...heights);
      for (let m = 0; m < numRows; m++) {
        heights[m] = Math.min(heights[m], minRowH * 1.22);
      }
    }

    let totalArea = 0;
    let minTileDim = Infinity;
    const candidateRows: ComputedRow[] = part.map((indices, m) => {
      const h = Math.floor(heights[m]);
      const tiles: ComputedTile[] = indices.map((idx) => {
        const w = Math.floor(heights[m] * ratios[idx]);
        totalArea += w * h;
        minTileDim = Math.min(minTileDim, w, h);
        return {
          photo: visible[idx],
          globalIndex: idx,
          width: w,
          height: h,
        };
      });
      return { height: h, tiles };
    });

    if (minTileDim < minAllowedDim) continue;

    let factor = 1.0;
    const counts = part.map((r) => r.length);
    const countSpread = Math.max(...counts) - Math.min(...counts);
    if (numRows >= 2 && countSpread <= 1) {
      factor *= 1.08;
    } else if (numRows >= 2 && countSpread >= 3) {
      factor *= 0.88;
    }
    if (!isCompactViewport && n >= 4 && numRows === 1 && minTileDim < 185) {
      factor *= 0.84;
    }
    if (!isCompactViewport && minTileDim < 115) {
      factor *= 0.78;
    }

    const score = totalArea * factor;
    if (score > bestScore) {
      bestScore = score;
      bestRows = candidateRows;
    }
  }

  if (bestRows.length === 0) {
    const cols = isCompactViewport ? Math.min(2, n) : Math.min(3, n);
    const fallbackRows: ComputedRow[] = [];
    const numRows = Math.ceil(n / cols);
    const rowH = Math.max(
      54,
      Math.floor((stageH - (numRows - 1) * gap) / numRows)
    );
    for (let r = 0; r < numRows; r++) {
      const slice = visible.slice(r * cols, (r + 1) * cols);
      const sumR = slice.reduce((acc, _, i) => acc + ratios[r * cols + i], 0);
      const h = Math.max(
        48,
        Math.min(rowH, Math.floor((stageW - (slice.length - 1) * gap) / sumR))
      );
      fallbackRows.push({
        height: h,
        tiles: slice.map((p, i) => {
          const gIdx = r * cols + i;
          return {
            photo: p,
            globalIndex: gIdx,
            width: Math.max(48, Math.floor(h * ratios[gIdx])),
            height: h,
          };
        }),
      });
    }
    return fallbackRows;
  }

  return bestRows;
}

const tileCurtainVariants = {
  enter: (dir: number) => ({
    clipPath: dir >= 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    opacity: 0.98,
  }),
  center: (custom: { dir: number; idx: number }) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: {
      clipPath: {
        duration: 0.58,
        delay: custom.idx * 0.045,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
      opacity: { duration: 0.2 },
    },
  }),
  exit: (dir: number) => ({
    clipPath: dir >= 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
    opacity: 0.98,
    transition: {
      clipPath: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  }),
};

const subtitleSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? 14 : -14,
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? -12 : 12,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  }),
};

export default function LandingDeliverablesShowcase({
  title,
  collections = [],
  collectionNameColor,
  closeZoomBtnText,
  style,
}: LandingDeliverablesShowcaseProps) {
  const safeCollections = useMemo(
    () =>
      Array.isArray(collections) && collections.length > 0 ? collections : [],
    [collections]
  );
  const colCount = safeCollections.length;

  const [activeColIdx, setActiveColIdx] = useState(0);
  const [colDir, setColDir] = useState(1);
  const [zoomPhotoIdx, setZoomPhotoIdx] = useState<number | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [imgRatios, setImgRatios] = useState<Record<string, number>>({});
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>(
    { width: 1240, height: 560 }
  );

  const runwayRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const activeColRef = useRef(0);

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  // Measure center mosaic stage area dynamically so photos always fit cleanly without cropping
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize((prev) =>
          Math.abs(prev.width - rect.width) > 1 ||
          Math.abs(prev.height - rect.height) > 1
            ? { width: rect.width, height: rect.height }
            : prev
        );
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener("resize", updateSize, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Sync scroll position inside the sticky runway to active category index
  useEffect(() => {
    if (colCount <= 1) return;

    const handleScroll = () => {
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const scrollable = Math.max(1, runway.offsetHeight - window.innerHeight);
      if (-rect.top < -40 || -rect.top > scrollable + window.innerHeight) {
        return;
      }

      const clampedRatio = Math.max(0, Math.min(0.999999, -rect.top / scrollable));
      const nextIdx = Math.min(
        colCount - 1,
        Math.max(0, Math.floor(clampedRatio * colCount))
      );

      if (nextIdx !== activeColRef.current) {
        setColDir(nextIdx > activeColRef.current ? 1 : -1);
        activeColRef.current = nextIdx;
        setActiveColIdx(nextIdx);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [colCount]);

  // Lock body scroll when Fullscreen Zoom Lightbox is open
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
    (cIdx: number): NormalizedPhoto[] => {
      const col = safeCollections[cIdx] || {};
      const rawPhotos = Array.isArray(col.photos) ? col.photos : [];
      const nonEmpty = rawPhotos.filter(
        (p) => p && typeof p.url === "string" && p.url.trim().length > 0
      );

      if (nonEmpty.length > 0) {
        return nonEmpty.map((p, pIdx) => ({
          url: resolveImageUrl(p.url, cIdx * 10 + pIdx),
          rawUrl: p.url,
          title: (p.title || "").trim(),
          tag: (p.tag || "").trim(),
          aspectRatio: p.aspectRatio,
        }));
      }

      if (col.thumbnail && col.thumbnail.trim()) {
        return [
          {
            url: resolveImageUrl(col.thumbnail, cIdx),
            rawUrl: col.thumbnail,
            title: (col.name || "").trim(),
            tag: (col.badge || "").trim(),
          },
        ];
      }

      return [];
    },
    [safeCollections, resolveImageUrl]
  );

  const activeCollection = safeCollections[activeColIdx] || {};
  const activePhotos = useMemo(
    () => getPhotosForCollection(activeColIdx),
    [getPhotosForCollection, activeColIdx]
  );
  const photoCount = activePhotos.length;

  // Preload adjacent categories' photos for instant curtain reveal on wheel scroll
  useEffect(() => {
    const neighborIndices = [activeColIdx + 1, activeColIdx - 1].filter(
      (idx) => idx >= 0 && idx < colCount
    );
    neighborIndices.forEach((idx) => {
      getPhotosForCollection(idx)
        .slice(0, MAX_STAGE_PHOTOS)
        .forEach((p) => {
          const img = new window.Image();
          img.src = p.url;
        });
    });
  }, [activeColIdx, colCount, getPhotosForCollection]);

  // Keyboard navigation when Lightbox is open
  useEffect(() => {
    if (zoomPhotoIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomPhotoIdx(null);
      } else if (e.key === "ArrowRight" && photoCount > 1) {
        setZoomPhotoIdx((prev) =>
          prev === null ? null : (prev + 1) % photoCount
        );
      } else if (e.key === "ArrowLeft" && photoCount > 1) {
        setZoomPhotoIdx((prev) =>
          prev === null ? null : (prev - 1 + photoCount) % photoCount
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomPhotoIdx, photoCount]);

  if (colCount === 0) {
    return null;
  }

  const markUrlFailed = (rawUrl?: string) => {
    if (!rawUrl) return;
    setFailedUrls((prev) => (prev[rawUrl] ? prev : { ...prev, [rawUrl]: true }));
  };

  const recordImgRatio = (src: string, w: number, h: number) => {
    if (!src || !w || !h) return;
    const ratio = Number((w / h).toFixed(4));
    setImgRatios((prev) => {
      if (prev[src] && Math.abs(prev[src] - ratio) < 0.005) return prev;
      return { ...prev, [src]: ratio };
    });
  };

  const isLightBg = detectLightBackground(style);
  const subtitleColorStyle = getCollectionSubtitleStyle(
    activeCollection.nameColor || collectionNameColor,
    isLightBg
  );

  const activeCollectionDisplayName =
    (activeCollection.name && activeCollection.name.trim()) ||
    `コレクション ${String(activeColIdx + 1).padStart(2, "0")}`;

  const trimmedMainTitle = (title || "").trim();
  const primaryHeading = trimmedMainTitle || activeCollectionDisplayName;
  const showCategorySubline = Boolean(trimmedMainTitle);
  const closeZoomLabel = resolveCloseZoomLabel(closeZoomBtnText);

  const gapPx = stageSize.width >= 1200 ? 16 : stageSize.width >= 640 ? 12 : 8;
  const mosaicRows = computeNaturalMosaic(
    activePhotos,
    stageSize.width,
    stageSize.height,
    gapPx,
    imgRatios
  );
  const extraCount = Math.max(0, activePhotos.length - MAX_STAGE_PHOTOS);

  const runwayStyle: React.CSSProperties = {
    ...style,
    height: colCount > 1 ? `calc(100vh + ${colCount * 58}vh)` : "100vh",
  };

  return (
    <section
      ref={runwayRef}
      id="bo-suu-tap"
      className={`deliverables-compare-section deliv-scroll-v4 ${
        isLightBg ? "is-light-bg" : "is-dark-bg"
      }`}
      style={runwayStyle}
    >
      <div className="deliv-v4-sticky" style={style}>
        {/* ── Top Centered Editorial Header ─────────────────────────── */}
        <header className="deliv-v4-header">
          <div className="deliv-v4-heading-group">
            <h2 className="deliv-v4-main-title">{primaryHeading}</h2>

            {showCategorySubline && (
              <div className="deliv-v4-subtitle-slot">
                <AnimatePresence mode="wait" custom={colDir}>
                  <motion.p
                    key={`cat-sub-${activeColIdx}`}
                    custom={colDir}
                    variants={subtitleSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="deliv-v4-category-subtitle"
                    style={subtitleColorStyle}
                  >
                    {activeCollectionDisplayName}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* ── Center Multi-Photo Natural-Aspect-Ratio Stage ─────────── */}
        <div className="deliv-v4-stage-outer">
          <div ref={canvasRef} className="deliv-v4-stage-canvas">
            <AnimatePresence mode="wait" custom={colDir}>
              {activePhotos.length > 0 ? (
                <motion.div
                  key={`col-mosaic-${activeColIdx}`}
                  custom={colDir}
                  className="deliv-v4-mosaic-rows"
                  style={{ gap: `${gapPx}px` }}
                >
                  {mosaicRows.map((row, rIdx) => (
                    <div
                      key={`col-${activeColIdx}-row-${rIdx}`}
                      className="deliv-v4-mosaic-row"
                      style={{ gap: `${gapPx}px` }}
                    >
                      {row.tiles.map((tile) => {
                        const isLastWithExtra =
                          extraCount > 0 &&
                          tile.globalIndex === MAX_STAGE_PHOTOS - 1;
                        const caption = tile.photo.title || tile.photo.tag;

                        return (
                          <motion.button
                            key={`tile-${activeColIdx}-${tile.globalIndex}-${tile.photo.url}`}
                            type="button"
                            onClick={() => setZoomPhotoIdx(tile.globalIndex)}
                            custom={{ dir: colDir, idx: tile.globalIndex }}
                            variants={tileCurtainVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{
                              width: `${tile.width}px`,
                              height: `${tile.height}px`,
                            }}
                            className="deliv-v4-tile"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <motion.img
                              ref={(imgEl) => {
                                if (
                                  imgEl &&
                                  imgEl.complete &&
                                  imgEl.naturalWidth > 0 &&
                                  imgEl.naturalHeight > 0
                                ) {
                                  recordImgRatio(
                                    tile.photo.url,
                                    imgEl.naturalWidth,
                                    imgEl.naturalHeight
                                  );
                                }
                              }}
                              src={tile.photo.url}
                              alt={
                                caption ||
                                `${activeCollectionDisplayName} ${
                                  tile.globalIndex + 1
                                }`
                              }
                              initial={{ scale: 1.06 }}
                              animate={{
                                scale: 1,
                                transition: {
                                  duration: 0.72,
                                  delay: tile.globalIndex * 0.045,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              }}
                              onLoad={(e) => {
                                const img = e.currentTarget;
                                recordImgRatio(
                                  tile.photo.url,
                                  img.naturalWidth,
                                  img.naturalHeight
                                );
                              }}
                              onError={() => markUrlFailed(tile.photo.rawUrl)}
                              draggable={false}
                              className="deliv-v4-tile-img"
                            />

                            <div className="deliv-v4-tile-overlay">
                              {caption ? (
                                <span className="deliv-v4-tile-caption">
                                  {caption}
                                </span>
                              ) : (
                                <span />
                              )}
                              <span
                                className="deliv-v4-tile-zoom-icon"
                                aria-hidden="true"
                              >
                                <Maximize2 size={12} />
                              </span>
                            </div>

                            {isLastWithExtra && (
                              <div className="deliv-v4-tile-extra">
                                +{extraCount}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`col-empty-${activeColIdx}`}
                  custom={colDir}
                  variants={subtitleSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="deliv-v4-empty-state"
                >
                  <p>{activeCollectionDisplayName}</p>
                  <span>ビジュアル準備中</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Uncropped Zoom Lightbox Portal ────────────────── */}
      {portalMounted &&
        zoomPhotoIdx !== null &&
        activePhotos[zoomPhotoIdx] &&
        createPortal(
          <div
            className="deliv-edit-zoom-backdrop"
            onClick={() => setZoomPhotoIdx(null)}
          >
            <div
              className="deliv-edit-zoom-topbar"
              style={{ justifyContent: "space-between" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem" }}>
                <span>{activeCollectionDisplayName}</span>
                <span style={{ marginLeft: "10px", opacity: 0.6 }}>
                  {zoomPhotoIdx + 1} / {photoCount}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZoomPhotoIdx(null)}
                className="deliv-edit-zoom-close-btn"
              >
                <X size={15} />
                <span>{closeZoomLabel}</span>
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
                aria-label="前の画像"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              className="deliv-edit-zoom-stage"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhotos[zoomPhotoIdx].url}
                alt={
                  activePhotos[zoomPhotoIdx].title ||
                  `${activeCollectionDisplayName} ${zoomPhotoIdx + 1}`
                }
                className="deliv-edit-zoom-img"
              />
              {activePhotos[zoomPhotoIdx].title && (
                <p className="deliv-edit-zoom-caption">
                  {activePhotos[zoomPhotoIdx].title}
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
                aria-label="次の画像"
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
