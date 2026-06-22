"use client";

import { useState, useRef, useCallback } from "react";

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
  const [pos, setPos] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = useCallback(() => { dragging.current = true; }, []);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging.current) updatePos(e.clientX);
  }, [updatePos]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-col-resize overflow-hidden"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onClick={(e) => updatePos(e.clientX)}
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
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg z-10"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <path d="M8 5l-5 7 5 7" />
            <path d="M16 5l5 7-5 7" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span
        className="absolute top-4 left-4 text-[11px] px-3 py-1 rounded-full z-10"
        style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-4 right-4 text-[11px] px-3 py-1 rounded-full z-10"
        style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
