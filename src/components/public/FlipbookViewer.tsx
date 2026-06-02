"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, X, BookOpen, Loader2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PdfViewport { width: number; height: number }
interface PdfRenderTask { promise: Promise<void>; cancel(): void }
interface PdfPage {
  getViewport(p: { scale: number }): PdfViewport;
  render(p: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): PdfRenderTask;
  cleanup(): void;
}
interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
  destroy(): void;
}

// ─── Dimension helper ────────────────────────────────────────────────────────
// Returns per-page size for A4 ratio (1:√2), fitting inside the viewport.
function calcDim() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const availH = vh - 56 - 64 - 40; // header + footer + padding
  const mobile = vw < 768;

  if (mobile) {
    const w = Math.min(vw - 32, 440);
    const h = Math.min(Math.round(w * 1.4142), availH);
    const fw = Math.round(h / 1.4142);
    return { width: fw, height: h, portrait: true };
  }

  // Desktop: 2-page spread — keep generous margin so both pages are fully visible
  const maxBookW = Math.min(vw - 160, 1200);
  let pw = Math.floor(maxBookW / 2);
  let ph = Math.round(pw * 1.4142);
  if (ph > availH) { ph = availH; pw = Math.round(ph / 1.4142); }
  return { width: pw, height: ph, portrait: false };
}

// ─── Single flip-page (image-based, forwardRef required by react-pageflip) ──
interface PageProps {
  imageUrl: string | null;
  width: number;
  height: number;
  density?: "hard" | "soft";
}

const FlipPage = forwardRef<HTMLDivElement, PageProps>(
  ({ imageUrl, width, height }, ref) => (
    <div
      ref={ref}
      data-density="soft"
      style={{ width, height, overflow: "hidden" }}
      className="bg-white select-none"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          width={width}
          height={height}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "fill" }}
          draggable={false}
        />
      ) : (
        // Placeholder while this specific page is rendering
        <div
          style={{ width, height }}
          className="flex items-center justify-center bg-gray-50"
        >
          <Loader2 size={20} className="text-gray-300 animate-spin" />
        </div>
      )}
    </div>
  )
);
FlipPage.displayName = "FlipPage";

// ─── Main component ──────────────────────────────────────────────────────────
interface Props { pdfUrl: string; title?: string; onClose: () => void }

