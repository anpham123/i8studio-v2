"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updatePos(e.clientX);
  }, [updatePos]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging.current) updatePos(e.clientX);
  }, [updatePos]);

  // If before and after are the same image, show normal image (no slider)
  if (!before || !after || before === after) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after || before}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span
          className="absolute bottom-[18px] left-[18px] text-[11px] px-3.5 py-[5px] rounded-[20px] z-10"
          style={{ background: "rgba(255,255,255,0.92)", color: "#555", border: "0.5px solid #ddd" }}
        >
          {beforeLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-col-resize overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      style={{ touchAction: "none" }}
    >
      {/* After image (bottom layer — full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (top layer — clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%", maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] z-10"
        style={{
          left: `${pos}%`,
          transform: "translateX(-50%)",
          background: "white",
          boxShadow: "0 0 8px rgba(0,0,0,0.4)",
        }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
            <path d="M8 5l-5 7 5 7" />
            <path d="M16 5l5 7-5 7" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span
        className="absolute top-4 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.65)", color: "white", backdropFilter: "blur(4px)" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-4 right-4 text-[11px] font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.65)", color: "white", backdropFilter: "blur(4px)" }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
