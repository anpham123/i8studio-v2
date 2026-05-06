"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  createContext,
  useContext,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

// ---------------------------------------------------------------------------
// Minimal types for the pdfjs-dist APIs we use (avoids importing their types,
// which would pull in the pdfjs-dist v5 copy bundled inside react-pdf@10).
// ---------------------------------------------------------------------------
interface PdfViewport {
  width: number;
  height: number;
}
interface PdfRenderTask {
  promise: Promise<void>;
  cancel(): void;
}
interface PdfPage {
  getViewport(params: { scale: number }): PdfViewport;
  render(params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }): PdfRenderTask;
  cleanup(): void;
}
interface PdfDocument {
  numPages: number;
  getPage(num: number): Promise<PdfPage>;
  destroy(): void;
}

// ---------------------------------------------------------------------------
// Context — shares the loaded PdfDocument with every PageCanvas inside the
// HTMLFlipBook without prop-drilling through react-pageflip's cloneElement.
// ---------------------------------------------------------------------------
const PdfDocCtx = createContext<PdfDocument | null>(null);

// ---------------------------------------------------------------------------
// PageCanvas — forwardRef div required by react-pageflip, renders one page.
// ---------------------------------------------------------------------------
interface PageCanvasProps {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
}

const PageCanvas = forwardRef<HTMLDivElement, PageCanvasProps>(
  ({ pageNumber, pageWidth, pageHeight }, ref) => {
    const pdfDoc = useContext(PdfDocCtx);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!pdfDoc || !canvasRef.current) return;
      let cancelled = false;
      let renderTask: PdfRenderTask | null = null;

      (async () => {
        try {
          const page = await pdfDoc.getPage(pageNumber);
          if (cancelled) { page.cleanup(); return; }

          const native = page.getViewport({ scale: 1 });
          const scale = pageWidth / native.width;
          const viewport = page.getViewport({ scale });

          const canvas = canvasRef.current!;
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          const ctx = canvas.getContext("2d")!;
          renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        } catch {
          /* cancelled or PDF error — ignore */
        }
      })();

      return () => {
        cancelled = true;
        renderTask?.cancel();
      };
    }, [pdfDoc, pageNumber, pageWidth]);

    return (
      <div
        ref={ref}
        style={{ width: pageWidth, height: pageHeight, overflow: "hidden" }}
        className="bg-white select-none"
      >
        {/* canvas fills width, overflow hidden clips any height mismatch */}
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>
    );
  }
);
PageCanvas.displayName = "PageCanvas";

// ---------------------------------------------------------------------------
// Dimension calculation — called once on open and again on resize.
// Returns page width/height (A4 ratio ≈ 1:√2) and portrait mode flag.
// Desktop shows a 2-page spread; mobile shows single page.
// ---------------------------------------------------------------------------
function calcDim() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const availH = vh - 56 /* header */ - 64 /* footer */ - 32 /* pad */;
  const mobile = vw < 768;

  if (mobile) {
    const w = Math.min(vw - 32, 480);
    const h = Math.min(Math.round(w * 1.4142), availH);
    return { width: Math.round(h / 1.4142), height: h, portrait: true };
  }

  // 2-page spread: total book width = 2 × page width
  const bookW = Math.min(vw - 120, 1100);
  let pw = Math.floor(bookW / 2);
  let ph = Math.round(pw * 1.4142);
  if (ph > availH) { ph = availH; pw = Math.round(ph / 1.4142); }
  return { width: pw, height: ph, portrait: false };
}

// ---------------------------------------------------------------------------
// FlipbookViewer — fullscreen modal
// ---------------------------------------------------------------------------
interface Props {
  pdfUrl: string;
  title?: string;
  onClose: () => void;
}

