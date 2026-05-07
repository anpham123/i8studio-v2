"use client";

import { useEffect } from "react";

interface Props {
  bgGlobal: string;
  overlayOpacity: number;
}

export default function GlobalBackground({ bgGlobal, overlayOpacity }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[GlobalBackground] bgGlobal:", bgGlobal || "(empty)");
      console.log("[GlobalBackground] overlayOpacity:", overlayOpacity);
    }
  }, [bgGlobal, overlayOpacity]);

  if (!bgGlobal) return null;
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundImage: `linear-gradient(rgba(10,10,15,${overlayOpacity}),rgba(10,10,15,${overlayOpacity})),url("${bgGlobal}")`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundColor: "#0a0a0f",
      }}
    />
  );
}
