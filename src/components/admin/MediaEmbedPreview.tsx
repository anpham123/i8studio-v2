"use client";

import { useState, useEffect } from "react";
import { getEmbedUrl } from "@/lib/embed";
import Panorama360Viewer from "@/components/public/Panorama360Viewer";

export { getEmbedUrl };

interface Props {
  url: string;
  className?: string;
}

export default function MediaEmbedPreview({ url, className = "" }: Props) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const trimmed = url?.trim() || "";
  const isDirectVideo = Boolean(trimmed && /\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed));
  const isDirectImage = Boolean(
    trimmed &&
      !isDirectVideo &&
      (/\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(trimmed) || trimmed.startsWith("/uploads/"))
  );

  useEffect(() => {
    setError(false);
    if (!isDirectImage && !isDirectVideo) {
      const parsed = getEmbedUrl(trimmed);
      setEmbedUrl(parsed);
    }
  }, [trimmed, isDirectImage, isDirectVideo]);

  if (!trimmed) {
    return (
      <div className={`border-2 border-dashed border-gray-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-gray-400">Nhập URL hoặc upload ảnh để xem preview</p>
        <p className="text-xs text-gray-300 mt-1">Ảnh panorama 360, YouTube, Vimeo, Kuula, Matterport, hoặc URL trực tiếp</p>
      </div>
    );
  }

  if (isDirectVideo) {
    return (
      <div className={`rounded-lg overflow-hidden border border-gray-200 bg-black ${className}`}>
        <div className="relative aspect-video">
          <video src={trimmed} controls className="w-full h-full object-contain" />
        </div>
        <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono truncate flex-1 mr-2">{trimmed}</span>
          <a href={trimmed} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline shrink-0">
            Mở video ↗
          </a>
        </div>
      </div>
    );
  }

  if (isDirectImage) {
    return (
      <div className={`rounded-lg overflow-hidden border border-gray-200 bg-black ${className}`}>
        <div className="relative aspect-video min-h-[260px] sm:min-h-[320px]">
          <Panorama360Viewer src={trimmed} />
        </div>
        <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono truncate flex-1 mr-2">
            360° Panorama: {trimmed}
          </span>
          <a href={trimmed} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline shrink-0">
            Xem ảnh gốc ↗
          </a>
        </div>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className={`border-2 border-dashed border-red-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-red-400">Không thể parse URL này</p>
        <p className="text-xs text-red-300 mt-1">{trimmed}</p>
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
