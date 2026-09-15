"use client";

import { useState, useRef, useEffect } from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface AdditionalImageItem {
  image: string;
  caption?: string;
}

interface Props {
  images?: (string | AdditionalImageItem)[];
  captions?: string[];
  sectionTitle?: string;
}

export default function BlogAdditionalGallery({
  images,
  captions,
  sectionTitle,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string; idx: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const normalizedItems = (images || [])
    .map((item, i) => {
      const src = typeof item === "string" ? item : item?.image || "";
      const cap = typeof item === "string" ? captions?.[i] || "" : item?.caption || "";
      return { src, cap, idx: i };
    })
    .filter((it) => Boolean(it.src));

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [normalizedItems.length]);

  if (normalizedItems.length === 0) return null;

  const titleFallback = sectionTitle ? sectionTitle.replace(/<[^>]*>/g, "") : "Visual";

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="mt-8 pt-4">
        {/* Gallery Header Info if multiple images */}
        {normalizedItems.length > 1 && (
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11.5px] uppercase tracking-[0.16em] text-gray-500 font-bold">
              Gallery ({normalizedItems.length} photos)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                aria-label="Previous photos"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                aria-label="Next photos"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Single Image View */}
        {normalizedItems.length === 1 ? (
          <figure
            className="max-w-2xl mx-auto bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col cursor-pointer overflow-hidden"
            onClick={() => setSelectedImage({ src: normalizedItems[0].src, caption: normalizedItems[0].cap, idx: 0 })}
          >
            <div className="relative w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center max-h-[520px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={normalizedItems[0].src}
                alt={normalizedItems[0].cap || titleFallback}
                loading="lazy"
                className="w-auto h-auto max-h-[520px] max-w-full object-contain block group-hover:scale-[1.015] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white p-2 rounded-full shadow-md">
                  <ZoomIn size={18} />
                </div>
              </div>
            </div>
            {normalizedItems[0].cap && (
              <figcaption
                className="text-[12.5px] text-gray-600 italic py-2.5 px-3.5 border-t border-gray-100 bg-[#fafaf8] text-center leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(normalizedItems[0].cap) }}
              />
            )}
          </figure>
        ) : (
          /* Idea 2: Horizontal Scroll Slider with Uniform Height & Full-View Aspect Ratios */
          <div className="relative group/slider">
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{ scrollbarWidth: "thin" }}
            >
              {normalizedItems.map((item) => (
                <figure
                  key={item.idx}
                  onClick={() => setSelectedImage({ src: item.src, caption: item.cap, idx: item.idx })}
                  className="shrink-0 snap-start h-[300px] sm:h-[400px] md:h-[440px] flex flex-col bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group"
                  style={{ maxWidth: "85vw" }}
                >
                  {/* Fixed uniform height container where width scales naturally to photo ratio */}
                  <div className="relative flex-1 bg-[#f8fafc] overflow-hidden flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.cap || `${titleFallback} - ${item.idx + 1}`}
                      loading="lazy"
                      className="h-full w-auto max-w-full object-contain block group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white p-2 rounded-full shadow-md">
                        <ZoomIn size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Caption under each image */}
                  {item.cap && (
                    <figcaption
                      className="text-[12px] sm:text-[12.5px] text-gray-600 italic py-2 px-3 border-t border-gray-100 bg-[#fafaf8] text-center leading-tight font-serif truncate max-w-[340px]"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.cap) }}
                    />
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.src}
              alt={selectedImage.caption || titleFallback}
              className="max-w-full max-h-[78vh] object-contain shadow-2xl"
            />
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
