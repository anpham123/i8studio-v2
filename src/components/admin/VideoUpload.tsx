"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Film, Loader2 } from "lucide-react";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function VideoUpload({ value, onChange, label = "Video" }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setError("");
    if (!["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
      setError("Chỉ chấp nhận MP4, WebM, MOV");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setError("Tệp quá lớn. Tối đa 200MB");
      return;
    }
    setUploading(true);
    setProgress(0);

    // Use XMLHttpRequest for upload progress
    const fd = new FormData();
    fd.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      const result = await new Promise<{ url?: string; error?: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error("Parse error")); }
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("POST", "/api/upload-video");
        xhr.send(fd);
      });

      if (result.url) {
        onChange(result.url);
      } else {
        setError(result.error || "Upload thất bại");
      }
    } catch {
      setError("Upload thất bại");
    }
    setUploading(false);
    setProgress(0);
  }, [onChange]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await upload(file);
  }, [upload]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await upload(file);
    e.target.value = "";
  }, [upload]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {value ? (
        <div className="relative">
          <video
            src={value}
            controls
            className="w-full max-w-md rounded-lg border border-gray-200"
            style={{ maxHeight: 240 }}
          />
          <button
            type="button" onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-sm">Đang tải lên... {progress}%</span>
              <div className="w-48 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                {dragging ? <Upload size={22} className="text-blue-500" /> : <Film size={22} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Kéo thả hoặc click để chọn</p>
                <p className="text-xs mt-0.5">MP4, WebM, MOV · Tối đa 200MB</p>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleChange} />
    </div>
  );
}
