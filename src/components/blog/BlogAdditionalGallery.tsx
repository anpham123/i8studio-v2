"use client";

import { useState } from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import { X, ZoomIn, Play } from "lucide-react";
import AutoPlayVideo from "@/components/blog/AutoPlayVideo";

interface AdditionalImageItem {
  image: string;
  caption?: string;
}

interface Props {
  images?: (string | AdditionalImageItem)[];
  captions?: string[];
  sectionTitle?: string;
}

function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.startsWith("data:video/");
}

export default function BlogAdditionalGallery({
  images,
  captions,
  sectionTitle,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);
  const [galleryAspectRatio, setGalleryAspectRatio] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const normalizedItems = (images || [])
    .map((item, i) => {
      const src = typeof item === "string" ? item : item?.image || "";
      const cap = typeof item === "string" ? captions?.[i] || "" : item?.caption || "";
      return { src, cap, idx: i, isVideo: isVideoUrl(src) };
    })
    .filter((it) => Boolean(it.src));

  if (normalizedItems.length === 0) return null;

  const titleFallback = sectionTitle ? sectionTitle.replace(/<[^>]*>/g, "") : "Image";

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight && !galleryAspectRatio) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 0.3 && ratio < 3.5) {
        setGalleryAspectRatio(ratio);
      }
    }
  };

  return (
    <>
      <div className="mt-8 pt-4">
        {/* Lưới 3 Cột linh hoạt: Ảnh/Video dọc tự kéo dài theo chiều cao thật, ngang tự xếp khít */}
        <div
          className={
            normalizedItems.length === 1
              ? "max-w-2xl mx-auto"
              : "columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]"
          }
        >
          {normalizedItems.map((item) => (
            <figure
              key={item.idx}
              className="break-inside-avoid mb-5 bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col cursor-pointer overflow-hidden rounded-none"
              onClick={() => setSelectedImage({ src: item.src, caption: item.cap })}
            >
              {/* Container: Chiều cao ảnh/video đồng bộ, video bằng kích thước khung ảnh */}
              <div
                className="relative w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center"
                style={item.isVideo ? { aspectRatio: galleryAspectRatio || "16 / 9" } : undefined}
              >
                {item.isVideo ? (
                  <AutoPlayVideo
                    src={item.src}
                    playOnHover={true}
                    className="w-full h-full object-cover block group-hover:scale-[1.015] transition-transform duration-300"
                    containerClassName="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.src}
                    alt={item.cap || `${titleFallback} - ${item.idx + 1}`}
                    loading="lazy"
                    onLoad={handleImageLoad}
                    className="w-full h-auto object-contain block group-hover:scale-[1.015] transition-transform duration-300"
                  />
                )}

                {/* Hover overlay: Chỉ hiện ZoomIn giữa khung cho ảnh, video có play badge riêng */}
                {!item.isVideo ? (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white p-2 rounded-full shadow-md">
                      <ZoomIn size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white p-1.5 rounded-full shadow-md pointer-events-none">
                    <ZoomIn size={14} />
                  </div>
                )}
              </div>

              {/* Caption */}
              {item.cap && (
                <figcaption
                  className="text-[12.5px] text-gray-600 italic py-2.5 px-3.5 border-t border-gray-100 bg-[#fafaf8] text-center leading-relaxed font-serif"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.cap) }}
                />
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close fullscreen"
          >
            <X size={22} />
          </button>

          {/* Modal Content */}
          <div
            className="relative max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoUrl(selectedImage.src) ? (
              <video
                src={selectedImage.src}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[78vh] object-contain shadow-2xl rounded-sm bg-black"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={selectedImage.src}
                alt={selectedImage.caption || titleFallback}
                className="max-w-full max-h-[78vh] object-contain shadow-2xl"
              />
            )}
            {selectedImage.caption && (
              <p
                className="mt-3 text-white/90 text-sm text-center max-w-2xl font-serif italic leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedImage.caption) }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
