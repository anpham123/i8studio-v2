"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Props = {
  beforeImage?: string;
  afterImage?: string;
  before?: string; // alias for backward compatibility
  after?: string;  // alias for backward compatibility
  beforeLabel?: string;  // default: "Before"
  afterLabel?: string;   // default: "After"
  beforeAlt?: string;
  afterAlt?: string;
  orientation?: "horizontal" | "vertical"; // default: "horizontal"
  initialPosition?: number; // 0-100, default: 50
  aspectRatio?: string; // e.g. "16/10", "4/3", "1/1" — default "16/10" for new
  fillContainer?: boolean;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeAlt = "Original",
  afterAlt = "Enhanced",
  orientation = "horizontal",
  initialPosition = 50,
  aspectRatio, // Keep optional for backward compatibility
  fillContainer = false,
}: Props) {
  const finalBeforeImage = beforeImage || before || "";
  const finalAfterImage = afterImage || after || "";

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef<boolean>(false);

  // Aspect ratio check & warning
  useEffect(() => {
    if (!finalBeforeImage || !finalAfterImage) return;

    const imgBefore = new Image();
    const imgAfter = new Image();
    let beforeRatio = 0;
    let afterRatio = 0;

    const checkRatios = () => {
      if (beforeRatio && afterRatio) {
        const diff = Math.abs(beforeRatio - afterRatio);
        if (diff > 0.05) {
          console.warn(
            `BeforeAfterSlider: Aspect ratios of Before and After images differ significantly (Before: ${beforeRatio.toFixed(
              2
            )}, After: ${afterRatio.toFixed(2)}). Images should ideally have identical dimensions.`,
            { before: finalBeforeImage, after: finalAfterImage }
          );
        }
      }
    };

    imgBefore.onload = () => {
      beforeRatio = imgBefore.naturalWidth / imgBefore.naturalHeight;
      checkRatios();
    };
    imgAfter.onload = () => {
      afterRatio = imgAfter.naturalWidth / imgAfter.naturalHeight;
      checkRatios();
    };

    imgBefore.src = finalBeforeImage;
    imgAfter.src = finalAfterImage;
  }, [finalBeforeImage, finalAfterImage]);

  // First-load hint animation: 50 -> 43 -> 57 -> 50 on mount if no interaction
  useEffect(() => {
    if (hasInteracted) return;

    const easeInOutQuad = (x: number) => {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    };

    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;

      if (elapsed < 300) {
        setPosition(50);
        animationFrameId = requestAnimationFrame(animate);
      } else if (elapsed >= 300 && elapsed < 600) {
        const pct = (elapsed - 300) / 300;
        setPosition(50 + (43 - 50) * easeInOutQuad(pct));
        animationFrameId = requestAnimationFrame(animate);
      } else if (elapsed >= 600 && elapsed < 900) {
        const pct = (elapsed - 600) / 300;
        setPosition(43 + (57 - 43) * easeInOutQuad(pct));
        animationFrameId = requestAnimationFrame(animate);
      } else if (elapsed >= 900 && elapsed < 1200) {
        const pct = (elapsed - 900) / 300;
        setPosition(57 + (50 - 57) * easeInOutQuad(pct));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setPosition(50);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasInteracted]);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      setHasInteracted(true);
      const rect = containerRef.current.getBoundingClientRect();
      if (orientation === "horizontal") {
        const x = clientX - rect.left;
        const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(pct);
      } else {
        const y = clientY - rect.top;
        const pct = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setPosition(pct);
      }
    },
    [orientation]
  );

  // Mouse drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    updatePosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          hasDraggedRef.current = true;
        }
      }
      updatePosition(e.clientX, e.clientY);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, updatePosition]);

  // Touch drag events
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: t.clientX, y: t.clientY };
    updatePosition(t.clientX, t.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    if (dragStartRef.current) {
      const dx = t.clientX - dragStartRef.current.x;
      const dy = t.clientY - dragStartRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        hasDraggedRef.current = true;
      }
    }
    updatePosition(t.clientX, t.clientY);
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Click-to-jump handler
  const handleClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (!isDragging) {
      updatePosition(e.clientX, e.clientY);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    setHasInteracted(true);
    if (orientation === "horizontal") {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((p) => Math.max(0, p - 5));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((p) => Math.min(100, p + 5));
      }
    } else {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosition((p) => Math.max(0, p - 5));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosition((p) => Math.min(100, p + 5));
      }
    }
  };

  const isHorizontal = orientation === "horizontal";

  // If before and after are same/missing, fall back to simple image rendering
  if (!finalBeforeImage || !finalAfterImage || finalBeforeImage === finalAfterImage) {
    const fallbackImage = finalAfterImage || finalBeforeImage;
    return (
      <div
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {fallbackImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fallbackImage}
            alt={afterAlt}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        )}
        {beforeLabel && (
          <span
            className="absolute bottom-[18px] left-[18px] text-[11px] px-3.5 py-[5px] rounded-[20px] z-10"
            style={{ background: "rgba(255,255,255,0.92)", color: "#555", border: "0.5px solid #ddd" }}
          >
            {beforeLabel}
          </span>
        )}
      </div>
    );
  }

  const clipStyle = isHorizontal
    ? { clipPath: `inset(0 ${100 - position}% 0 0)` }
    : { clipPath: `inset(0 0 ${100 - position}% 0)` };

  const handleStyle = isHorizontal
    ? { left: `${position}%`, top: "50%", transform: "translate(-50%, -50%)" }
    : { top: `${position}%`, left: "50%", transform: "translate(-50%, -50%)" };

  const lineStyle = isHorizontal
    ? { left: `${position}%`, top: 0, bottom: 0, width: "2px", transform: "translateX(-50%)" }
    : { top: `${position}%`, left: 0, right: 0, height: "2px", transform: "translateY(-50%)" };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before/After comparison slider"
      tabIndex={0}
      className={`relative overflow-hidden select-none bg-gray-100 outline-none ${
        isHorizontal ? "cursor-ew-resize" : "cursor-ns-resize"
      } ${fillContainer ? "w-full h-full" : "w-full h-full"}`}
      style={fillContainer ? undefined : (aspectRatio ? { aspectRatio } : undefined)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* AFTER image (bottom layer, fully visible) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalAfterImage}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* BEFORE image (top layer, clipped by position) */}
      <div className="absolute inset-0" style={clipStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={finalBeforeImage}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] pointer-events-none z-10"
        style={lineStyle}
      />

      {/* Draggable handle */}
      <div
        className="absolute w-11 h-11 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.25)] flex items-center justify-center pointer-events-none border border-white/80 z-20"
        style={handleStyle}
      >
        {isHorizontal ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" transform="rotate(180 12 12)" />
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" transform="rotate(180 12 12)" />
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      {/* Labels */}
      {beforeLabel && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider text-[#111] pointer-events-none z-10">
          {beforeLabel}
        </div>
      )}
      {afterLabel && (
        <div className="absolute top-4 right-4 bg-[#111]/85 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider text-white pointer-events-none z-10">
          {afterLabel}
        </div>
      )}
    </div>
  );
}
