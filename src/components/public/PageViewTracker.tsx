"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Detect traffic channel from URL parameters or HTTP referrer
 */
function detectChannel(search: string, referrer: string): { channel: string; utmSource: string; utmMedium: string; utmCampaign: string } {
  const params = new URLSearchParams(search);
  const utmSource = (params.get("utm_source") || "").toLowerCase();
  const utmMedium = (params.get("utm_medium") || "").toLowerCase();
  const utmCampaign = params.get("utm_campaign") || "";

  let channel = "direct";
  const ref = (referrer || "").toLowerCase();

  if (utmSource) {
    if (utmSource.includes("fb") || utmSource.includes("facebook")) channel = "facebook";
    else if (utmSource.includes("insta") || utmSource.includes("ig")) channel = "instagram";
    else if (utmSource.includes("linkedin") || utmSource.includes("li")) channel = "linkedin";
    else if (utmSource.includes("youtube") || utmSource.includes("yt")) channel = "youtube";
    else if (utmSource.includes("google") || utmSource.includes("search")) channel = "google";
    else channel = utmSource;
  } else if (ref) {
    if (ref.includes("facebook.com") || ref.includes("fb.me") || ref.includes("m.facebook.com")) channel = "facebook";
    else if (ref.includes("instagram.com") || ref.includes("l.instagram.com")) channel = "instagram";
    else if (ref.includes("linkedin.com") || ref.includes("lnkd.in")) channel = "linkedin";
    else if (ref.includes("youtube.com") || ref.includes("youtu.be")) channel = "youtube";
    else if (ref.includes("google.") || ref.includes("bing.") || ref.includes("yahoo.")) channel = "google";
    else channel = "other";
  }

  return { channel, utmSource, utmMedium, utmCampaign };
}

/**
 * Silent client component that tracks page views & traffic sources.
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

    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const { channel, utmSource, utmMedium, utmCampaign } = detectChannel(search, referrer);

    // Fire-and-forget — don't block rendering
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        page: pathname,
        metadata: {
          referrer,
          channel,
          utmSource,
          utmMedium,
          utmCampaign,
          ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      }),
    }).catch(() => {
      /* silent */
    });
  }, [pathname]);

  return null; // renders nothing
}
