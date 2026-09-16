"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  containerClassName?: string;
  poster?: string;
  showAudioControl?: boolean;
  playOnHover?: boolean;
  aspectRatio?: string | number;
}

export default function AutoPlayVideo({
  src,
  className = "w-full h-auto object-cover",
  containerClassName = "relative w-full overflow-hidden bg-black",
  poster,
  showAudioControl = true,
  playOnHover = false,
  aspectRatio,
}: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if video might have audio tracks
    const handleLoadedMetadata = () => {
      // @ts-expect-error - webkitAudioDecodedByteCount or mozHasAudio check
      const audioAvailable = Boolean(video.webkitAudioDecodedByteCount || video.mozHasAudio || (video.audioTracks && video.audioTracks.length > 0));
      setHasAudio(true);
      // Ensure the first frame is painted on pause
      if (video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch {}
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // If NOT playOnHover, use IntersectionObserver to autoplay when scrolled into view
    let observer: IntersectionObserver | null = null;
    if (!playOnHover) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => {});
              });
            } else {
              video.pause();
            }
          });
        },
        {
          threshold: 0.25,
        }
      );
      observer.observe(video);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      if (observer) observer.disconnect();
    };
  }, [playOnHover]);

  const handleMouseEnter = () => {
    if (!playOnHover) return;
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p !== undefined) {
      p.then(() => setIsPlaying(true)).catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    }
  };

  const handleMouseLeave = () => {
    if (!playOnHover) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div
      className={containerClassName}
      style={aspectRatio ? { aspectRatio } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        className={className}
      />

      {/* Play Indicator Overlay for playOnHover when paused */}
      {playOnHover && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-all duration-300 ${
            isPlaying ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-xl">
            <Play size={22} className="translate-x-0.5 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Video Badge in top-left corner */}
      {playOnHover && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-medium tracking-wider uppercase bg-black/60 text-white/90 backdrop-blur-xs border border-white/10 shadow-xs">
            Video
          </span>
        </div>
      )}

      {/* Sound Toggle Button */}
      {showAudioControl && hasAudio && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-xs transition-all shadow-md cursor-pointer group"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={16} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 size={16} className="group-hover:scale-110 transition-transform text-blue-400" />
          )}
        </button>
      )}
    </div>
  );
}
