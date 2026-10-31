"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  ExternalLink,
  Film,
  Images,
  Layers,
  MapPin,
  Maximize2,
  Pause,
  Phone,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
} from "lucide-react";
import type { PricingStackMediaItem, PricingStackPageItem } from "./landingI18n";
import { getProjectPrice, type ProjectItem } from "./LandingGalleryShowcase";

export interface LandingPricingStackShowcaseProps {
  title?: string;
  subtitle?: string;
  galleryInfo?: Record<string, any>;
  pricingPages?: PricingStackPageItem[];
  projects?: ProjectItem[];
  contactHref?: string;
  style?: React.CSSProperties;
  btnZoom?: string;
  btnConsult?: string;
  hotlineText?: string;
  btnViewDetail?: string;
}

/* ============================================================================
   COLOR LUMINANCE HELPERS (Respects Admin CMS custom section & card colors)
   ============================================================================ */
function parseColorLuminance(raw?: string): number | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();

  const hexMatch = trimmed.match(/#([0-9a-fA-F]{3,8})/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  return null;
}

function detectLightSectionBg(style?: React.CSSProperties): boolean {
  const bgStr = String(style?.backgroundColor || style?.background || "");
  const lum = parseColorLuminance(bgStr);
  // Default section background is warm editorial off-white (#F4F3EF -> light)
  if (lum === null) return true;
  return lum > 0.52;
}

function detectLightCardBg(cardBg?: string): boolean {
  const lum = parseColorLuminance(cardBg);
  if (lum === null) return true;
  return lum > 0.48;
}

/* ============================================================================
   VIDEO / EMBED URL HELPERS
   ============================================================================ */
function getEmbedVideoUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // YouTube
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/) ||
    null;
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&rel=0`;
  }
  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
  }
  return null;
}

function isVideoUrl(url?: string, type?: string): boolean {
  if (type === "video") return true;
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || Boolean(getEmbedVideoUrl(url));
}

function isImageFileUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim();
  if (/^data:image\//i.test(clean)) return true;
  if (/images\.unsplash\.com/i.test(clean)) return true;
  return /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i.test(clean);
}

function isWebVrArUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim();
  if (!/^(https?:\/\/|\/)/i.test(clean)) return false;
  if (isImageFileUrl(clean) || isVideoUrl(clean)) return false;
  return true;
}

function formatPageNumber(raw?: string, fallbackIdx: number = 0): string {
  const cleaned = String(raw || `0${fallbackIdx + 1}`).replace(/[()]/g, "").trim();
  return `(${cleaned || `0${fallbackIdx + 1}`})`;
}

/* ============================================================================
   INTERACTIVE 360° EQUIRECTANGULAR WEBGL VIEWER (Three.js)
   ============================================================================ */
interface Panorama360Props {
  imageUrl: string;
  isActive: boolean;
  className?: string;
  autoRotateSpeed?: number;
}

const InteractivePanorama360: React.FC<Panorama360Props> = ({
  imageUrl,
  isActive,
  className = "",
  autoRotateSpeed = 0.06,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isActiveRef = useRef<boolean>(isActive);
  isActiveRef.current = isActive;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !imageUrl) return;

    setIsLoaded(false);
    setHasError(false);

    let disposed = false;
    let rafId = 0;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 200);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, width / height, 1, 1100);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setHasError(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let loadedTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageUrl,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        loadedTexture = tex;
        material.map = tex;
        material.needsUpdate = true;
        setIsLoaded(true);
        renderer.render(scene, camera);
      },
      undefined,
      () => {
        if (!disposed) setHasError(true);
      }
    );

    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let startLon = 18;
    let startLat = 0;
    let lon = 18;
    let lat = 0;
    let targetLon = 18;
    let targetLat = 0;
    let lastInteractionTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      e.stopPropagation();
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      startLon = targetLon;
      startLat = targetLat;
      lastInteractionTime = performance.now();
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      e.stopPropagation();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      targetLon = startLon - dx * 0.18;
      targetLat = Math.max(-80, Math.min(80, startLat + dy * 0.18));
      lastInteractionTime = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      lastInteractionTime = performance.now();
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const domEl = renderer.domElement;
    domEl.style.width = "100%";
    domEl.style.height = "100%";
    domEl.style.display = "block";
    domEl.style.touchAction = "none";
    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointermove", onPointerMove);
    domEl.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 200);
      const h = Math.max(container.clientHeight, 160);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(container);

    const animate = () => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(animate);

      if (!isActiveRef.current) return;

      const now = performance.now();
      if (!isPointerDown && now - lastInteractionTime > 1600) {
        targetLon += autoRotateSpeed;
      }

      lon += (targetLon - lon) * 0.14;
      lat += (targetLat - lat) * 0.14;

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointermove", onPointerMove);
      domEl.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("pointercancel", onPointerUp);
      geometry.dispose();
      material.dispose();
      if (loadedTexture) loadedTexture.dispose();
      renderer.dispose();
    };
  }, [imageUrl, autoRotateSpeed]);

  if (hasError) {
    return (
      <div className={`pricing-stack-v2-vr-fallback ${className}`}>
        <img src={imageUrl} alt="360 Panorama" />
      </div>
    );
  }

  return (
    <div className={`pricing-stack-v2-vr-canvas-wrap ${className}`}>
      <div ref={mountRef} className="pricing-stack-v2-vr-canvas" />
      {!isLoaded && (
        <div className="pricing-stack-v2-vr-loading">
          <img src={imageUrl} alt="Loading 360" className="pricing-stack-v2-vr-poster" />
          <span className="pricing-stack-v2-vr-spinner">360° VR 読み込み中...</span>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   INLINE MOVIE PLAYER FOR CARD 03
   ============================================================================ */
interface InlineMovieShowcaseProps {
  items: PricingStackMediaItem[];
  isActive: boolean;
  badgeText?: string;
  expandText?: string;
  onOpenFullscreen: (index: number) => void;
}

const InlineMovieShowcase: React.FC<InlineMovieShowcaseProps> = ({
  items,
  isActive,
  badgeText,
  expandText,
  onOpenFullscreen,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const safeItems = items.length > 0 ? items : [];
  const activeItem = safeItems[selectedIdx] || safeItems[0];
  const embedUrl = getEmbedVideoUrl(activeItem?.url);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive && isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive, isPlaying, selectedIdx]);

  if (!activeItem) return null;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="pricing-stack-v2-movie-box">
      <div
        className="pricing-stack-v2-movie-stage"
        onClick={() => onOpenFullscreen(selectedIdx)}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={activeItem.caption || "Architectural Movie"}
            className="pricing-stack-v2-movie-iframe"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            key={activeItem.url}
            src={activeItem.url}
            poster={activeItem.poster || activeItem.thumbnail}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="pricing-stack-v2-movie-video"
          />
        )}

        <div className="pricing-stack-v2-movie-badge-top">
          <Film className="w-3.5 h-3.5" />
          <span>{badgeText || "4K ARCHITECTURAL FILM"}</span>
        </div>

        <div className="pricing-stack-v2-movie-controls" onClick={(e) => e.stopPropagation()}>
          {!embedUrl && (
            <>
              <button
                type="button"
                onClick={togglePlay}
                className="pricing-stack-v2-ctrl-btn"
                title={isPlaying ? "一時停止" : "再生"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="pricing-stack-v2-ctrl-btn"
                title={isMuted ? "ミュート解除" : "ミュート"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
          <span className="pricing-stack-v2-movie-caption">
            {activeItem.caption || "シネマティック建築ムービー"}
          </span>
          <button
            type="button"
            onClick={() => onOpenFullscreen(selectedIdx)}
            className="pricing-stack-v2-ctrl-expand"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{expandText || "全画面再生"}</span>
          </button>
        </div>
      </div>

      {safeItems.length > 1 && (
        <div className="pricing-stack-v2-movie-clips">
          {safeItems.map((clip, cIdx) => (
            <button
              key={clip.id || cIdx}
              type="button"
              onClick={() => {
                setSelectedIdx(cIdx);
                setIsPlaying(true);
              }}
              className={`pricing-stack-v2-clip-pill ${selectedIdx === cIdx ? "is-active" : ""}`}
            >
              <Play className="w-3 h-3" />
              <span>{clip.caption || `Clip 0${cIdx + 1}`}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   INLINE VR360 SHOWCASE FOR CARD 04
   ============================================================================ */
interface InlineVR360ShowcaseProps {
  page: PricingStackPageItem;
  isActive: boolean;
  onOpenFullscreenVR: (sceneIdx: number) => void;
}

const InlineVR360Showcase: React.FC<InlineVR360ShowcaseProps> = ({
  page,
  isActive,
  onOpenFullscreenVR,
}) => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const scenes = page.mediaItems && page.mediaItems.length > 0 ? page.mediaItems : [];
  const activeScene = scenes[sceneIdx] || scenes[0];
  const hasExternalEmbed = Boolean(page.vrEmbedUrl && page.vrEmbedUrl.trim());
  const activeSceneIsWebVr = Boolean(activeScene?.url && isWebVrArUrl(activeScene.url));

  return (
    <div className="pricing-stack-v2-vr-box">
      <div className="pricing-stack-v2-vr-stage">
        {hasExternalEmbed ? (
          <iframe
            src={page.vrEmbedUrl}
            title={page.title}
            className="pricing-stack-v2-vr-iframe"
            allow="xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay; fullscreen"
            allowFullScreen
          />
        ) : activeScene && activeSceneIsWebVr ? (
          <iframe
            src={activeScene.url}
            title={activeScene.caption || page.title}
            className="pricing-stack-v2-vr-iframe"
            allow="xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay; fullscreen"
            allowFullScreen
          />
        ) : activeScene ? (
          <InteractivePanorama360
            imageUrl={activeScene.url}
            isActive={isActive}
          />
        ) : null}

        <div className="pricing-stack-v2-vr-hud-top">
          <span className="pricing-stack-v2-vr-drag-hint">
            <Compass className="w-3.5 h-3.5" />
            <span>{page.mediaBadgeText || "360° ドラッグして視点回転"}</span>
          </span>

          <button
            type="button"
            onClick={() => onOpenFullscreenVR(sceneIdx)}
            className="pricing-stack-v2-vr-expand-btn"
          >
            <Expand className="w-3.5 h-3.5" />
            <span>{page.expandBtnText || "全画面VR体験"}</span>
          </button>
        </div>

        {!hasExternalEmbed && scenes.length > 1 && (
          <div className="pricing-stack-v2-vr-scenes">
            {scenes.map((sc, sIdx) => (
              <button
                key={sc.id || sIdx}
                type="button"
                onClick={() => setSceneIdx(sIdx)}
                className={`pricing-stack-v2-vr-scene-btn ${sceneIdx === sIdx ? "is-active" : ""}`}
              >
                {sc.caption || `Scene 0${sIdx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   MAIN COMPONENT: SCROLL-PINNED 3D FOLDING CARD STACK (5 SERVICE PAGES)
   ============================================================================ */
export default function LandingPricingStackShowcase({
  title = "制作料金・ビジュアライゼーションメニュー",
  subtitle = "建築パース（Standard / High Quality）・CGアニメーション・VR360・VR SSの5つの制作ラインナップ",
  galleryInfo,
  pricingPages = [],
  projects = [],
  contactHref = "/ja/contact",
  style,
  btnZoom = "フルサイズで拡大表示",
  btnConsult = "このプランで無料相談・見積依頼",
  hotlineText = "お急ぎの方: 0984 384 190",
  btnViewDetail = "詳細を見る",
}: LandingPricingStackShowcaseProps) {
  const pages = useMemo(() => (Array.isArray(pricingPages) ? pricingPages : []), [pricingPages]);
  const count = pages.length;

  const sectionBgImage = galleryInfo?.sectionBgImage || "";
  const sectionBgOverlay = galleryInfo?.sectionBgOverlay || "none";
  const effectiveSectionStyle = useMemo<React.CSSProperties | undefined>(() => {
    const customInfoColor = galleryInfo?.sectionBgColor;
    if (customInfoColor && typeof customInfoColor === "string" && customInfoColor.trim()) {
      return {
        ...style,
        background: customInfoColor,
        backgroundColor: customInfoColor,
      };
    }
    return style;
  }, [style, galleryInfo?.sectionBgColor]);

  const isLightSection = useMemo(() => {
    if (sectionBgImage) {
      if (
        sectionBgOverlay === "dark-soft" ||
        sectionBgOverlay === "dark-medium" ||
        sectionBgOverlay === "dark-strong"
      ) {
        return false;
      }
      if (sectionBgOverlay === "light") return true;
    }
    return detectLightSectionBg(effectiveSectionStyle);
  }, [sectionBgImage, sectionBgOverlay, effectiveSectionStyle]);

  const resolvedConsultHref = galleryInfo?.consultHref || contactHref;
  const showReferenceProjects = galleryInfo?.showReferenceProjects !== false;
  const resolvedDeliverablesHeading =
    galleryInfo?.deliverablesHeading || "標準納品物・サービス内容";
  const resolvedProjectsHeading =
    galleryInfo?.projectsHeading || "建築・3DCG 実績リファレンス & 概算目安";
  const resolvedProjectsSubheading =
    galleryInfo?.projectsSubheading ||
    "クリックで各プロジェクトの詳細仕様・拡大画像を確認できます";

  const sectionRef = useRef<HTMLElement | null>(null);
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const foldShadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);
  const [isMobileStack, setIsMobileStack] = useState<boolean>(false);
  const [portalMounted, setPortalMounted] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  // Lightbox state for images / videos / 360 fullscreen
  const [lightboxState, setLightboxState] = useState<{
    page: PricingStackPageItem;
    index: number;
    mode: "media" | "vr360";
  } | null>(null);

  // Detail modal state ("詳細を見る →")
  const [detailPage, setDetailPage] = useState<PricingStackPageItem | null>(null);
  const [selectedProjectInModal, setSelectedProjectInModal] = useState<ProjectItem | null>(null);
  const [zoomProjectImg, setZoomProjectImg] = useState<{
    src: string;
    title: string;
    mediaType?: "image" | "video" | "vr360";
    vrEmbedUrl?: string;
    poster?: string;
  } | null>(null);

  useEffect(() => {
    setPortalMounted(true);
    const checkViewport = () => {
      setIsMobileStack(window.innerWidth < 920);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // First-time viewport entrance observer (latches once, never interferes with 3D scroll loop)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
          }
        });
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when any modal/lightbox is open
  useEffect(() => {
    const anyModalOpen = Boolean(lightboxState || detailPage || zoomProjectImg);
    if (!anyModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomProjectImg) {
          setZoomProjectImg(null);
        } else if (lightboxState) {
          setLightboxState(null);
        } else if (selectedProjectInModal) {
          setSelectedProjectInModal(null);
        } else if (detailPage) {
          setDetailPage(null);
        }
      } else if (lightboxState && lightboxState.mode === "media") {
        const mediaCount = lightboxState.page.mediaItems?.length || 0;
        if (mediaCount > 1 && e.key === "ArrowRight") {
          setLightboxState((prev) =>
            prev ? { ...prev, index: (prev.index + 1) % mediaCount } : null
          );
        } else if (mediaCount > 1 && e.key === "ArrowLeft") {
          setLightboxState((prev) =>
            prev ? { ...prev, index: (prev.index - 1 + mediaCount) % mediaCount } : null
          );
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxState, detailPage, selectedProjectInModal, zoomProjectImg]);

  /* ==========================================================================
     60FPS SCROLL-DRIVEN 3D CARD FOLDING ENGINE (Desktop >= 920px)
     ========================================================================== */
  const applyStackTransforms = useCallback(
    (p: number) => {
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const shadeEl = foldShadeRefs.current[i];

        // Decreasing z-index so Card 0 sits on top and lower cards peek from underneath
        el.style.zIndex = String(40 - i);

        const rel = p - i;

        if (rel > 0) {
          // Outgoing card peeling upward & folding backward in 3D perspective
          const fold = Math.min(rel, 1.3);
          const tyPercent = -fold * 116;
          const rotX = Math.min(fold * 40, 46);
          const sc = 1 - Math.min(fold, 1) * 0.035;
          const op = rel > 0.86 ? Math.max(0, 1 - (rel - 0.86) / 0.18) : 1;

          el.style.transform = `perspective(1350px) translate3d(0, ${tyPercent.toFixed(2)}%, 0) rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
          el.style.opacity = op.toFixed(3);
          el.style.pointerEvents = rel > 0.24 ? "none" : "auto";
          el.style.visibility = op <= 0.01 ? "hidden" : "visible";

          if (shadeEl) {
            shadeEl.style.opacity = Math.min(0.28, fold * 0.24).toFixed(3);
          }
        } else {
          // Active card (depth = 0) or cards stacked underneath (depth > 0)
          const depth = -rel;
          const clampedDepth = Math.min(depth, 3.3);
          const sc = 1 - clampedDepth * 0.042;
          // Push lower cards slightly downward so their rounded bottom edge peeks cleanly below the active card
          const tyPx = clampedDepth * 26;
          const op = depth > 3.15 ? Math.max(0, 1 - (depth - 3.15) * 1.6) : 1;

          el.style.transform = `perspective(1350px) translate3d(0, ${tyPx.toFixed(1)}px, 0) rotateX(0deg) scale(${sc.toFixed(4)})`;
          el.style.opacity = op.toFixed(3);
          el.style.pointerEvents = depth < 0.35 ? "auto" : "none";
          el.style.visibility = op <= 0.01 ? "hidden" : "visible";

          if (shadeEl) {
            shadeEl.style.opacity = Math.min(0.18, clampedDepth * 0.055).toFixed(3);
          }
        }
      }
    },
    [count]
  );

  useEffect(() => {
    if (isMobileStack || count <= 1) {
      // Clear inline 3D transforms on mobile stacked layout
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (el) {
          el.style.transform = "";
          el.style.opacity = "";
          el.style.pointerEvents = "";
          el.style.visibility = "";
          el.style.zIndex = "";
        }
      }
      return;
    }

    let rafId = 0;
    let running = true;

    const computeTargetFromScroll = () => {
      const runway = runwayRef.current;
      if (!runway) return;
      const rect = runway.getBoundingClientRect();
      const scrollable = Math.max(1, runway.offsetHeight - window.innerHeight);
      const rawRatio = Math.max(0, Math.min(1, -rect.top / scrollable));
      targetProgressRef.current = rawRatio * (count - 1);
    };

    computeTargetFromScroll();
    progressRef.current = targetProgressRef.current;
    applyStackTransforms(progressRef.current);

    const onScrollOrResize = () => {
      computeTargetFromScroll();
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const tick = () => {
      if (!running) return;
      rafId = window.requestAnimationFrame(tick);

      const diff = targetProgressRef.current - progressRef.current;
      if (Math.abs(diff) > 0.0006) {
        progressRef.current += diff * 0.22;
        applyStackTransforms(progressRef.current);
      } else if (progressRef.current !== targetProgressRef.current) {
        progressRef.current = targetProgressRef.current;
        applyStackTransforms(progressRef.current);
      }

      const nearest = Math.max(0, Math.min(count - 1, Math.round(progressRef.current)));
      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isMobileStack, count, applyStackTransforms]);

  /* ==========================================================================
     QUICK JUMP TO SPECIFIC CARD (01..05)
     ========================================================================== */
  const handleJumpToCard = (idx: number) => {
    if (isMobileStack) {
      const cardEl = cardRefs.current[idx];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setActiveIndex(idx);
      return;
    }

    const runway = runwayRef.current;
    if (!runway || count <= 1) return;
    const runwayTopDoc = runway.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(1, runway.offsetHeight - window.innerHeight);
    const ratio = idx / (count - 1);
    const targetScrollY = runwayTopDoc + ratio * scrollable;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  if (count === 0) return null;

  const runwayHeightStyle: React.CSSProperties | undefined = isMobileStack
    ? undefined
    : { height: `calc(100vh + ${(count - 1) * 80}vh)` };

  const resolveProjectMediaType = (proj: ProjectItem): "image" | "video" | "vr360" => {
    if (
      proj.mediaType === "vr360" ||
      Boolean(proj.vrEmbedUrl && proj.vrEmbedUrl.trim()) ||
      isWebVrArUrl(proj.img)
    ) {
      return "vr360";
    }
    if (proj.mediaType === "video" || isVideoUrl(proj.img)) {
      return "video";
    }
    return "image";
  };

  const resolveProjectVrWebUrl = (proj: ProjectItem): string => {
    if (proj.vrEmbedUrl && proj.vrEmbedUrl.trim()) {
      return proj.vrEmbedUrl.trim();
    }
    if (isWebVrArUrl(proj.img)) {
      return proj.img.trim();
    }
    return "";
  };

  return (
    <section
      ref={sectionRef}
      id="du-an"
      className={`pricing-stack-v2-section pricing-first-reveal ${
        isLightSection ? "is-light-bg" : "is-dark-bg"
      } ${hasEntered ? "is-entered" : ""}`}
      style={effectiveSectionStyle}
    >
      {sectionBgImage && (
        <div className="pricing-stack-v2-sec-bg-layer" aria-hidden="true">
          <img src={sectionBgImage} alt="" className="pricing-stack-v2-sec-bg-img" />
          {sectionBgOverlay !== "none" && (
            <div className={`pricing-stack-v2-sec-bg-overlay is-${sectionBgOverlay}`} />
          )}
        </div>
      )}

      <div
        ref={runwayRef}
        className={`pricing-stack-v2-runway ${isMobileStack ? "is-mobile" : "is-desktop"}`}
        style={runwayHeightStyle}
      >
        <div className="pricing-stack-v2-sticky">
          {/* COMPACT EDITORIAL HEADER + QUICK-JUMP NAVIGATION PILLS */}
          <div className="pricing-stack-v2-topbar">
            <div className="pricing-stack-v2-heading-group">
              <h2 className="pricing-stack-v2-section-title">{title}</h2>
              {subtitle && <p className="pricing-stack-v2-section-sub">{subtitle}</p>}
            </div>

            <nav className="pricing-stack-v2-nav-pills" aria-label="Pricing Service Pages">
              {pages.map((pg, idx) => {
                const isCurr = activeIndex === idx;
                return (
                  <button
                    key={pg.id || idx}
                    type="button"
                    onClick={() => handleJumpToCard(idx)}
                    className={`pricing-stack-v2-nav-pill ${isCurr ? "is-active" : ""}`}
                  >
                    <span className="pricing-stack-v2-pill-num">
                      {formatPageNumber(pg.pageNumber, idx)}
                    </span>
                    <span className="pricing-stack-v2-pill-label">
                      {pg.tabLabel || pg.categoryName}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 3D STACKED CARDS STAGE */}
          <div className="pricing-stack-v2-stage">
            {pages.map((pg, idx) => {
              const hasCardBgImg = Boolean(pg.cardBgImage && pg.cardBgImage.trim());
              const cardOverlay = pg.cardBgOverlay || (hasCardBgImg ? "dark-medium" : "none");
              const isCardLight = hasCardBgImg
                ? cardOverlay === "light"
                : detectLightCardBg(pg.cardBgColor);
              const mediaItems = Array.isArray(pg.mediaItems) ? pg.mediaItems : [];
              const specs = Array.isArray(pg.specs) ? pg.specs : [];
              const isNearActive = isMobileStack || Math.abs(activeIndex - idx) <= 1;

              return (
                <article
                  key={pg.id || idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`pricing-stack-v2-card ${isCardLight ? "card-light" : "card-dark"}`}
                  style={{
                    backgroundColor: pg.cardBgColor || "#DDF1FA",
                  }}
                >
                  {hasCardBgImg && (
                    <div className="pricing-stack-v2-card-bg-layer" aria-hidden="true">
                      <img src={pg.cardBgImage} alt="" className="pricing-stack-v2-card-bg-img" />
                      {cardOverlay !== "none" && (
                        <div className={`pricing-stack-v2-card-bg-overlay is-${cardOverlay}`} />
                      )}
                    </div>
                  )}
                  {/* Subtle dynamic fold shading overlay */}
                  <div
                    ref={(el) => {
                      foldShadeRefs.current[idx] = el;
                    }}
                    className="pricing-stack-v2-fold-shade"
                  />

                  {/* CARD INNER GRID */}
                  <div className="pricing-stack-v2-card-inner">
                    {/* TOP ROW: Title + Quality Badge + Description on Left, (01) on Right */}
                    <header className="pricing-stack-v2-card-header">
                      <div className="pricing-stack-v2-card-title-col">
                        <div className="pricing-stack-v2-badge-row">
                          <span className="pricing-stack-v2-cat-chip">{pg.categoryName}</span>
                          {pg.qualityBadge && (
                            <span className="pricing-stack-v2-quality-chip">
                              <Sparkles className="w-3 h-3" />
                              {pg.qualityBadge}
                            </span>
                          )}
                        </div>

                        <h3 className="pricing-stack-v2-card-title">{pg.title}</h3>

                        {pg.description && (
                          <p className="pricing-stack-v2-card-desc">{pg.description}</p>
                        )}
                      </div>

                      <div className="pricing-stack-v2-card-index-col">
                        <span className="pricing-stack-v2-step-num">
                          {formatPageNumber(pg.pageNumber, idx)}
                        </span>
                      </div>
                    </header>

                    {/* FLOATING RIGHT-EDGE ACTION PILL ("詳細を見る →" like reference video) */}
                    <div className="pricing-stack-v2-mid-action-row">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProjectInModal(null);
                          setDetailPage(pg);
                        }}
                        className="pricing-stack-v2-detail-btn"
                      >
                        <span>{pg.btnDetailText || btnViewDetail}</span>
                        <ArrowRight className="w-4 h-4 pricing-stack-v2-detail-arrow" />
                      </button>
                    </div>

                    {/* BOTTOM ROW: Price & Specs on Left, Interactive Media Showcase on Right */}
                    <div className="pricing-stack-v2-card-bottom">
                      {/* LEFT: PRICE & SPECS */}
                      <div className="pricing-stack-v2-price-panel">
                        <div className="pricing-stack-v2-price-box">
                          {pg.priceLabel && (
                            <span className="pricing-stack-v2-price-label">{pg.priceLabel}</span>
                          )}
                          <div className="pricing-stack-v2-price-main">
                            <span className="pricing-stack-v2-price-val">{pg.priceValue}</span>
                            {pg.priceUnit && (
                              <span className="pricing-stack-v2-price-unit">{pg.priceUnit}</span>
                            )}
                          </div>
                        </div>

                        {specs.length > 0 && (
                          <ul className="pricing-stack-v2-spec-list">
                            {specs.map((sp, sIdx) => (
                              <li key={sIdx} className="pricing-stack-v2-spec-pill">
                                <Check className="w-3.5 h-3.5 shrink-0" />
                                <span>{sp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* RIGHT: INTERACTIVE MEDIA SHOWCASE */}
                      <div className="pricing-stack-v2-media-panel">
                        {pg.mediaMode === "movie" ? (
                          <InlineMovieShowcase
                            items={mediaItems}
                            isActive={isNearActive && !lightboxState && !detailPage}
                            badgeText={pg.mediaBadgeText}
                            expandText={pg.expandBtnText}
                            onOpenFullscreen={(mIdx) =>
                              setLightboxState({ page: pg, index: mIdx, mode: "media" })
                            }
                          />
                        ) : pg.mediaMode === "vr360" ? (
                          <InlineVR360Showcase
                            page={pg}
                            isActive={isNearActive && !lightboxState && !detailPage}
                            onOpenFullscreenVR={(sIdx) =>
                              setLightboxState({ page: pg, index: sIdx, mode: "vr360" })
                            }
                          />
                        ) : (
                          /* GALLERY / VR SS 3-CARD THUMBNAIL STRIP (Matches reference video bottom-right) */
                          <div className="pricing-stack-v2-thumb-grid">
                            {mediaItems.slice(0, 3).map((item, mIdx) => {
                              const isVid = isVideoUrl(item.url, item.type);
                              const isWebVr = isWebVrArUrl(item.url);
                              const extraCount =
                                mIdx === 2 && mediaItems.length > 3 ? mediaItems.length - 3 : 0;

                              return (
                                <button
                                  key={item.id || mIdx}
                                  type="button"
                                  onClick={() =>
                                    setLightboxState({
                                      page: pg,
                                      index: mIdx,
                                      mode: isWebVr || item.type === "vr360" ? "vr360" : "media",
                                    })
                                  }
                                  className="pricing-stack-v2-thumb-card group"
                                >
                                  {isVid ? (
                                    <video
                                      src={item.url}
                                      poster={item.poster || item.thumbnail}
                                      muted
                                      loop
                                      playsInline
                                      autoPlay={isNearActive}
                                      preload="metadata"
                                      className="pricing-stack-v2-thumb-img"
                                    />
                                  ) : isWebVr ? (
                                    item.poster || item.thumbnail ? (
                                      <img
                                        src={item.poster || item.thumbnail}
                                        alt={item.caption || `${pg.title} ${mIdx + 1}`}
                                        loading="lazy"
                                        className="pricing-stack-v2-thumb-img"
                                      />
                                    ) : (
                                      <iframe
                                        src={item.url}
                                        title={item.caption || `${pg.title} VR`}
                                        className="pricing-stack-v2-thumb-img border-0 pointer-events-none"
                                        loading="lazy"
                                      />
                                    )
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={item.caption || `${pg.title} ${mIdx + 1}`}
                                      loading={idx <= 1 ? "eager" : "lazy"}
                                      className="pricing-stack-v2-thumb-img"
                                    />
                                  )}

                                  <div className="pricing-stack-v2-thumb-overlay">
                                    <span className="pricing-stack-v2-thumb-zoom">
                                      <ZoomIn className="w-3.5 h-3.5" />
                                    </span>
                                    {item.caption && (
                                      <span className="pricing-stack-v2-thumb-caption">
                                        {item.caption}
                                      </span>
                                    )}
                                  </div>

                                  {extraCount > 0 && (
                                    <div className="pricing-stack-v2-thumb-more">
                                      +{extraCount}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================
          PORTAL 1: FULLSCREEN UNCROPPED MEDIA LIGHTBOX & FULLSCREEN 360° VR MODAL
          ======================================================================== */}
      {portalMounted &&
        lightboxState &&
        createPortal(
          <div
            className="pricing-stack-v2-lightbox-backdrop"
            onClick={() => setLightboxState(null)}
          >
            <div
              className="pricing-stack-v2-lightbox-shell"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="pricing-stack-v2-lightbox-topbar">
                <div className="pricing-stack-v2-lightbox-meta">
                  <span className="pricing-stack-v2-lightbox-badge">
                    {lightboxState.page.categoryName} · {lightboxState.page.qualityBadge}
                  </span>
                  <h4 className="pricing-stack-v2-lightbox-title">
                    {lightboxState.page.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {(() => {
                    const activeItemUrl =
                      lightboxState.page.mediaItems?.[lightboxState.index]?.url ||
                      lightboxState.page.mediaItems?.[0]?.url ||
                      "";
                    const extVrHref =
                      (lightboxState.page.vrEmbedUrl && lightboxState.page.vrEmbedUrl.trim()) ||
                      (isWebVrArUrl(activeItemUrl) ? activeItemUrl.trim() : "");
                    if (!extVrHref) return null;
                    return (
                      <a
                        href={extVrHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-50 border border-emerald-400/40 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>別タブで開く</span>
                      </a>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => setLightboxState(null)}
                    className="pricing-stack-v2-lightbox-close"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {lightboxState.mode === "vr360" ? (
                <div className="pricing-stack-v2-lightbox-vr-body">
                  {(() => {
                    const sceneUrl =
                      lightboxState.page.mediaItems?.[lightboxState.index]?.url ||
                      lightboxState.page.mediaItems?.[0]?.url ||
                      "";
                    const embedVrHref =
                      (lightboxState.page.vrEmbedUrl && lightboxState.page.vrEmbedUrl.trim()) ||
                      (isWebVrArUrl(sceneUrl) ? sceneUrl.trim() : "");
                    if (embedVrHref && !isImageFileUrl(embedVrHref)) {
                      return (
                        <iframe
                          src={embedVrHref}
                          title={lightboxState.page.title}
                          className="w-full h-full border-0 rounded-2xl"
                          allow="xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay; fullscreen"
                          allowFullScreen
                        />
                      );
                    }
                    return (
                      <InteractivePanorama360
                        imageUrl={embedVrHref || sceneUrl}
                        isActive={true}
                        autoRotateSpeed={0.04}
                        className="pricing-stack-v2-lightbox-vr-canvas"
                      />
                    );
                  })()}

                  {!lightboxState.page.vrEmbedUrl &&
                    (lightboxState.page.mediaItems?.length || 0) > 1 && (
                      <div className="pricing-stack-v2-lightbox-vr-switcher">
                        {lightboxState.page.mediaItems.map((sc, sIdx) => (
                          <button
                            key={sc.id || sIdx}
                            type="button"
                            onClick={() =>
                              setLightboxState((prev) =>
                                prev ? { ...prev, index: sIdx } : null
                              )
                            }
                            className={`pricing-stack-v2-vr-scene-btn ${
                              lightboxState.index === sIdx ? "is-active" : ""
                            }`}
                          >
                            {sc.caption || `Scene 0${sIdx + 1}`}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                (() => {
                  const items = lightboxState.page.mediaItems || [];
                  const curr = items[lightboxState.index] || items[0];
                  if (!curr) return null;
                  const embed = getEmbedVideoUrl(curr.url);
                  const isVid = isVideoUrl(curr.url, curr.type);

                  return (
                    <div className="pricing-stack-v2-lightbox-media-body">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxState((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    index: (prev.index - 1 + items.length) % items.length,
                                  }
                                : null
                            )
                          }
                          className="pricing-stack-v2-lightbox-nav is-prev"
                          aria-label="Previous"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                      )}

                      <div className="pricing-stack-v2-lightbox-stage">
                        {embed ? (
                          <iframe
                            src={embed}
                            title={curr.caption || lightboxState.page.title}
                            className="pricing-stack-v2-lightbox-iframe"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        ) : isVid ? (
                          <video
                            key={curr.url}
                            src={curr.url}
                            controls
                            autoPlay
                            playsInline
                            className="pricing-stack-v2-lightbox-video"
                          />
                        ) : isWebVrArUrl(curr.url) ? (
                          <iframe
                            src={curr.url}
                            title={curr.caption || lightboxState.page.title}
                            className="pricing-stack-v2-lightbox-iframe"
                            allow="xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay; fullscreen"
                            allowFullScreen
                          />
                        ) : (
                          <img
                            src={curr.url}
                            alt={curr.caption || lightboxState.page.title}
                            className="pricing-stack-v2-lightbox-img"
                          />
                        )}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxState((prev) =>
                              prev
                                ? { ...prev, index: (prev.index + 1) % items.length }
                                : null
                            )
                          }
                          className="pricing-stack-v2-lightbox-nav is-next"
                          aria-label="Next"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      )}

                      <div className="pricing-stack-v2-lightbox-footer">
                        <span className="pricing-stack-v2-lightbox-caption">
                          {curr.caption || lightboxState.page.title}
                        </span>
                        <span className="pricing-stack-v2-lightbox-counter">
                          {String(lightboxState.index + 1).padStart(2, "0")} /{" "}
                          {String(items.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================
          PORTAL 2: SERVICE DETAIL & REFERENCE PROJECTS MODAL ("詳細を見る →")
          ======================================================================== */}
      {portalMounted &&
        detailPage &&
        createPortal(
          <div
            className="pricing-stack-v2-modal-backdrop"
            onClick={() => {
              setSelectedProjectInModal(null);
              setDetailPage(null);
            }}
          >
            <div
              className="pricing-stack-v2-modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Top Bar */}
              <div className="pricing-stack-v2-modal-header">
                <div className="pricing-stack-v2-modal-header-left">
                  <span className="pricing-stack-v2-modal-step">
                    {formatPageNumber(detailPage.pageNumber, 0)}
                  </span>
                  <div>
                    <div className="pricing-stack-v2-modal-badges">
                      <span className="pricing-stack-v2-modal-cat">{detailPage.categoryName}</span>
                      {detailPage.qualityBadge && (
                        <span className="pricing-stack-v2-modal-qual">
                          {detailPage.qualityBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="pricing-stack-v2-modal-title">{detailPage.title}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectInModal(null);
                    setDetailPage(null);
                  }}
                  className="pricing-stack-v2-modal-close"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="pricing-stack-v2-modal-body">
                {/* Summary + Price Banner */}
                <div
                  className={`pricing-stack-v2-modal-hero ${
                    detectLightCardBg(detailPage.cardBgColor) ? "is-light-hero" : "is-dark-hero"
                  }`}
                  style={{ backgroundColor: detailPage.cardBgColor || "#E7F2F8" }}
                >
                  <div className="pricing-stack-v2-modal-hero-info">
                    <p className="pricing-stack-v2-modal-summary">
                      {detailPage.detailSummary || detailPage.description}
                    </p>

                    {Array.isArray(detailPage.deliverables) &&
                      detailPage.deliverables.length > 0 && (
                        <div className="pricing-stack-v2-modal-delivs">
                          <h4 className="pricing-stack-v2-modal-subhead">
                            <Layers className="w-4 h-4" />
                            <span>
                              {detailPage.deliverablesHeading || resolvedDeliverablesHeading}
                            </span>
                          </h4>
                          <ul className="pricing-stack-v2-modal-deliv-grid">
                            {detailPage.deliverables.map((dlv, dIdx) => (
                              <li key={dIdx}>
                                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                <span>{dlv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  <div className="pricing-stack-v2-modal-cta-card">
                    <span className="pricing-stack-v2-modal-price-lbl">
                      {detailPage.priceLabel || "参考制作価格"}
                    </span>
                    <div className="pricing-stack-v2-modal-price-row">
                      <span className="pricing-stack-v2-modal-price-val">
                        {detailPage.priceValue}
                      </span>
                      {detailPage.priceUnit && (
                        <span className="pricing-stack-v2-modal-price-unit">
                          {detailPage.priceUnit}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const mode = detailPage.mediaMode === "vr360" ? "vr360" : "media";
                        setLightboxState({ page: detailPage, index: 0, mode });
                      }}
                      className="pricing-stack-v2-modal-preview-btn"
                    >
                      <Images className="w-4 h-4" />
                      <span>
                        {detailPage.modalPreviewBtnText ||
                          (detailPage.mediaMode === "vr360"
                            ? "360° VRを全画面で体験"
                            : detailPage.mediaMode === "movie"
                            ? "サンプル映像を全画面再生"
                            : "サンプル画像をフルサイズで見る")}
                      </span>
                    </button>

                    <a href={resolvedConsultHref} className="pricing-stack-v2-modal-consult-btn">
                      <span>{btnConsult}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    {hotlineText && (
                      <div className="pricing-stack-v2-modal-hotline">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{hotlineText}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Projects from Admin CMS (Preserves existing DB projects) */}
                {showReferenceProjects && Array.isArray(projects) && projects.length > 0 && (
                  <div className="pricing-stack-v2-modal-projects">
                    <div className="pricing-stack-v2-modal-proj-head">
                      <h4>{resolvedProjectsHeading}</h4>
                      <span>{resolvedProjectsSubheading}</span>
                    </div>

                    {selectedProjectInModal ? (
                      <div className="pricing-stack-v2-proj-detail-box">
                        <button
                          type="button"
                          onClick={() => setSelectedProjectInModal(null)}
                          className="pricing-stack-v2-proj-back-btn"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>実績一覧に戻る</span>
                        </button>

                        <div className="pricing-stack-v2-proj-detail-grid">
                          {(() => {
                            const projType = resolveProjectMediaType(selectedProjectInModal);
                            const embedVideo =
                              projType === "video"
                                ? getEmbedVideoUrl(selectedProjectInModal.img)
                                : null;

                            if (projType === "vr360") {
                              const projVrWebUrl = resolveProjectVrWebUrl(selectedProjectInModal);
                              return (
                                <div className="pricing-stack-v2-proj-detail-img-wrap is-interactive-media">
                                  {projVrWebUrl && !isImageFileUrl(projVrWebUrl) ? (
                                    <iframe
                                      src={projVrWebUrl}
                                      title={selectedProjectInModal.title}
                                      className="w-full h-full border-0"
                                      allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <InteractivePanorama360
                                      imageUrl={projVrWebUrl || selectedProjectInModal.img}
                                      isActive={true}
                                      className="w-full h-full"
                                    />
                                  )}
                                  <span className="pricing-stack-v2-proj-media-badge is-vr">
                                    <Compass className="w-3.5 h-3.5" />
                                    <span>{projVrWebUrl ? "VR / AR 体験" : "360° ドラッグして回転"}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setZoomProjectImg({
                                        src: selectedProjectInModal.img,
                                        title: selectedProjectInModal.title,
                                        mediaType: "vr360",
                                        vrEmbedUrl: projVrWebUrl || selectedProjectInModal.vrEmbedUrl,
                                      })
                                    }
                                    className="pricing-stack-v2-proj-zoom-pill is-btn"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                    <span>全画面VR体験</span>
                                  </button>
                                </div>
                              );
                            }

                            if (projType === "video") {
                              return (
                                <div className="pricing-stack-v2-proj-detail-img-wrap is-interactive-media">
                                  {embedVideo ? (
                                    <iframe
                                      src={embedVideo}
                                      title={selectedProjectInModal.title}
                                      className="w-full h-full border-0"
                                      allow="autoplay; fullscreen; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <video
                                      src={selectedProjectInModal.img}
                                      poster={selectedProjectInModal.poster}
                                      controls
                                      autoPlay
                                      playsInline
                                      loop
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setZoomProjectImg({
                                        src: selectedProjectInModal.img,
                                        title: selectedProjectInModal.title,
                                        mediaType: "video",
                                        poster: selectedProjectInModal.poster,
                                      })
                                    }
                                    className="pricing-stack-v2-proj-zoom-pill is-btn is-top-right"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                    <span>全画面再生</span>
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div
                                className="pricing-stack-v2-proj-detail-img-wrap"
                                onClick={() =>
                                  setZoomProjectImg({
                                    src: selectedProjectInModal.img,
                                    title: selectedProjectInModal.title,
                                    mediaType: "image",
                                  })
                                }
                              >
                                <img
                                  src={selectedProjectInModal.img}
                                  alt={selectedProjectInModal.title}
                                />
                                <span className="pricing-stack-v2-proj-zoom-pill">
                                  <ZoomIn className="w-3.5 h-3.5" />
                                  {btnZoom}
                                </span>
                              </div>
                            );
                          })()}

                          <div className="pricing-stack-v2-proj-detail-info">
                            {selectedProjectInModal.catTag && (
                              <span className="pricing-stack-v2-proj-cat">
                                {selectedProjectInModal.catTag}
                              </span>
                            )}
                            <h5>{selectedProjectInModal.title}</h5>
                            {selectedProjectInModal.loc && (
                              <p className="pricing-stack-v2-proj-loc">
                                <MapPin className="w-3.5 h-3.5" />
                                {selectedProjectInModal.loc}
                              </p>
                            )}
                            <div className="pricing-stack-v2-proj-price-badge">
                              {getProjectPrice(selectedProjectInModal)}
                            </div>
                            {(selectedProjectInModal.detailContent ||
                              selectedProjectInModal.narrative) && (
                              <p className="pricing-stack-v2-proj-narrative">
                                {selectedProjectInModal.detailContent ||
                                  selectedProjectInModal.narrative}
                              </p>
                            )}
                            {Array.isArray(selectedProjectInModal.deliverables) &&
                              selectedProjectInModal.deliverables.length > 0 && (
                                <ul className="pricing-stack-v2-proj-deliv-list">
                                  {selectedProjectInModal.deliverables.map((d, i) => (
                                    <li key={i}>
                                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                      <span>{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pricing-stack-v2-proj-cards-grid">
                        {projects.map((proj, pIdx) => {
                          const projType = resolveProjectMediaType(proj);
                          const embedVideo =
                            projType === "video" ? getEmbedVideoUrl(proj.img) : null;

                          return (
                            <div
                              key={proj.id || pIdx}
                              onClick={() => setSelectedProjectInModal(proj)}
                              className="pricing-stack-v2-proj-card"
                            >
                              <div className="pricing-stack-v2-proj-card-img">
                                {projType === "video" ? (
                                  embedVideo ? (
                                    proj.poster ? (
                                      <img src={proj.poster} alt={proj.title} loading="lazy" />
                                    ) : (
                                      <iframe
                                        src={embedVideo}
                                        title={proj.title}
                                        className="w-full h-full border-0 pointer-events-none"
                                      />
                                    )
                                  ) : (
                                    <video
                                      src={proj.img}
                                      poster={proj.poster}
                                      muted
                                      loop
                                      playsInline
                                      autoPlay
                                      preload="metadata"
                                      className="w-full h-full object-cover"
                                    />
                                  )
                                ) : projType === "vr360" && isWebVrArUrl(proj.img) && !proj.poster ? (
                                  <iframe
                                    src={resolveProjectVrWebUrl(proj)}
                                    title={proj.title}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                  />
                                ) : (
                                  <img
                                    src={(!isWebVrArUrl(proj.img) && proj.img) || proj.poster}
                                    alt={proj.title}
                                    loading="lazy"
                                  />
                                )}

                                {projType === "video" && (
                                  <span className="pricing-stack-v2-proj-media-badge is-movie">
                                    <Film className="w-3 h-3" />
                                    <span>MOVIE</span>
                                  </span>
                                )}
                                {projType === "vr360" && (
                                  <span className="pricing-stack-v2-proj-media-badge is-vr">
                                    <Compass className="w-3 h-3" />
                                    <span>360° VR</span>
                                  </span>
                                )}

                                <span className="pricing-stack-v2-proj-card-price">
                                  {getProjectPrice(proj)}
                                </span>
                              </div>
                              <div className="pricing-stack-v2-proj-card-body">
                                {proj.catTag && (
                                  <span className="pricing-stack-v2-proj-card-tag">
                                    {proj.catTag}
                                  </span>
                                )}
                                <h5>{proj.title}</h5>
                                {proj.loc && <p>{proj.loc}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================
          PORTAL 3: PROJECT FULLSCREEN PHOTO / MOVIE / 360° VR ZOOM
          ======================================================================== */}
      {portalMounted &&
        zoomProjectImg &&
        createPortal(
          <div
            className="pricing-stack-v2-lightbox-backdrop"
            onClick={() => setZoomProjectImg(null)}
          >
            <div
              className="pricing-stack-v2-lightbox-shell"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pricing-stack-v2-lightbox-topbar">
                <h4 className="pricing-stack-v2-lightbox-title">{zoomProjectImg.title}</h4>
                <div className="flex items-center gap-2">
                  {zoomProjectImg.mediaType === "vr360" &&
                    (zoomProjectImg.vrEmbedUrl || isWebVrArUrl(zoomProjectImg.src)) && (
                      <a
                        href={(zoomProjectImg.vrEmbedUrl || zoomProjectImg.src).trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-50 border border-emerald-400/40 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>別タブで開く</span>
                      </a>
                    )}
                  <button
                    type="button"
                    onClick={() => setZoomProjectImg(null)}
                    className="pricing-stack-v2-lightbox-close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {zoomProjectImg.mediaType === "vr360" ? (
                <div className="pricing-stack-v2-lightbox-vr-body">
                  {(() => {
                    const targetVr = (
                      (zoomProjectImg.vrEmbedUrl && zoomProjectImg.vrEmbedUrl.trim()) ||
                      (isWebVrArUrl(zoomProjectImg.src) ? zoomProjectImg.src.trim() : "")
                    );
                    if (targetVr && !isImageFileUrl(targetVr)) {
                      return (
                        <iframe
                          src={targetVr}
                          title={zoomProjectImg.title}
                          className="pricing-stack-v2-lightbox-iframe"
                          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay"
                          allowFullScreen
                        />
                      );
                    }
                    return (
                      <InteractivePanorama360
                        imageUrl={targetVr || zoomProjectImg.src}
                        isActive={true}
                        autoRotateSpeed={0.04}
                        className="pricing-stack-v2-lightbox-pano"
                      />
                    );
                  })()}
                </div>
              ) : zoomProjectImg.mediaType === "video" || isVideoUrl(zoomProjectImg.src) ? (
                <div className="pricing-stack-v2-lightbox-media-body">
                  <div className="pricing-stack-v2-lightbox-stage">
                    {getEmbedVideoUrl(zoomProjectImg.src) ? (
                      <iframe
                        src={getEmbedVideoUrl(zoomProjectImg.src)!}
                        title={zoomProjectImg.title}
                        className="pricing-stack-v2-lightbox-iframe"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={zoomProjectImg.src}
                        poster={zoomProjectImg.poster}
                        controls
                        autoPlay
                        playsInline
                        loop
                        className="pricing-stack-v2-lightbox-video"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="pricing-stack-v2-lightbox-media-body">
                  <div className="pricing-stack-v2-lightbox-stage">
                    <img
                      src={zoomProjectImg.src}
                      alt={zoomProjectImg.title}
                      className="pricing-stack-v2-lightbox-img"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
