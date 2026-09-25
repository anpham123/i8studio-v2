import { sanitizeHtml } from "@/lib/sanitize";
import { getEmbedUrl } from "@/lib/embed";
import BlogAdditionalGallery from "@/components/blog/BlogAdditionalGallery";
import AutoPlayVideo from "@/components/blog/AutoPlayVideo";
import Panorama360Viewer from "@/components/public/Panorama360Viewer";
import type { SectionData } from "./CheckcamSection";

export default function InsightSection({ data }: { data: SectionData }) {
  const bodyParagraphs = Array.isArray(data?.body) ? data.body : (data?.body ? [data.body] : []);
  return (
    <section className="bg-[#fbf6ec] py-[28px] sm:py-[36px]">
      <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8">
          {data?.num && (
            <div className="font-roboto text-[48px] sm:text-[64px] leading-none text-[#b8935a] font-bold tracking-tight">
              {data.num}
            </div>
          )}
          <div className="flex-1">
            {data?.title && (
              <h3
                className="font-serif lining-nums text-[20px] sm:text-[26px] font-bold leading-[1.4] text-[#111]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.title) }}
              />
            )}
          </div>
        </div>
        <div
          className="blog-content text-[14px] sm:text-[15px] leading-[1.9] text-[#111]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyParagraphs.join("\n")) }}
        />

        {/* Visual: VR360 embed / Video / Image if provided */}
        {(data.image || data.mediaEmbedUrl) && (
          <div className="mt-10 aspect-[16/9] min-h-[340px] sm:min-h-[460px] rounded-none overflow-hidden border border-gray-200/40 shadow-xs bg-black">
            {(() => {
              const isEmbedVideo = /\.(mp4|webm|mov)(\?|$)/i.test(data.mediaEmbedUrl || "");
              const isEmbedImage =
                !isEmbedVideo &&
                Boolean(
                  data.mediaEmbedUrl &&
                    (/\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(data.mediaEmbedUrl) ||
                      data.mediaEmbedUrl.startsWith("/uploads/"))
                );
              const isImageVideo = /\.(mp4|webm|mov)(\?|$)/i.test(data.image || "");
              const embedUrl =
                data.mediaEmbedUrl && !isEmbedVideo && !isEmbedImage
                  ? getEmbedUrl(data.mediaEmbedUrl)
                  : null;

              if (isEmbedVideo) {
                return (
                  <AutoPlayVideo
                    src={data.mediaEmbedUrl!}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full bg-black relative"
                  />
                );
              }

              if (isEmbedImage && data.mediaEmbedUrl) {
                return (
                  <div className="w-full h-full min-h-[340px] sm:min-h-[460px] bg-black">
                    <Panorama360Viewer src={data.mediaEmbedUrl} />
                  </div>
                );
              }

              if (embedUrl) {
                return (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen; autoplay"
                    title={data?.title ? data.title.replace(/<[^>]*>/g, "") : "VR360 Experience"}
                  />
                );
              }

              if (isImageVideo && data.image) {
                return (
                  <AutoPlayVideo
                    src={data.image}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full bg-black relative"
                  />
                );
              }

              if (data.image) {
                return (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={data.image} alt={data.title ? data.title.replace(/<[^>]*>/g, "") : "Image"} className="w-full h-auto object-cover block rounded-none" />
                );
              }

              return null;
            })()}
          </div>
        )}

        {/* Additional images */}
        <BlogAdditionalGallery
          images={data.additionalImages}
          captions={data.additionalImageCaptions}
          sectionTitle={data.title}
        />
      </div>
    </section>
  );
}