export default function FlipbookViewer({ pdfUrl, title, onClose }: Props) {
  const [pageImages, setPageImages] = useState<(string | null)[]>([]);
  const [totalPages,  setTotalPages]  = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadError,   setLoadError]   = useState(false);
  const [dim, setDim] = useState(calcDim);
  const [currentPage, setCurrentPage] = useState(0);
  const [ready, setReady] = useState(false); // true when ≥1 page rendered

  const bookRef = useRef<{
    pageFlip(): { flipNext(): void; flipPrev(): void };
  } | null>(null);

  // ── Resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setDim(calcDim());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Keyboard nav ─────────────────────────────────────────────────────────
  const flipNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);
  const flipPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if      (e.key === "ArrowRight" || e.key === "ArrowDown") flipNext();
      else if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   flipPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [flipNext, flipPrev, onClose]);

  // ── Pre-render ALL pages to JPEG blob URLs ─────────────────────────────
  // Strategy: render first 4 pages sequentially (show book immediately),
  // then render the rest concurrently in background (non-blocking).
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    let pdfDocRef: PdfDoc | null = null;

    const renderPage = async (
      pdfDoc: PdfDoc,
      pageNum: number,
      renderWidth: number
    ): Promise<string | null> => {
      if (cancelled) return null;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const nativeVP = page.getViewport({ scale: 1 });

        // Render at 2× for crisp retina display
        const scale = (renderWidth / nativeVP.width) * 2;
        const vp = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(vp.width);
        canvas.height = Math.round(vp.height);

        const ctx = canvas.getContext("2d")!;
        const task = page.render({ canvasContext: ctx, viewport: vp });
        await task.promise;
        page.cleanup();

        if (cancelled) return null;

        return await new Promise<string>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob ? URL.createObjectURL(blob) : ""),
            "image/jpeg",
            0.90 // good quality / size balance
          );
        });
      } catch {
        return null;
      }
    };

    (async () => {
      try {
        const pdfjs = await import(
          /* webpackChunkName: "pdfjs-legacy" */
          "pdfjs-dist/legacy/build/pdf.js"
        ) as {
          getDocument(src: string): { promise: Promise<PdfDoc> };
          GlobalWorkerOptions: { workerSrc: string };
          version: string;
        };

        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        }

        const pdfDoc = await pdfjs.getDocument(pdfUrl).promise;
        if (cancelled) { pdfDoc.destroy(); return; }
        pdfDocRef = pdfDoc;

        const n = pdfDoc.numPages;
        setTotalPages(n);
        setPageImages(new Array(n).fill(null));

        const snapWidth = calcDim().width; // stable width for this session

        // ── Phase 1: render first 4 pages sequentially → show book ASAP
        const firstBatch = Math.min(4, n);
        for (let i = 1; i <= firstBatch; i++) {
          const url = await renderPage(pdfDoc, i, snapWidth);
          if (cancelled) return;
          urls[i - 1] = url ?? "";
          setPageImages(prev => {
            const next = [...prev];
            next[i - 1] = url;
            return next;
          });
          setLoadedCount(c => c + 1);
          if (i === 2 || i === firstBatch) setReady(true); // show book after page 2
        }

        // ── Phase 2: render remaining pages concurrently (background)
        const remaining = Array.from({ length: n - firstBatch }, (_, i) => i + firstBatch + 1);
        await Promise.all(
          remaining.map(async (pageNum) => {
            const url = await renderPage(pdfDoc, pageNum, snapWidth);
            if (cancelled || !url) return;
            urls[pageNum - 1] = url;
            setPageImages(prev => {
              const next = [...prev];
              next[pageNum - 1] = url;
              return next;
            });
            setLoadedCount(c => c + 1);
          })
        );

      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();

    return () => {
      cancelled = true;
      pdfDocRef?.destroy();
      // Revoke blob URLs to free memory
      urls.forEach(u => { if (u) URL.revokeObjectURL(u); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const isLoading    = !ready && !loadError;
  const loadProgress = totalPages > 0 ? Math.round((loadedCount / totalPages) * 100) : 0;
  const atStart      = currentPage === 0;
  const atEnd        = totalPages > 0 && currentPage >= totalPages - 1;

  // ── Total book width for the stage container ──────────────────────────────
  // react-pageflip renders the book at exactly 2×pageWidth (or 1× in portrait)
  const bookTotalW = dim.portrait ? dim.width : dim.width * 2;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(8,8,16,0.97)" }}
      onClick={onClose}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between px-5 h-14 border-b"
        style={{ background: "rgba(0,0,0,0.7)", borderColor: "rgba(255,255,255,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={16} className="text-blue-400 shrink-0" />
          <span className="text-sm font-medium text-white/70 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {totalPages > 0 && (
            <span className="text-white/40 text-xs tabular-nums hidden sm:block">
              Page {currentPage + 1}&thinsp;/&thinsp;{totalPages}
            </span>
          )}
          {/* Loading progress indicator */}
          {!ready && totalPages > 0 && (
            <span className="text-white/40 text-xs hidden sm:block">
              Rendering {loadProgress}%…
            </span>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/15 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Book stage ──────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{ overflow: "hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left arrow */}
        {ready && (
          <button
            onClick={flipPrev}
            disabled={atStart}
            aria-label="Previous page"
            className="absolute left-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:bg-black/80 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Right arrow */}
        {ready && (
          <button
            onClick={flipNext}
            disabled={atEnd}
            aria-label="Next page"
            className="absolute right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:bg-black/80 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500/70 border-t-transparent animate-spin" />
            <span className="text-white/40 text-sm">
              {totalPages > 0 ? `Đang tải trang… ${loadProgress}%` : "Đang mở PDF…"}
            </span>
            {totalPages > 0 && (
              <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {loadError && (
          <div className="text-center px-6">
            <p className="text-white/50 text-sm">Không thể tải PDF. Vui lòng thử lại.</p>
          </div>
        )}

        {/* ── HTMLFlipBook ─────────────────────────────────────────────── */}
        {/* Wrapper with exact book width → ensures flexbox centers correctly */}
        {ready && pageImages.length > 0 && (
          <div
            style={{
              width: bookTotalW,
              height: dim.height,
              // subtle shadow behind the whole book
              filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.7))",
            }}
          >
            <HTMLFlipBook
              key={`${dim.width}x${dim.height}x${dim.portrait}`}
              ref={bookRef as React.Ref<unknown>}
              width={dim.width}
              height={dim.height}
              size="fixed"
              minWidth={150}
              maxWidth={900}
              minHeight={212}
              maxHeight={1400}
              showCover={true}
              drawShadow={true}
              flippingTime={700}
              usePortrait={dim.portrait}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.4}
              mobileScrollSupport={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={50}
              showPageCorners={true}
              disableFlipByClick={false}
              startPage={0}
              onFlip={(e: { data: number }) => setCurrentPage(e.data)}
              className=""
              style={{}}
            >
              {pageImages.map((url, i) => (
                <FlipPage
                  key={i}
                  imageUrl={url}
                  width={dim.width}
                  height={dim.height}
                  density={i === 0 || i === pageImages.length - 1 ? "hard" : "soft"}
                />
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* ── Footer controls ─────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-center gap-3 h-16 border-t"
        style={{ background: "rgba(0,0,0,0.7)", borderColor: "rgba(255,255,255,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={flipPrev}
          disabled={atStart || !ready}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="text-white/40 text-sm tabular-nums w-32 text-center select-none">
          {totalPages > 0
            ? `Page ${currentPage + 1} / ${totalPages}`
            : ready ? "—" : "Loading…"}
        </span>

        <button
          onClick={flipNext}
          disabled={atEnd || !ready}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
