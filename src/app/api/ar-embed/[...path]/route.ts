import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const UPSTREAM_ORIGIN = "https://vr.i8studio.vn";

/**
 * Proxies AR 3D model-viewer embeds from vr.i8studio.vn for the Solution AR hero section,
 * enlarging the initial 3D model presentation to maximum view while preserving all interactive UI controls
 * (material selector, specification panel, screenshot button, and 360° orbit/zoom controls),
 * and adding bilingual hover tooltips on each right-side button + material swatches.
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

  const langParam = request.nextUrl.searchParams.get("lang");
  const isJa = langParam ? langParam === "ja" : true;

  const relativePath = pathSegments.map(encodeURIComponent).join("/");
  const targetUrl = `${UPSTREAM_ORIGIN}/${relativePath}`;

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

    // Compute directory base URL so relative assets (.glb, .png, etc.) resolve properly
    // even when rendered via iframe srcDoc (which bypasses X-Frame-Options header conflicts on VPS).
    const dirSegments = pathSegments.slice(0, -1).map(encodeURIComponent);
    const baseHref =
      dirSegments.length > 0
        ? `/api/ar-embed/${dirSegments.join("/")}/`
        : `/api/ar-embed/`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n  <base href="${baseHref}">`);
    } else {
      html = `<base href="${baseHref}">\n` + html;
    }

    // Update <model-viewer> attributes so the 3D house loads at maximum enlarged size immediately on page load or F5
    html = html
      .replace(
        /camera-orbit\s*=\s*"[^"]*"/i,
        'camera-orbit="298.9deg 84deg 48m"'
      )
      .replace(
        /min-camera-orbit\s*=\s*"[^"]*"/i,
        'min-camera-orbit="auto 25deg 35m"'
      )
      .replace(
        /max-camera-orbit\s*=\s*"[^"]*"/i,
        'max-camera-orbit="auto 92deg 220m"'
      )
      .replace(
        /min-field-of-view\s*=\s*"[^"]*"/i,
        'field-of-view="8.2deg" min-field-of-view="5deg" max-field-of-view="35deg"'
      )
      // Fix: upstream references poster.webp but only poster.png exists
      .replace(/poster\.webp/g, "poster.png");

    const heroZoomInjection = `
  <style id="i8-ar-hero-zoom-style">
    model-viewer#myModel, model-viewer {
      width: 100% !important;
      height: 100% !important;
      transform: translateY(-2%);
    }
    model-viewer::part(default-poster) {
      transform: scale(2.85);
    }
    /* Smooth fade-in: hide model canvas until fully loaded */
    .i8-mv-loading model-viewer,
    .i8-mv-loading model-viewer#myModel {
      opacity: 0;
      transition: opacity 0.55s ease;
    }
    .i8-mv-ready model-viewer,
    .i8-mv-ready model-viewer#myModel {
      opacity: 1;
      transition: opacity 0.55s ease;
    }

    /* Glassmorphic refinement for left material specification panel */
    .info-container {
      background: rgba(14, 15, 20, 0.78) !important;
      border: 1px solid rgba(197, 166, 102, 0.35) !important;
      backdrop-filter: blur(12px) !important;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45) !important;
      width: 245px !important;
      top: 16px !important;
      left: 16px !important;
      max-height: 78vh !important;
    }
    .info-container h3 {
      color: #f3e5c8 !important;
      font-size: 14px !important;
      border-bottom: 1px solid rgba(197, 166, 102, 0.25);
      padding-bottom: 6px;
    }
    .info-container p#variant-info {
      color: #f5b952 !important;
      font-size: 12px !important;
      line-height: 1.55 !important;
    }

    /* Color swatches menu at bottom */
    .color-menu {
      background: rgba(16, 18, 24, 0.85) !important;
      border: 1px solid rgba(197, 166, 102, 0.45) !important;
      backdrop-filter: blur(12px) !important;
      border-radius: 14px !important;
      padding: 10px 14px !important;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
      z-index: 30 !important;
    }
    .color-menu.show {
      bottom: 24px !important;
    }
    .color-box {
      position: relative;
      border: 2px solid rgba(255, 255, 255, 0.25) !important;
      border-radius: 8px !important;
      transition: transform 0.2s ease, border-color 0.2s ease !important;
    }
    .color-box:hover, .color-box.i8-active-mat {
      transform: translateY(-2px) scale(1.05);
      border-color: #c5a666 !important;
      box-shadow: 0 0 12px rgba(197, 166, 102, 0.65);
    }

    /* Right-side circular buttons + Rich Hover Tooltips */
    .menu-icon {
      right: 20px !important;
      width: 52px !important;
      height: 52px !important;
      border: 1.5px solid rgba(197, 166, 102, 0.55) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55) !important;
      overflow: visible !important;
    }
    .menu-icon:hover {
      border-color: #f0c978 !important;
      box-shadow: 0 0 18px rgba(197, 166, 102, 0.75) !important;
    }

    /* Tooltip card that appears smoothly on HOVER over each of the 3 right buttons */
    .i8-hover-tooltip {
      position: absolute;
      right: 66px;
      top: 50%;
      transform: translateY(-50%) translateX(10px) scale(0.95);
      opacity: 0;
      visibility: hidden;
      background: rgba(14, 15, 20, 0.94);
      border: 1px solid rgba(197, 166, 102, 0.65);
      padding: 9px 14px;
      border-radius: 12px;
      width: max-content;
      max-width: 240px;
      pointer-events: none;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.22s;
      z-index: 100;
      text-align: left;
      font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    /* Arrow pointing right toward the circular icon */
    .i8-hover-tooltip::after {
      content: "";
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 10px;
      height: 10px;
      background: rgba(14, 15, 20, 0.94);
      border-top: 1px solid rgba(197, 166, 102, 0.65);
      border-right: 1px solid rgba(197, 166, 102, 0.65);
    }
    .menu-icon:hover .i8-hover-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0) scale(1);
    }
    .i8-tooltip-title {
      display: block;
      font-size: 12.5px;
      font-weight: 800;
      color: #f3c977;
      margin-bottom: 3px;
      letter-spacing: 0.02em;
      line-height: 1.3;
    }
    .i8-tooltip-desc {
      display: block;
      font-size: 11px;
      font-weight: 400;
      color: #e2e4e9;
      line-height: 1.45;
      white-space: normal;
    }

    /* Bottom Interactive 3D Guidance Pill Bar */
    .i8-ar-guide-bar {
      position: fixed;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 25;
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(14, 15, 20, 0.82);
      border: 1px solid rgba(197, 166, 102, 0.4);
      backdrop-filter: blur(10px);
      padding: 7px 18px;
      border-radius: 999px;
      color: #eaeaea;
      font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      pointer-events: none;
      user-select: none;
    }
    .i8-ar-guide-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .i8-ar-guide-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c5a666;
    }
    .i8-ar-guide-icon {
      color: #c5a666;
      font-weight: 800;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .i8-ar-guide-bar {
        font-size: 10px;
        padding: 6px 12px;
        gap: 8px;
      }
    }
  </style>
  <script id="i8-ar-hero-zoom-script">
    (function () {
      var IS_JA = ${isJa ? "true" : "false"};
      document.body.classList.add("i8-mv-loading");

      function applyEnlargedHeroView() {
        var mv = document.getElementById("myModel") || document.querySelector("model-viewer");
        if (!mv) return;
        mv.cameraOrbit = "298.9deg 84deg 48m";
        mv.minCameraOrbit = "auto 25deg 35m";
        mv.maxCameraOrbit = "auto 92deg 220m";
        mv.minFieldOfView = "5deg";
        mv.maxFieldOfView = "35deg";
        mv.fieldOfView = "8.2deg";
        if (typeof mv.jumpCameraToGoal === "function") {
          mv.jumpCameraToGoal();
        }
      }

      function revealModel() {
        document.body.classList.remove("i8-mv-loading");
        document.body.classList.add("i8-mv-ready");
      }

      function prefillFirstMaterialPanel() {
        var firstBox = document.querySelector(".color-box");
        var matImg = document.getElementById("material-image");
        var infoEl = document.getElementById("variant-info");
        var titleEl = document.querySelector(".info-container h3");
        if (titleEl) {
          titleEl.textContent = IS_JA ? "外装マテリアル仕様" : "Exterior Material Specs";
        }
        if (firstBox && matImg && infoEl) {
          firstBox.classList.add("i8-active-mat");
          var thumb = firstBox.querySelector("img");
          var info = firstBox.getAttribute("data-info") || "";
          if (thumb && thumb.getAttribute("src")) {
            matImg.src = thumb.getAttribute("src");
          }
          if (info) {
            infoEl.innerHTML = info.replace(/\\n/g, "<br>");
          }
        }
        var boxes = document.querySelectorAll(".color-box");
        boxes.forEach(function (box) {
          box.addEventListener("click", function () {
            boxes.forEach(function (b) { b.classList.remove("i8-active-mat"); });
            box.classList.add("i8-active-mat");
          });
        });
      }

      function attachTooltip(btn, titleText, descText) {
        if (!btn || btn.querySelector(".i8-hover-tooltip")) return;
        var tip = document.createElement("div");
        tip.className = "i8-hover-tooltip";
        var tEl = document.createElement("span");
        tEl.className = "i8-tooltip-title";
        tEl.textContent = titleText;
        var dEl = document.createElement("span");
        dEl.className = "i8-tooltip-desc";
        dEl.textContent = descText;
        tip.appendChild(tEl);
        tip.appendChild(dEl);
        btn.appendChild(tip);
      }

      function injectInteractiveUserGuides() {
        // 1. Top circular button: Change Exterior Material
        var matBtn = document.querySelector(".menu-icon.material-icon");
        attachTooltip(
          matBtn,
          IS_JA ? "外壁マテリアル切替" : "Change Exterior Material",
          IS_JA
            ? "クリックして建物の外壁素材・カラーをリアルタイムに変更します"
            : "Click to switch the building's exterior wall materials & colors in real time"
        );

        // 2. Middle circular button: Capture Screenshot
        var shotBtn = document.getElementById("screenshot-btn");
        attachTooltip(
          shotBtn,
          IS_JA ? "スクリーンショット保存" : "Capture 3D Screenshot",
          IS_JA
            ? "現在の3Dアングルと素材の状態を高画質画像（PNG）として保存します"
            : "Download a high-resolution PNG snapshot of the current 3D view & material"
        );

        // 3. Bottom circular button: Toggle Material Specification Panel
        var infoBtn = document.getElementById("toggleInfoBtn");
        attachTooltip(
          infoBtn,
          IS_JA ? "製品仕様パネル表示 / 非表示" : "Toggle Material Specs",
          IS_JA
            ? "左側の外装材スペック詳細（品番・寸法・重量）パネルを開閉します"
            : "Show or hide the detailed exterior material specifications panel on the left"
        );
      }

      function setupModelReveal() {
        prefillFirstMaterialPanel();
        injectInteractiveUserGuides();
        var mv = document.getElementById("myModel") || document.querySelector("model-viewer");
        if (!mv) return;
        applyEnlargedHeroView();
        if (mv.loaded) {
          applyEnlargedHeroView();
          setTimeout(revealModel, 250);
        } else {
          mv.addEventListener("load", function () {
            applyEnlargedHeroView();
            setTimeout(applyEnlargedHeroView, 100);
            setTimeout(revealModel, 250);
          }, { once: true });
        }
        setTimeout(revealModel, 3500);
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupModelReveal);
      } else {
        setupModelReveal();
      }
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

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}
