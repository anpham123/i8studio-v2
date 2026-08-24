"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Plus, X, ChevronUp, ChevronDown, RefreshCw, Eye, GripVertical,
  Pencil, Trash2, Play, Upload, Save, Maximize2, ChevronLeft,
  ChevronRight, Image as ImageIcon, Film, ToggleLeft, ToggleRight,
} from "lucide-react";

interface HomeMedia {
  id: string;
  title: string;
  image: string;
  videoUrl: string;
  type: string; // "image" | "video"
  order: number;
  active: boolean;
  createdAt: string;
}

function isVideoFile(url?: string) {
  return url ? /\.(mp4|webm|mov)$/i.test(url) : false;
}

export default function HomepagePage() {
  const [items, setItems] = useState<HomeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [revalidating, setRevalidating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<HomeMedia | null>(null);
  const [editForm, setEditForm] = useState<Partial<HomeMedia>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<HomeMedia | null>(null);
  const [lightbox, setLightbox] = useState<{ item: HomeMedia; idx: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Add modal form
  const [addForm, setAddForm] = useState({ title: "", type: "image" as string });
  const [addImage, setAddImage] = useState<File | null>(null);
  const [addVideo, setAddVideo] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState("");

  const addImageRef = useRef<HTMLInputElement>(null);
  const addVideoRef = useRef<HTMLInputElement>(null);
  const editImageRef = useRef<HTMLInputElement>(null);
  const editVideoRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/home-media");
    const json = await res.json();
    setItems(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeItems = items.filter((i) => i.active).sort((a, b) => a.order - b.order);
  const allSorted = items.sort((a, b) => a.order - b.order);

  /* ─── Upload helpers with progress ─── */
  const uploadWithProgress = (url: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json.url || "");
        } catch { resolve(""); }
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.open("POST", url);
      xhr.send(formData);
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploadProgress(0);
    return uploadWithProgress("/api/upload", file);
  };

  const uploadVideoFile = async (file: File): Promise<string> => {
    setUploadProgress(0);
    return uploadWithProgress("/api/upload-video", file);
  };

  /* ─── Add new ─── */
  const handleAdd = async () => {
    if (!addImage && !addVideo) { toast("Vui lòng chọn ảnh hoặc video", "error"); return; }
    setSaving(true);
    let imageUrl = "";
    let videoUrl = "";

    if (addImage) imageUrl = await uploadImage(addImage);
    if (addVideo) videoUrl = await uploadVideoFile(addVideo);

    const res = await fetch("/api/home-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: addForm.title || (addImage?.name || addVideo?.name || "Untitled"),
        image: imageUrl,
        videoUrl: videoUrl,
        type: addVideo ? "video" : "image",
      }),
    });
    const json = await res.json();
    if (json.data) {
      setItems((prev) => [...prev, json.data]);
      setShowAddModal(false);
      setAddForm({ title: "", type: "image" });
      setAddImage(null); setAddVideo(null); setAddImagePreview("");
      toast("Đã thêm thành công!", "success");
    } else toast("Lỗi khi thêm", "error");
    setSaving(false);
  };

  /* ─── Edit ─── */
  const openEdit = (item: HomeMedia) => {
    setEditItem(item);
    setEditForm({ title: item.title, image: item.image, videoUrl: item.videoUrl, type: item.type, active: item.active });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    setSaving(true);
    const res = await fetch(`/api/home-media/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    if (json.data) {
      setItems((p) => p.map((i) => i.id === editItem.id ? { ...i, ...json.data } : i));
      setEditItem(null);
      toast("Lưu thành công!", "success");
    } else toast("Lỗi khi lưu", "error");
    setSaving(false);
  };

  const editUploadImage = async (file: File) => {
    setUploading(true);
    const url = await uploadImage(file);
    if (url) { setEditForm((f) => ({ ...f, image: url })); toast("Upload ảnh thành công!", "success"); }
    else toast("Lỗi upload", "error");
    setUploading(false);
  };

  const editUploadVideo = async (file: File) => {
    setUploading(true);
    const url = await uploadVideoFile(file);
    if (url) { setEditForm((f) => ({ ...f, videoUrl: url, type: "video" })); toast("Upload video thành công!", "success"); }
    else toast("Lỗi upload video", "error");
    setUploading(false);
  };

  /* ─── Toggle active ─── */
  const toggleActive = async (item: HomeMedia) => {
    const res = await fetch(`/api/home-media/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    const json = await res.json();
    if (json.data) {
      setItems((p) => p.map((i) => i.id === item.id ? { ...i, active: !item.active } : i));
      toast(item.active ? "Đã ẩn khỏi trang chủ" : "Đã hiện trên trang chủ", "success");
    }
  };

  /* ─── Delete ─── */
  const deletePermanently = async (item: HomeMedia) => {
    const res = await fetch(`/api/home-media/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((p) => p.filter((i) => i.id !== item.id));
      setDeleteConfirm(null);
      toast(`Đã xóa "${item.title}"`, "success");
    } else toast("Lỗi khi xóa", "error");
  };

  /* ─── Move up/down ─── */
  const moveUp = async (index: number) => {
    if (index === 0) return;
    const sorted = [...allSorted];
    const [a, b] = [sorted[index], sorted[index - 1]];
    const newItems = sorted.map((i) => {
      if (i.id === a.id) return { ...i, order: b.order };
      if (i.id === b.id) return { ...i, order: a.order };
      return i;
    });
    setItems(newItems);
    await fetch("/api/home-media/reorder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: a.id, order: b.order }, { id: b.id, order: a.order }] }),
    });
    toast("Đã di chuyển lên", "success");
  };

  const moveDown = async (index: number) => {
    if (index >= allSorted.length - 1) return;
    const sorted = [...allSorted];
    const [a, b] = [sorted[index], sorted[index + 1]];
    const newItems = sorted.map((i) => {
      if (i.id === a.id) return { ...i, order: b.order };
      if (i.id === b.id) return { ...i, order: a.order };
      return i;
    });
    setItems(newItems);
    await fetch("/api/home-media/reorder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: a.id, order: b.order }, { id: b.id, order: a.order }] }),
    });
    toast("Đã di chuyển xuống", "success");
  };

  /* ─── Drag & Drop ─── */
  const handleDrop = async (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const sorted = [...allSorted];
    const [moved] = sorted.splice(dragIdx, 1);
    sorted.splice(targetIdx, 0, moved);
    const updates = sorted.map((item, i) => ({ id: item.id, order: i + 1 }));
    setItems(sorted.map((item, i) => ({ ...item, order: i + 1 })));
    setDragIdx(null); setDragOverIdx(null);
    await fetch("/api/home-media/reorder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updates }),
    });
    toast("Đã sắp xếp lại", "success");
  };

  /* ─── Revalidate ─── */
  const revalidateCache = async () => {
    setRevalidating(true);
    try {
      const res = await fetch("/api/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: "/" }) });
      const json = await res.json();
      toast(json.revalidated ? "Đã cập nhật website!" : "Lỗi cập nhật", json.revalidated ? "success" : "error");
    } catch { toast("Lỗi cập nhật", "error"); }
    setRevalidating(false);
  };

  const heroItem = activeItems[0];

  return (
    <AdminShell
      title={`Trang chủ — Media (${activeItems.length} hiện / ${items.length} tổng)`}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={revalidateCache} disabled={revalidating}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={revalidating ? "animate-spin" : ""} />
            {revalidating ? "Đang cập nhật..." : "Cập nhật website"}
          </button>
          <button onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showPreview ? "bg-violet-100 text-violet-700 border border-violet-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            <Eye size={16} /> Preview
          </button>
          <button onClick={() => { setShowAddModal(true); setAddForm({ title: "", type: "image" }); setAddImage(null); setAddVideo(null); setAddImagePreview(""); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      }
    >
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Hướng dẫn:</strong> Upload ảnh/video hiển thị trên trang chủ. Vị trí 1 = hero full màn hình.
          Kéo thả để sắp xếp. Bật/tắt để ẩn/hiện.
        </p>
      </div>

      {/* Hero Preview */}
      {showPreview && heroItem && (
        <div className="mb-6 rounded-xl overflow-hidden border border-violet-200 shadow-lg">
          <div className="bg-violet-50 px-4 py-2 flex items-center gap-2 border-b border-violet-200">
            <Eye size={14} className="text-violet-600" />
            <span className="text-sm font-medium text-violet-700">
              Preview Hero — {heroItem.type === "video" || isVideoFile(heroItem.videoUrl) ? "Video" : "Ảnh"} full màn hình
            </span>
          </div>
          <div className="relative aspect-[21/9] bg-gray-900">
            {(heroItem.type === "video" || isVideoFile(heroItem.videoUrl)) && heroItem.videoUrl ? (
              <video src={heroItem.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline poster={heroItem.image} />
            ) : (
              <img src={heroItem.image} alt={heroItem.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs text-white/60 mb-1">HERO — Vị trí #1</p>
              <h3 className="text-xl font-semibold drop-shadow-lg">{heroItem.title || "Chưa có tiêu đề"}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : allSorted.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Chưa có media nào</p>
          <p className="text-sm mt-1">Bấm "Thêm mới" để upload ảnh/video</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allSorted.map((item, idx) => (
            <div
              key={item.id} draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center gap-3 bg-white rounded-xl border p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing ${
                !item.active ? "opacity-50" : ""
              } ${idx === 0 && item.active ? "border-amber-300 bg-amber-50/50 ring-1 ring-amber-200" : "border-gray-200"
              } ${dragOverIdx === idx && dragIdx !== idx ? "border-blue-400 ring-2 ring-blue-200 bg-blue-50/50" : ""
              } ${dragIdx === idx ? "opacity-40 scale-[0.98]" : ""}`}
            >
              {/* Drag handle */}
              <div className="text-gray-300 hover:text-gray-500 shrink-0"><GripVertical size={18} /></div>

              {/* Position */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                idx === 0 && item.active ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>{idx + 1}</div>

              {/* Thumbnail */}
              <div className="relative w-20 h-14 shrink-0 cursor-pointer group" onClick={() => setLightbox({ item, idx })}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400" />
                  </div>
                )}
                {(item.type === "video" || isVideoFile(item.videoUrl)) && item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                  <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">{item.title || "Chưa đặt tên"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === "video" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                    {item.type === "video" ? <><Film size={10} className="inline mr-0.5" />Video</> : <><ImageIcon size={10} className="inline mr-0.5" />Ảnh</>}
                  </span>
                  {!item.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Đang ẩn</span>}
                  {idx === 0 && item.active && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">★ Hero</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => toggleActive(item)} className={`p-1.5 rounded-lg transition-colors ${item.active ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                  title={item.active ? "Ẩn" : "Hiện"}>
                  {item.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Chỉnh sửa">
                  <Pencil size={15} />
                </button>
                <div className="flex flex-col">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
                  <button onClick={() => moveDown(idx)} disabled={idx === allSorted.length - 1} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
                </div>
                <button onClick={() => setDeleteConfirm(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Xóa">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Add Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thêm ảnh/video mới</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (tùy chọn)</label>
                <input type="text" value={addForm.title} onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Tên hiển thị..." />
              </div>

              {/* Upload ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh chính <span className="text-gray-400 font-normal">(bắt buộc cho thumbnail)</span></label>
                <input ref={addImageRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setAddImage(file); setAddImagePreview(URL.createObjectURL(file)); }
                  }} />
                {addImagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border mb-2">
                    <img src={addImagePreview} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => { setAddImage(null); setAddImagePreview(""); }} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"><X size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => addImageRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Bấm để chọn ảnh</span>
                  </button>
                )}
              </div>

              {/* Upload video (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video <span className="text-gray-400 font-normal">(tùy chọn — sẽ autoplay trên trang chủ)</span></label>
                <input ref={addVideoRef} type="file" accept="video/*" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) setAddVideo(e.target.files[0]); }} />
                {addVideo ? (
                  <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <Film size={20} className="text-purple-500 shrink-0" />
                    <span className="text-sm text-purple-700 truncate flex-1">{addVideo.name}</span>
                    <button onClick={() => setAddVideo(null)} className="text-purple-400 hover:text-purple-600"><X size={16} /></button>
                  </div>
                ) : (
                  <button onClick={() => addVideoRef.current?.click()}
                    className="w-full border-2 border-dashed border-purple-200 rounded-lg py-4 flex items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50/50 transition-colors">
                    <Film size={18} className="text-purple-400" />
                    <span className="text-sm text-purple-500">Chọn video (mp4, webm, mov)</span>
                  </button>
                )}
              </div>
            </div>
            {/* Upload progress bar */}
            {saving && uploadProgress > 0 && (
              <div className="px-6 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-600">Đang upload...</span>
                  <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Hủy</button>
              <button onClick={handleAdd} disabled={saving || (!addImage && !addVideo)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                <Upload size={16} /> {saving ? `Đang upload... ${uploadProgress}%` : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold">Chỉnh sửa</h3>
              <button onClick={() => setEditItem(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input type="text" value={editForm.title || ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chính</label>
                <div className="flex items-start gap-3">
                  {editForm.image && <img src={editForm.image} alt="" className="w-32 h-20 object-cover rounded-lg border" />}
                  <div className="flex-1">
                    <input type="text" value={editForm.image || ""} onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mb-2" placeholder="URL ảnh..." />
                    <input ref={editImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) editUploadImage(e.target.files[0]); }} />
                    <button onClick={() => editImageRef.current?.click()} disabled={uploading}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50">
                      <Upload size={14} /> {uploading ? `Đang upload ${uploadProgress}%` : "Upload ảnh mới"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editForm.videoUrl || ""} onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value, type: e.target.value ? "video" : "image" }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Đường dẫn video..." />
                  <input ref={editVideoRef} type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) editUploadVideo(e.target.files[0]); }} />
                  <button onClick={() => editVideoRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium disabled:opacity-50 shrink-0">
                    <Film size={14} /> Upload video
                  </button>
                </div>
                {editForm.videoUrl && isVideoFile(editForm.videoUrl) && (
                  <video src={editForm.videoUrl} className="w-full max-h-40 object-cover rounded-lg mt-2 border" controls muted />
                )}
                {editForm.videoUrl && (
                  <button onClick={() => setEditForm((f) => ({ ...f, videoUrl: "", type: "image" }))} className="text-xs text-red-500 mt-1 hover:text-red-700">Xóa video</button>
                )}
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Hiển thị trên trang chủ</p>
                  <p className="text-xs text-gray-400">Tắt để ẩn tạm, không cần xóa</p>
                </div>
                <button onClick={() => setEditForm((f) => ({ ...f, active: !f.active }))}
                  className={`p-1 rounded-lg ${editForm.active ? "text-emerald-500" : "text-gray-400"}`}>
                  {editForm.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
            </div>
            {/* Upload progress bar */}
            {uploading && uploadProgress > 0 && (
              <div className="px-6 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-600">Đang upload...</span>
                  <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            <div className="px-6 py-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Hủy</button>
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                <Save size={16} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><Trash2 size={24} className="text-red-500" /></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xóa vĩnh viễn?</h3>
                <p className="text-sm text-gray-500">Không thể hoàn tác!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 mb-5">
              {deleteConfirm.image && <img src={deleteConfirm.image} alt="" className="w-16 h-11 object-cover rounded-lg" />}
              <p className="text-sm font-medium text-gray-900 truncate">{deleteConfirm.title || "Chưa đặt tên"}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Hủy</button>
              <button onClick={() => deletePermanently(deleteConfirm)}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><X size={28} /></button>
          {lightbox.idx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox({ item: allSorted[lightbox.idx - 1], idx: lightbox.idx - 1 }); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"><ChevronLeft size={36} /></button>
          )}
          {lightbox.idx < allSorted.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox({ item: allSorted[lightbox.idx + 1], idx: lightbox.idx + 1 }); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"><ChevronRight size={36} /></button>
          )}
          <div className="flex flex-col items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
            {(lightbox.item.type === "video" || isVideoFile(lightbox.item.videoUrl)) && lightbox.item.videoUrl ? (
              <video src={lightbox.item.videoUrl} className="max-w-full max-h-[80vh] rounded-lg object-contain" controls autoPlay muted poster={lightbox.item.image} />
            ) : lightbox.item.image ? (
              <img src={lightbox.item.image} alt={lightbox.item.title} className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            ) : (
              <div className="w-64 h-40 bg-gray-800 rounded-lg flex items-center justify-center"><ImageIcon size={48} className="text-gray-600" /></div>
            )}
            <p className="text-white text-center mt-3 text-sm">#{lightbox.idx + 1} — {lightbox.item.title || "Chưa đặt tên"}</p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
