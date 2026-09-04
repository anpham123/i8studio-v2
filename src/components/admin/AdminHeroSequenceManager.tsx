"use client";

import { useState, useEffect, useRef } from "react";
import { Film, Upload, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

interface HeroMeta {
  totalFrames: number;
  videoUrl: string;
  updatedAt: string;
}

export default function AdminHeroSequenceManager() {
  const [meta, setMeta] = useState<HeroMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchMeta = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hero-sequence", { cache: "no-store" });
      const data = await res.json();
      if (data?.success) {
        setMeta({
          totalFrames: data.totalFrames || 242,
          videoUrl: data.videoUrl || "/uploads/anhherrosection/1.mp4",
          updatedAt: data.updatedAt || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("video")) {
        toast("Vui lòng chọn file video định dạng MP4, MOV hoặc WebM", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setProcessStep("Đang tải video lên server...");

      const formData = new FormData();
      formData.append("file", selectedFile);

      setProcessStep("Server đang tự động phân rã và nén tối ưu chuỗi ảnh (mất ~3-5 giây)...");

      const res = await fetch("/api/hero-sequence", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Xử lý video thất bại");
      }

      setProcessStep(`Hoàn tất! Đã trích xuất thành công ${data.totalFrames} khung hình.`);
      toast(`Đã cập nhật Hero Video thành công! (${data.totalFrames} khung hình)`, "success");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchMeta();

      // Trigger revalidate
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } catch {}
    } catch (err: any) {
      toast(err.message || "Lỗi khi xử lý video", "error");
    } finally {
      setUploading(false);
      setTimeout(() => setProcessStep(""), 4000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-stone-900 to-[#1c1a16] text-white rounded-2xl p-6 sm:p-7 border border-[#c5a666]/30 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a666]/20 border border-[#c5a666]/30 text-[#c5a666] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Film size={13} />
            <span>HERO SCROLL-DRIVEN 3D WALKTHROUGH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Quản lý Video & Hiệu ứng Cuộn 3D Trang Chủ
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            Tải video MP4 mới lên tại đây — Hệ thống sẽ <strong>tự động cắt thành chuỗi khung hình nhẹ</strong> và đồng bộ trực tiếp ra trang chủ mà không cần chạm vào code!
          </p>
        </div>

        <a
          href="/ja"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur-sm border border-white/10 transition-colors shrink-0"
        >
          <span>Xem thử trên web</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Body: Current Status & Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Current Status Box */}
        <div className="lg:col-span-5 bg-black/40 rounded-xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-stone-400">Trạng thái hiện tại</span>
              <button
                onClick={fetchMeta}
                className="text-stone-400 hover:text-white transition-colors"
                title="Tải lại thông tin"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            {meta && (
              <div className="space-y-3 text-xs sm:text-sm font-light">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-stone-400">Tổng khung hình cuộn:</span>
                  <span className="font-mono font-bold text-[#c5a666] text-base">
                    {meta.totalFrames} frames
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-stone-400">Cập nhật lần cuối:</span>
                  <span className="text-stone-300 font-mono text-xs">
                    {meta.updatedAt ? new Date(meta.updatedAt).toLocaleString("vi-VN") : "Gốc ban đầu"}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-stone-400 block mb-1.5">Video gốc đang chạy:</span>
                  <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-black">
                    <video
                      src={meta.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Form Box */}
        <div className="lg:col-span-7 bg-white/[0.03] rounded-xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-stone-400 block mb-3">
              Tải Video MP4 mới để tự động thay thế
            </span>

            {/* Drop / Select area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                selectedFile
                  ? "border-[#c5a666] bg-[#c5a666]/10"
                  : "border-white/20 hover:border-white/40 bg-black/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload
                size={28}
                className={`mx-auto mb-2 ${selectedFile ? "text-[#c5a666]" : "text-stone-400"}`}
              />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Nhấp để đổi file khác
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-stone-300 font-medium">
                    Nhấp để chọn file video mới từ máy tính
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Hỗ trợ file .mp4, .mov (Khuyến nghị video 1–2 phút, 1080p)
                  </p>
                </div>
              )}
            </div>

            {/* Processing indicator */}
            {uploading && (
              <div className="mt-4 p-3.5 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center gap-3">
                <RefreshCw size={16} className="text-blue-400 animate-spin shrink-0" />
                <span className="text-xs text-blue-200 font-light">{processStep}</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-stone-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Tự động tối ưu 100% không làm nặng web</span>
            </div>

            <button
              onClick={handleUploadAndProcess}
              disabled={!selectedFile || uploading}
              className="px-6 py-2.5 bg-[#c5a666] hover:bg-[#b8935a] disabled:opacity-40 disabled:hover:bg-[#c5a666] text-[#111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Tải lên & Tự động cắt ảnh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
