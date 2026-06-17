"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Silent client component that tracks page views.
 * Sends a POST to /api/analytics on every route change.
 * Deduplicates so the same path isn't logged twice in a row.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;
    // Skip admin routes
    if (pathname.startsWith("/admin")) return;

    lastTracked.current = pathname;

    // Fire-and-forget — don't block rendering
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        page: pathname,
        metadata: {
          referrer: typeof document !== "undefined" ? document.referrer : "",
          ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      }),
    }).catch(() => {
      /* silent */
    });
  }, [pathname]);

  return null; // renders nothing
}
