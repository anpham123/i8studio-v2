"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Maximize2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface Panorama360ViewerProps {
  src: string;
}

export default function Panorama360Viewer({ src }: Panorama360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const animRef = useRef<number>();

  // Auto-rotate panorama
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const animate = () => {
      setPosition(prev => ({ ...prev, x: prev.x - 0.3 }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [autoRotate, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartOffset({ ...position });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - startPos.x) * 0.5;
    const dy = (e.clientY - startPos.y) * 0.3;
    setPosition({
      x: startOffset.x + dx,
      y: Math.max(-200, Math.min(200, startOffset.y + dy)),
    });
  }, [isDragging, startPos, startOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setAutoRotate(false);
    setStartPos({ x: t.clientX, y: t.clientY });
    setStartOffset({ ...position });
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = (t.clientX - startPos.x) * 0.5;
    const dy = (t.clientY - startPos.y) * 0.3;
    setPosition({
      x: startOffset.x + dx,
      y: Math.max(-200, Math.min(200, startOffset.y + dy)),
    });
  }, [isDragging, startPos, startOffset]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const zoomIn = () => setZoom(z => Math.min(3, z + 0.3));
  const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.3));
  const toggleAutoRotate = () => setAutoRotate(r => !r);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt="360° Panorama"
        className="absolute top-1/2 left-1/2 h-full pointer-events-none"
        style={{
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          minWidth: "200%",
          objectFit: "cover",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
        draggable={false}
      />

      {/* Drag hint */}
      {!isDragging && autoRotate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 text-white/80 text-sm px-4 py-2 rounded-full animate-pulse">
            🖱 Drag to look around
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="w-9 h-9 rounded-full bg-black/60 text-white/80 hover:bg-black/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          className="w-9 h-9 rounded-full bg-black/60 text-white/80 hover:bg-black/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleAutoRotate(); }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${autoRotate ? "bg-white/20 text-white" : "bg-black/60 text-white/60 hover:bg-black/80 hover:text-white"}`}
        >
          <RotateCw size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          className="w-9 h-9 rounded-full bg-black/60 text-white/80 hover:bg-black/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* 360° badge */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        360° View
      </div>
    </div>
  );
}