export default function FlipbookViewer({ pdfUrl, title, onClose }: Props) {
  const [pdfDoc, setPdfDoc]     = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadError, setLoadError]     = useState(false);
  const [dim, setDim] = useState(calcDim);

  // Stable ref so keyboard handlers don't need to be re-created on each render
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

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const flipNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);
  const flipPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  flipNext();
      else if (e.key === "ArrowLeft"  || e.key === "ArrowUp") flipPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipNext, flipPrev, onClose]);

  // ── Load PDF via pdfjs-dist v3 legacy (CommonJS, webpack-safe) ────────────
  useEffect(() => {
    let doc: PdfDocument | null = null;
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import keeps this out of the SSR bundle entirely.
        // The legacy build is CommonJS-compatible and doesn't trigger the
        // "Object.defineProperty called on non-object" ESM webpack error.
        const pdfjs = await import(
          /* webpackChunkName: "pdfjs-legacy" */
          "pdfjs-dist/legacy/build/pdf.js"
        ) as { getDocument(src: string): { promise: Promise<PdfDocument> }; GlobalWorkerOptions: { workerSrc: string }; version: string };

        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        }

        const task = pdfjs.getDocument(pdfUrl);
        doc = await task.promise;
        if (cancelled) { doc.destroy(); return; }

        setNumPages(doc.numPages);
        setPdfDoc(doc);
      } catch (err) {
        if (!cancelled) {
          console.error("[FlipbookViewer] PDF load error:", err);
          setLoadError(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      doc?.destroy();
    };
  }, [pdfUrl]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const displayPage = currentPage + 1;
  const atStart = currentPage === 0;
  const atEnd   = numPages > 0 && currentPage >= numPages - 1;
  const loading = !pdfDoc && !loadError;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    /* Backdrop — click outside the book area closes the viewer */
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0d0d14]/96 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between px-5 h-14 bg-black/60 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={16} className="text-blue-400 shrink-0" />
          <span className="text-sm font-medium text-white/70 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {numPages > 0 && (
            <span className="text-white/40 text-sm tabular-nums hidden sm:block">
              Page {displayPage}&thinsp;/&thinsp;{numPages}
            </span>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Book stage ──────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Side navigation arrows */}
        {numPages > 0 && (
          <>
            <button
              onClick={flipPrev}
              disabled={atStart}
              aria-label="Previous page"
              className="absolute left-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:bg-black/80 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={flipNext}
              disabled={atEnd}
              aria-label="Next page"
              className="absolute right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:bg-black/80 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/70 border-t-transparent animate-spin" />
            <span className="text-white/40 text-sm">Loading PDF…</span>
          </div>
        )}

        {/* Error state */}
        {loadError && (
          <div className="text-center px-6">
            <p className="text-white/50 text-sm">Failed to load PDF. Please try again.</p>
          </div>
        )}

        {/* HTMLFlipBook — only mounted once the document is ready.
            key forces a full remount when page dimensions change on resize,
            ensuring react-pageflip re-initialises its internal geometry. */}
        {pdfDoc && numPages > 0 && (
          <PdfDocCtx.Provider value={pdfDoc}>
            <HTMLFlipBook
              key={`${dim.width}x${dim.height}x${dim.portrait}`}
              ref={bookRef as React.Ref<unknown>}
              width={dim.width}
              height={dim.height}
              size="fixed"
              minWidth={150}
              maxWidth={900}
              minHeight={212}
              maxHeight={1273}
              showCover={true}
              drawShadow={true}
              flippingTime={750}
              usePortrait={dim.portrait}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.35}
              mobileScrollSupport={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
              startPage={0}
              onFlip={(e: { data: number }) => setCurrentPage(e.data)}
              className=""
              style={{}}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <PageCanvas
                  key={i + 1}
                  pageNumber={i + 1}
                  pageWidth={dim.width}
                  pageHeight={dim.height}
                />
              ))}
            </HTMLFlipBook>
          </PdfDocCtx.Provider>
        )}
      </div>

      {/* ── Footer controls ─────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-center gap-3 h-16 bg-black/60 border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={flipPrev}
          disabled={atStart || !pdfDoc}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="text-white/40 text-sm tabular-nums w-28 text-center">
          {numPages > 0 ? `Page ${displayPage} / ${numPages}` : ""}
        </span>

        <button
          onClick={flipNext}
          disabled={atEnd || !pdfDoc}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
