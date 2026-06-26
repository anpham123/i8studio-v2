"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  cursorImage?: string;
  cursorEnabled?: boolean;
  cursorSize?: number;
}

export default function CustomCursor({
  cursorImage,
  cursorEnabled = false,
  cursorSize = 32,
}: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth trail spring configuration
  const springConfig = { damping: 28, stiffness: 280, mass: 0.45 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!cursorEnabled || !cursorImage) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target) {
        // Auto-hide custom cursor on text inputs, textareas, selects, and iframes
        // to let default browser cursors render naturally
        const isInput = !!target.closest("input:not([type='submit']):not([type='button']), textarea, select, iframe");
        setIsVisible(!isInput);

        // Detect if hovering over a clickable/interactive element
        const isInteractive = !!target.closest(
          "a, button, input[type='submit'], input[type='button'], [role='button'], .cursor-pointer, summary"
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Apply global CSS class to disable default cursors
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [cursorEnabled, cursorImage, cursorSize, cursorX, cursorY]);

  if (!cursorEnabled || !cursorImage || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] origin-center hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        width: cursorSize,
        height: cursorSize,
      }}
      animate={{
        scale: isHovered ? 1.35 : 1,
        rotate: isHovered ? 12 : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cursorImage}
        alt="Branding Cursor"
        className="w-full h-full object-contain pointer-events-none"
      />
    </motion.div>
  );
}
