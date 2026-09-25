/**
 * Parse a URL and return an embeddable iframe src.
 * Supports: YouTube, Vimeo, Kuula, Matterport, Pano2VR, vr.i8studio.vn, and generic URLs.
 */
export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // YouTube
  const ytPatterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of ytPatterns) {
    const m = trimmed.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&autoplay=1&mute=1`;
  }

  // Google Drive
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Kuula
  if (trimmed.includes("kuula.co")) {
    if (trimmed.includes("/share/collection/")) return trimmed;
    return trimmed.replace("/share/", "/share/collection/");
  }

  // Matterport
  const mpMatch = trimmed.match(/matterport\.com\/show\/\?m=([a-zA-Z0-9]+)/);
  if (mpMatch) return `https://my.matterport.com/show/?m=${mpMatch[1]}`;

  // Sketchfab
  const sfMatch = trimmed.match(/sketchfab\.com\/3d-models\/.*-([a-f0-9]{32})/i) || trimmed.match(/sketchfab\.com\/models\/([a-f0-9]{32})/i);
  if (sfMatch) return `https://sketchfab.com/models/${sfMatch[1]}/embed`;

  // Generic HTTP / HTTPS embed (vr.i8studio.vn, pano2vr, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return null;
}
