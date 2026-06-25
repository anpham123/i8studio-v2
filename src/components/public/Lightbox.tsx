"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

const Panorama360Viewer = dynamic(() => import("./Panorama360Viewer"), { ssr: false });

interface LightboxProps {
  src: string;
  alt: string;
  isVideo?: boolean;
  type?: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt, isVideo, type, onClose }: LightboxProps) {
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
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Media container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {is360 ? (
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
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: "90vw",
                maxHeight: "calc(100vh - 80px)",
                objectFit: "contain",
                borderRadius: 12,
                display: "block",
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Portal: render directly into document.body, escaping PageTransition stacking context
  return createPortal(modalContent, document.body);
}
