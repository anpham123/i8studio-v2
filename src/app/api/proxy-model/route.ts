import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Fast-path: Sample_AR_House is locally cached in public/models/NHA_32.glb
  if (url.includes("Sample_AR_House") || url.includes("NHA_32.glb")) {
    return NextResponse.redirect(new URL("/models/NHA_32.glb", req.url));
  }

  try {
    let targetUrl = url;

    // If target URL is an HTML page (e.g. Model-Viewer or VR360 player)
    if (targetUrl.includes(".html") || targetUrl.includes("/360/")) {
      try {
        const pageRes = await fetch(targetUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          cache: "no-store",
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          // Extract model source from model-viewer or script
          const modelMatch =
            html.match(/src=["']([^"']+\.(glb|gltf)[^"']*)["']/i) ||
            html.match(/["']([^"']+\.(glb|gltf))["']/i);
          if (modelMatch && modelMatch[1]) {
            targetUrl = new URL(modelMatch[1], targetUrl).toString();
          }
        }
      } catch (err) {
        console.warn("Could not parse HTML for 3D model link:", err);
      }
    }

    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch model: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "model/gltf-binary";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    console.error("Error proxying 3D model:", err);
    return new NextResponse(`Error proxying 3D model: ${err?.message}`, { status: 500 });
  }
}
