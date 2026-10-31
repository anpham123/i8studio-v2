"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { Compass, ExternalLink, Play, X } from "lucide-react";

export interface LandingApplicationCardMediaProps {
  image?: string;
  videoUrl?: string;
  vrUrl?: string;
  poster?: string;
  mediaType?: "image" | "video" | "vr" | string;
  title?: string;
  targetTag?: string;
  num?: string;
}

const DEFAULT_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

function getEmbedVideoUrl(url?: string, withSound = false): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const ytMatch =
    trimmed.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/
    ) || null;
  if (ytMatch) {
    const muteParam = withSound ? "0" : "1";
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=${muteParam}&loop=1&playlist=${ytMatch[1]}&rel=0&playsinline=1`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    const muteParam = withSound ? "0" : "1";
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=${muteParam}&loop=1`;
  }
  return null;
}

function isDirectVideoFile(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url.trim());
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
  if (
    isImageFileUrl(clean) ||
    isDirectVideoFile(clean) ||
    Boolean(getEmbedVideoUrl(clean))
  ) {
    return false;
  }
  return true;
}

/* ============================================================================
   Lightweight 360° Equirectangular Viewer (when vrUrl is a 360° image file)
   ============================================================================ */
const Panorama360ModalViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !imageUrl) return;

    setHasError(false);
    let disposed = false;
    let rafId = 0;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, width / height, 1, 1100);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
    let lastInteraction = 0;

    const domEl = renderer.domElement;
    domEl.style.width = "100%";
    domEl.style.height = "100%";
    domEl.style.display = "block";
    domEl.style.touchAction = "none";
    domEl.style.cursor = "grab";

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      startLon = targetLon;
      startLat = targetLat;
      lastInteraction = performance.now();
      domEl.style.cursor = "grabbing";
      try {
        domEl.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      targetLon = startLon - dx * 0.18;
      targetLat = Math.max(-80, Math.min(80, startLat + dy * 0.18));
      lastInteraction = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      lastInteraction = performance.now();
      domEl.style.cursor = "grab";
      try {
        domEl.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointermove", onPointerMove);
    domEl.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 240);
      const h = Math.max(container.clientHeight, 180);
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
      const now = performance.now();
      if (!isPointerDown && now - lastInteraction > 1500) {
        targetLon += 0.05;
      }
      lon += (targetLon - lon) * 0.12;
      lat += (targetLat - lat) * 0.12;
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

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
      loadedTexture?.dispose();
      renderer.dispose();
    };
  }, [imageUrl]);

  if (hasError) {
    return (
      <img
        src={imageUrl}
        alt="360 Panorama"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    );
  }

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default function LandingApplicationCardMedia({
  image,
  videoUrl,
  vrUrl,
  poster,
  mediaType,
  title,
  targetTag,
  num,
}: LandingApplicationCardMediaProps) {
  const [activeModal, setActiveModal] = useState<"video" | "vr" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeModal]);

  const cleanImage = (image || "").trim();
  const cleanVideoUrl = (videoUrl || "").trim();
  const cleanVrUrl = (vrUrl || "").trim();
  const cleanPoster = (poster || "").trim();

  // Detect effective video & VR/AR sources (even if Web VR link like .../index.html was pasted into image)
  const imageLooksLikeVideo =
    isDirectVideoFile(cleanImage) || Boolean(getEmbedVideoUrl(cleanImage));
  const imageLooksLikeWebVr = isWebVrArUrl(cleanImage);

  const resolvedVideoSrc =
    cleanVideoUrl || (imageLooksLikeVideo ? cleanImage : "");
  const hasVideo =
    (mediaType === "video" && Boolean(resolvedVideoSrc)) ||
    (mediaType !== "image" && mediaType !== "vr" && Boolean(resolvedVideoSrc)) ||
    Boolean(cleanVideoUrl) ||
    imageLooksLikeVideo;

  const resolvedVrUrl =
    cleanVrUrl || (imageLooksLikeWebVr ? cleanImage : "");
  const hasVr = Boolean(resolvedVrUrl);

  const validStaticCover =
    cleanPoster ||
    (!imageLooksLikeVideo && !imageLooksLikeWebVr && cleanImage ? cleanImage : "");

  const displayImage = validStaticCover || DEFAULT_FALLBACK_IMG;

  const inlineEmbedVideo = hasVideo ? getEmbedVideoUrl(resolvedVideoSrc, false) : null;
  const modalEmbedVideo = hasVideo ? getEmbedVideoUrl(resolvedVideoSrc, true) : null;

  const handlePrimaryMediaClick = () => {
    if ((mediaType === "vr" || imageLooksLikeWebVr) && hasVr) {
      setActiveModal("vr");
    } else if (hasVideo) {
      setActiveModal("video");
    } else if (hasVr) {
      setActiveModal("vr");
    }
  };

  const isInteractiveCardMedia = hasVideo || hasVr;

  return (
    <>
      <div
        className={`usecase-img-wrap${isInteractiveCardMedia ? " is-interactive-media" : ""}`}
        onClick={isInteractiveCardMedia ? handlePrimaryMediaClick : undefined}
        role={isInteractiveCardMedia ? "button" : undefined}
        tabIndex={isInteractiveCardMedia ? 0 : undefined}
        onKeyDown={
          isInteractiveCardMedia
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePrimaryMediaClick();
                }
              }
            : undefined
        }
      >
        {hasVideo && mediaType !== "vr" ? (
          inlineEmbedVideo ? (
            <iframe
              src={inlineEmbedVideo}
              title={title || "Application Video"}
              className="usecase-img usecase-video-iframe"
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <video
              src={resolvedVideoSrc}
              poster={validStaticCover || undefined}
              className="usecase-img"
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            />
          )
        ) : hasVr && !validStaticCover && isWebVrArUrl(resolvedVrUrl) ? (
          <iframe
            src={resolvedVrUrl}
            title={title || "VR / AR Preview"}
            className="usecase-img usecase-video-iframe"
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera"
            loading="lazy"
          />
        ) : (
          <img
            src={displayImage}
            alt={title || "Application"}
            className="usecase-img"
          />
        )}

        {/* Top-right Interactive Media Action Pills (Video / VR·AR) */}
        {(hasVideo || hasVr) && (
          <div
            className="usecase-media-actions"
            onClick={(e) => e.stopPropagation()}
          >
            {hasVideo && (
              <button
                type="button"
                className="usecase-media-pill is-video"
                onClick={() => setActiveModal("video")}
                title="動画を再生 / Play Video"
              >
                <Play size={12} fill="currentColor" />
                <span>動画</span>
              </button>
            )}
            {hasVr && (
              <button
                type="button"
                className="usecase-media-pill is-vr"
                onClick={() => setActiveModal("vr")}
                title="VR / AR を体験"
              >
                <Compass size={13} />
                <span>VR / AR</span>
              </button>
            )}
          </div>
        )}

        <div className="usecase-badge-row">
          <span className="usecase-target-tag">{targetTag}</span>
          <span className="usecase-num">{num}</span>
        </div>
      </div>

      {/* Fullscreen Portal Modal for Video or VR / AR */}
      {mounted &&
        activeModal &&
        createPortal(
          <div
            className="usecase-media-modal-backdrop"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="usecase-media-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="usecase-media-modal-header">
                <div className="usecase-media-modal-title-group">
                  {targetTag && (
                    <span className="usecase-media-modal-badge">{targetTag}</span>
                  )}
                  <h4 className="usecase-media-modal-title">
                    {title || (activeModal === "vr" ? "VR / AR Experience" : "Video Preview")}
                  </h4>
                </div>
                <div className="usecase-media-modal-controls">
                  {activeModal === "vr" && resolvedVrUrl && (
                    <a
                      href={resolvedVrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="usecase-media-modal-ext-btn"
                    >
                      <ExternalLink size={14} />
                      <span>別タブで開く</span>
                    </a>
                  )}
                  <button
                    type="button"
                    className="usecase-media-modal-close"
                    onClick={() => setActiveModal(null)}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="usecase-media-modal-stage">
                {activeModal === "video" && hasVideo && (
                  modalEmbedVideo ? (
                    <iframe
                      src={modalEmbedVideo}
                      title={title || "Video Player"}
                      className="usecase-media-modal-iframe"
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={resolvedVideoSrc}
                      poster={validStaticCover || undefined}
                      className="usecase-media-modal-video"
                      controls
                      autoPlay
                      playsInline
                    />
                  )
                )}

                {activeModal === "vr" && hasVr && (
                  isImageFileUrl(resolvedVrUrl) ? (
                    <Panorama360ModalViewer imageUrl={resolvedVrUrl} />
                  ) : (
                    <iframe
                      src={resolvedVrUrl}
                      title={title || "VR / AR Viewer"}
                      className="usecase-media-modal-iframe"
                      allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; magnetometer; camera; autoplay"
                      allowFullScreen
                    />
                  )
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
