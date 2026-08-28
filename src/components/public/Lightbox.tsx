"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import dynamic from "next/dynamic";

import Panorama360Viewer from "./Panorama360Viewer";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface LightboxProps {
  src: string;
  beforeImage?: string;
  alt: string;
  isVideo?: boolean;
  type?: string;
  title?: string;
  onClose: () => void;
}

export default function Lightbox({ src, beforeImage, alt, isVideo, type, title, onClose }: LightboxProps) {
  const [mounted, setMounted] = useState(false);

  // Guard for SSR — document is undefined on the server
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key + scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const is360 = type?.toLowerCase() === "vr360" || type?.toLowerCase() === "vr";
  const isComposite = (type?.toLowerCase() === "composite" || Boolean(beforeImage)) && Boolean(beforeImage);

  // Don't render on server or before mount
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
        }}
        onClick={onClose}
      >
        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
          {!isVideo && !is360 && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const res = await fetch(src);
                  const blob = await res.blob();
                  const blobUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  const jpName = (alt.split("|")[0] || "image").trim();
                  a.download = `${jpName}.webp`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(blobUrl);
                  document.body.removeChild(a);
                } catch {
                  window.open(src, "_blank");
                }
              }}
              title="Tải ảnh về máy (Tiếng Nhật)"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Download size={18} />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isComposite && beforeImage ? (
            <div className="relative flex flex-col items-center justify-center max-w-[94vw] max-h-[92vh]">
              <div className="w-[90vw] max-w-[1300px] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black">
                <BeforeAfterSlider
                  beforeImage={beforeImage}
                  afterImage={src}
                  beforeLabel="Before"
                  afterLabel="After"
                  autoAspect={true}
                />
              </div>
              {title && (
                <div className="text-white/80 text-[15px] font-medium mt-3 text-center tracking-wide drop-shadow-md">
                  {title}
                </div>
              )}
            </div>
          ) : is360 ? (
            <div className="w-[85vw] h-[75vh] max-w-[1200px] rounded-xl overflow-hidden relative">
              <Panorama360Viewer src={src} />
            </div>
          ) : isVideo ? (
            src.startsWith("/uploads/") ? (
              <video
                src={src}
                controls
                autoPlay
                style={{
                  maxWidth: "90vw",
                  maxHeight: "calc(100vh - 80px)",
                  borderRadius: 12,
                  display: "block",
                }}
              />
            ) : (
              <iframe
                src={src}
                allow="autoplay; fullscreen"
                style={{
                  width: "80vw",
                  maxWidth: 960,
                  aspectRatio: "16/9",
                  borderRadius: 12,
                  display: "block",
                }}
              />
            )
          ) : (
            <div className="relative flex flex-col items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                style={{
                  maxWidth: "94vw",
                  maxHeight: "calc(100vh - 60px)",
                  objectFit: "contain",
                  borderRadius: 14,
                  display: "block",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                }}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Portal: render directly into document.body, escaping PageTransition stacking context
  return createPortal(modalContent, document.body);
}
