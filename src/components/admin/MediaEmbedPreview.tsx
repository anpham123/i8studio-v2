"use client";

import { useState, useEffect } from "react";

/**
 * Parse a URL and return an embeddable iframe src.
 * Supports: YouTube, Vimeo, Kuula, Matterport, Pano2VR, vr.i8studio.vn, generic URLs.
 */
export function getEmbedUrl(url: string): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // YouTube
  const ytPatterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of ytPatterns) {
    const m = trimmed.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Kuula
  if (trimmed.includes("kuula.co")) {
    return trimmed.replace("/share/", "/share/collection/");
  }

  // Matterport
  const mpMatch = trimmed.match(/matterport\.com\/show\/\?m=([a-zA-Z0-9]+)/);
  if (mpMatch) return `https://my.matterport.com/show/?m=${mpMatch[1]}`;

  // Already an embeddable URL (vr.i8studio.vn, pano2vr, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return null;
}

interface Props {
  url: string;
  className?: string;
}

export default function MediaEmbedPreview({ url, className = "" }: Props) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    const parsed = getEmbedUrl(url);
    setEmbedUrl(parsed);
  }, [url]);

  if (!url || !url.trim()) {
    return (
      <div className={`border-2 border-dashed border-gray-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-gray-400">Nhập URL để xem preview embed</p>
        <p className="text-xs text-gray-300 mt-1">YouTube, Vimeo, VR360, Kuula, Matterport, hoặc URL trực tiếp</p>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className={`border-2 border-dashed border-red-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-red-400">Không thể parse URL này</p>
        <p className="text-xs text-red-300 mt-1">{url}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border-2 border-dashed border-yellow-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-yellow-600">Không thể tải embed</p>
        <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">
          Mở trong tab mới →
        </a>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 bg-black ${className}`}>
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen; autoplay"
          title="Media preview"
          onError={() => setError(true)}
        />
      </div>
      <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
        <span className="text-xs text-gray-400 truncate flex-1 mr-2">{embedUrl}</span>
        <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline shrink-0">
          Mở tab mới ↗
        </a>
      </div>
    </div>
  );
}
