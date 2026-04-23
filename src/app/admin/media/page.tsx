"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Upload, Copy, Trash2, Search, ImageIcon } from "lucide-react";

interface MediaFile { filename: string; url: string; size: number; createdAt: string; }

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [del, setDel] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/media");
    const json = await res.json();
    setFiles(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) { toast("Đã upload", "success"); fetchFiles(); }
    else toast("Lỗi upload", "error");
  };

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/media`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: del.filename }) });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchFiles();
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast("Đã copy URL", "success"); };

  const filtered = files.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()));

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / 1024 / 1024).toFixed(1)}MB`;

  return (
    <AdminShell title={`Media (${files.length})`} actions={<button onClick={() => inputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={15} />} Upload</button>}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />

      <div className="mb-4 relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên file..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <ImageIcon size={40} strokeWidth={1} />
          <p className="text-sm">{search ? "Không tìm thấy" : "Chưa có ảnh nào"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((file) => (
            <div key={file.filename} className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img src={file.url} alt={file.filename} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(file.url)} className="p-1.5 bg-white rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600" title="Copy URL"><Copy size={14} /></button>
                  <button onClick={() => setDel(file)} className="p-1.5 bg-white rounded text-gray-700 hover:bg-red-50 hover:text-red-600" title="Xóa"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{file.filename}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!del} message={`Xóa file "${del?.filename}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
