import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const UPSTREAM_ORIGIN = "https://vr.i8studio.vn";

/**
 * Proxies AR 3D model-viewer embeds from vr.i8studio.vn for the Solution AR hero section,
 * enlarging the initial 3D model presentation while preserving all interactive UI controls
 * (material selector, specification panel, screenshot button, and 360° orbit/zoom controls).
 */
export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const pathSegments = context.params?.path || [];
  if (
    pathSegments.length === 0 ||
    pathSegments.some((seg) => seg === ".." || seg.includes("\\"))
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const relativePath = pathSegments.map(encodeURIComponent).join("/");
  const search = request.nextUrl.search || "";
  const targetUrl = `${UPSTREAM_ORIGIN}/${relativePath}${search}`;

  const forwardHeaders = new Headers();
  const range = request.headers.get("range");
  if (range) forwardHeaders.set("range", range);
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch) forwardHeaders.set("if-none-match", ifNoneMatch);
  const ifModifiedSince = request.headers.get("if-modified-since");
  if (ifModifiedSince) forwardHeaders.set("if-modified-since", ifModifiedSince);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, {
      headers: forwardHeaders,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach upstream AR server" },
      { status: 502 }
    );
  }

  const contentType = upstreamRes.headers.get("content-type") || "";
  const isHtml =
    contentType.includes("text/html") || relativePath.toLowerCase().endsWith(".html");

  if (isHtml && upstreamRes.ok) {
    let html = await upstreamRes.text();

    // Update <model-viewer> attributes so the 3D house loads at ~2.2x size immediately
    html = html
      .replace(
        /min-camera-orbit\s*=\s*"[^"]*"/i,
        'min-camera-orbit="auto 30deg 80m"'
      )
      .replace(
        /max-camera-orbit\s*=\s*"[^"]*"/i,
        'max-camera-orbit="auto 90deg 220m"'
      )
      .replace(
        /min-field-of-view\s*=\s*"[^"]*"/i,
        'field-of-view="13.5deg" min-field-of-view="6deg" max-field-of-view="35deg"'
      )
      // Fix: upstream references poster.webp but only poster.png exists
      .replace(/poster\.webp/g, "poster.png");

    // Inject CSS & JS to keep the enlarged model centered above the Hero typography
    // while keeping the left info panel and right action buttons untouched.
    const heroZoomInjection = `
  <style id="i8-ar-hero-zoom-style">
    model-viewer#myModel, model-viewer {
      width: 100% !important;
      height: 100% !important;
      transform: translateY(-5%);
    }
    model-viewer::part(default-poster) {
      transform: scale(2.15);
    }
  </style>
  <script id="i8-ar-hero-zoom-script">
    (function () {
      function applyEnlargedHeroView() {
        var mv = document.getElementById("myModel") || document.querySelector("model-viewer");
        if (!mv) return;
        mv.minCameraOrbit = "auto 30deg 80m";
        mv.maxCameraOrbit = "auto 90deg 220m";
        mv.minFieldOfView = "6deg";
        mv.maxFieldOfView = "35deg";
        mv.fieldOfView = "13.5deg";
        if (typeof mv.jumpCameraToGoal === "function") {
          mv.jumpCameraToGoal();
        }
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyEnlargedHeroView);
      } else {
        applyEnlargedHeroView();
      }
      window.addEventListener("load", function () {
        var mv = document.getElementById("myModel") || document.querySelector("model-viewer");
        if (!mv) return;
        applyEnlargedHeroView();
        mv.addEventListener("load", applyEnlargedHeroView, { once: true });
      });
    })();
  </script>`;

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${heroZoomInjection}\n</body>`);
    } else {
      html += heroZoomInjection;
    }

    return new NextResponse(html, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, must-revalidate",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  }

  // Stream binary/static assets (.glb, .webp, .png, etc.) directly
  const responseHeaders = new Headers();
  const copyHeaderKeys = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ];
  for (const key of copyHeaderKeys) {
    const val = upstreamRes.headers.get(key);
    if (val) responseHeaders.set(key, val);
  }
  responseHeaders.set("Cache-Control", "public, max-age=3600");
  responseHeaders.set("X-Frame-Options", "SAMEORIGIN");

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

