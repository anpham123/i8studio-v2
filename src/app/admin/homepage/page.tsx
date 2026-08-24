"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Plus, X, Star, ChevronUp, ChevronDown, RefreshCw, ArrowLeftRight,
  Eye, GripVertical, Check, Pencil, Trash2, Play, Upload, Search,
  ImageIcon, Film, Filter, CheckSquare, Square, XCircle, Save,
  Maximize2, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Work {
  id: string;
  title: string;
  titleJa?: string;
  subtitle?: string;
  type?: string;
  category?: string;
  image: string;
  beforeImage?: string;
  videoUrl?: string;
  vrUrl?: string;
  homeOrder: number;
  featured: boolean;
}

const typeMap: Record<string, string> = {
  still: "Still Image", animation: "Animation", composite: "Photo Composite",
  vr360: "VR 360", walkthrough: "VR Walkthrough", ar: "AR", digital: "Digital Model",
};

const categoryMap: Record<string, string> = {
  "3DCG": "3DCG", Animation: "Animation", VR: "VR", BIM: "BIM",
};

const typeOptions = ["still", "animation", "composite", "vr360", "walkthrough", "ar", "digital"];
const categoryOptions = ["3DCG", "Animation", "VR", "BIM"];

function isVideoFile(url?: string) {
  return url ? /\.(mp4|webm|mov)$/i.test(url) : false;
}

export default function HomepagePage() {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [revalidating, setRevalidating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [swapTarget, setSwapTarget] = useState<{ work: Work; index: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [editWork, setEditWork] = useState<Work | null>(null);
  const [editForm, setEditForm] = useState<Partial<Work>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Work | null>(null);
  const [lightbox, setLightbox] = useState<{ work: Work; idx: number } | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    await fetch("/api/works/normalize-order", { method: "POST" }).catch(() => {});
    const res = await fetch("/api/works?limit=200");
    const json = await res.json();
    setAllWorks(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const homepageWorks = allWorks
    .filter((w) => w.featured && w.image)
    .sort((a, b) => a.homeOrder - b.homeOrder);

  const filteredHomepageWorks = filterType === "all"
    ? homepageWorks
    : homepageWorks.filter((w) => w.type === filterType);

  const availableWorks = allWorks
    .filter((w) => w.image && !w.featured)
    .filter((w) => !search || w.title.toLowerCase().includes(search.toLowerCase()));

  /* ─── API helpers ──────────────────────── */

  const addToHomepage = async (work: Work) => {
    const maxOrder = homepageWorks.length > 0
      ? Math.max(...homepageWorks.map((w) => w.homeOrder)) + 1 : 1;
    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: true, homeOrder: maxOrder }),
    });
    const json = await res.json();
    if (json.data) {
      setAllWorks((prev) => prev.map((w) => w.id === work.id ? { ...w, featured: true, homeOrder: maxOrder } : w));
      toast(`\u0110\u00e3 th\u00eam "${work.title}" v\u00e0o trang ch\u1ee7`, "success");
    } else toast("L\u1ed7i khi th\u00eam", "error");
  };

  const removeFromHomepage = async (work: Work) => {
    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: false, homeOrder: 0 }),
    });
    const json = await res.json();
    if (json.data) {
      setAllWorks((prev) => prev.map((w) => w.id === work.id ? { ...w, featured: false, homeOrder: 0 } : w));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(work.id); return n; });
      toast(`\u0110\u00e3 b\u1ecf "${work.title}" kh\u1ecfi trang ch\u1ee7`, "success");
    } else toast("L\u1ed7i khi b\u1ecf", "error");
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...homepageWorks];
    const current = items[index], prev = items[index - 1];
    const [a, b] = [prev.homeOrder, current.homeOrder];
    await Promise.all([
      fetch(`/api/works/${current.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homeOrder: a }) }),
      fetch(`/api/works/${prev.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homeOrder: b }) }),
    ]);
    setAllWorks((p) => p.map((w) => {
      if (w.id === current.id) return { ...w, homeOrder: a };
      if (w.id === prev.id) return { ...w, homeOrder: b };
      return w;
    }));
    toast("\u0110\u00e3 di chuy\u1ec3n l\u00ean", "success");
  };

  const moveDown = async (index: number) => {
    if (index >= homepageWorks.length - 1) return;
    const items = [...homepageWorks];
    const current = items[index], next = items[index + 1];
    const [a, b] = [next.homeOrder, current.homeOrder];
    await Promise.all([
      fetch(`/api/works/${current.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homeOrder: a }) }),
      fetch(`/api/works/${next.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homeOrder: b }) }),
    ]);
    setAllWorks((p) => p.map((w) => {
      if (w.id === current.id) return { ...w, homeOrder: a };
      if (w.id === next.id) return { ...w, homeOrder: b };
      return w;
    }));
    toast("\u0110\u00e3 di chuy\u1ec3n xu\u1ed1ng", "success");
  };

  const swapWork = async (oldWork: Work, newWork: Work) => {
    const order = oldWork.homeOrder;
    await fetch(`/api/works/${oldWork.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: false, homeOrder: 0 }) });
    await fetch(`/api/works/${newWork.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: true, homeOrder: order }) });
    setAllWorks((p) => p.map((w) => {
      if (w.id === oldWork.id) return { ...w, featured: false, homeOrder: 0 };
      if (w.id === newWork.id) return { ...w, featured: true, homeOrder: order };
      return w;
    }));
    setSwapTarget(null);
    toast(`\u0110\u00e3 thay "${oldWork.title}" b\u1eb1ng "${newWork.title}"`, "success");
  };

  /* ─── Drag & Drop ─── */
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = async (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const items = [...homepageWorks];
    const [moved] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, moved);
    const updates = items.map((item, i) => ({ id: item.id, homeOrder: i + 1 }));
    setAllWorks((p) => {
      const map = new Map(updates.map((u) => [u.id, u.homeOrder]));
      return p.map((w) => map.has(w.id) ? { ...w, homeOrder: map.get(w.id)! } : w);
    });
    setDragIdx(null); setDragOverIdx(null);
    await Promise.all(updates.map((u) => fetch(`/api/works/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homeOrder: u.homeOrder }) })));
    toast("\u0110\u00e3 s\u1eafp x\u1ebfp l\u1ea1i th\u1ee9 t\u1ef1", "success");
  };

  /* ─── Edit ─── */
  const openEdit = (work: Work) => {
    setEditWork(work);
    setEditForm({ title: work.title, titleJa: work.titleJa || "", type: work.type || "still", category: work.category || "3DCG", image: work.image, videoUrl: work.videoUrl || "", beforeImage: work.beforeImage || "" });
  };

  const saveEdit = async () => {
    if (!editWork) return;
    setSaving(true);
    const res = await fetch(`/api/works/${editWork.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    if (json.data) {
      setAllWorks((p) => p.map((w) => w.id === editWork.id ? { ...w, ...editForm } : w));
      setEditWork(null);
      toast("L\u01b0u th\u00e0nh c\u00f4ng!", "success");
    } else toast("L\u1ed7i khi l\u01b0u", "error");
    setSaving(false);
  };

  const uploadFile = async (file: File, field: "image" | "beforeImage") => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (json.url) {
      setEditForm((f) => ({ ...f, [field]: json.url }));
      toast(`Upload \u1ea3nh th\u00e0nh c\u00f4ng!`, "success");
    } else toast("L\u1ed7i upload", "error");
    setUploading(false);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-video", { method: "POST", body: formData });
    const json = await res.json();
    if (json.url) {
      setEditForm((f) => ({ ...f, videoUrl: json.url }));
      toast("Upload video th\u00e0nh c\u00f4ng!", "success");
    } else toast("L\u1ed7i upload video", "error");
    setUploading(false);
  };

  /* ─── Delete permanently ─── */
  const deletePermanently = async (work: Work) => {
    const res = await fetch(`/api/works/${work.id}`, { method: "DELETE" });
    if (res.ok) {
      setAllWorks((p) => p.filter((w) => w.id !== work.id));
      setDeleteConfirm(null);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(work.id); return n; });
      toast(`\u0110\u00e3 x\u00f3a v\u0129nh vi\u1ec5n "${work.title}"`, "success");
    } else toast("L\u1ed7i khi x\u00f3a", "error");
  };

  /* ─── Batch ─── */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const selectAll = () => {
    if (selectedIds.size === homepageWorks.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(homepageWorks.map((w) => w.id)));
  };
  const batchRemove = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) =>
      fetch(`/api/works/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: false, homeOrder: 0 }) })
    ));
    setAllWorks((p) => p.map((w) => selectedIds.has(w.id) ? { ...w, featured: false, homeOrder: 0 } : w));
    setSelectedIds(new Set());
    toast(`\u0110\u00e3 b\u1ecf ${ids.length} m\u1ee5c kh\u1ecfi trang ch\u1ee7`, "success");
  };

  /* ─── Revalidate ─── */
  const revalidateCache = async () => {
    setRevalidating(true);
    try {
      const res = await fetch("/api/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: "/" }) });
      const json = await res.json();
      toast(json.revalidated ? "\u0110\u00e3 c\u1eadp nh\u1eadt cache website th\u00e0nh c\u00f4ng!" : "L\u1ed7i c\u1eadp nh\u1eadt cache", json.revalidated ? "success" : "error");
    } catch { toast("L\u1ed7i c\u1eadp nh\u1eadt cache", "error"); }
    setRevalidating(false);
  };

  const heroWork = homepageWorks[0];
  const activeTypes = Array.from(new Set(homepageWorks.map((w) => w.type || "still")));

  return (
    <AdminShell
      title={`Trang ch\u1ee7 \u2014 \u1ea2nh hi\u1ec3n th\u1ecb (${homepageWorks.length})`}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={revalidateCache} disabled={revalidating}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={revalidating ? "animate-spin" : ""} />
            {revalidating ? "\u0110ang c\u1eadp nh\u1eadt..." : "C\u1eadp nh\u1eadt website"}
          </button>
          <button onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showPreview ? "bg-violet-100 text-violet-700 border border-violet-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            <Eye size={16} /> Preview
          </button>
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Th\u00eam \u1ea3nh
          </button>
        </div>
      }
    >
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>H\u01b0\u1edbng d\u1eabn:</strong> Qu\u1ea3n l\u00fd \u1ea3nh/video hi\u1ec3n th\u1ecb tr\u00ean trang ch\u1ee7. V\u1ecb tr\u00ed 1 = hero full m\u00e0n h\u00ecnh.
          &nbsp;|&nbsp; \ud83d\uddb1\ufe0f <strong>K\u00e9o th\u1ea3</strong> s\u1eafp x\u1ebfp &nbsp;|&nbsp; \u270f\ufe0f ch\u1ec9nh s\u1eeda &nbsp;|&nbsp; \ud83d\udd04 thay th\u1ebf &nbsp;|&nbsp; \ud83d\uddd1\ufe0f x\u00f3a v\u0129nh vi\u1ec5n &nbsp;|&nbsp; \u2715 b\u1ecf kh\u1ecfi trang ch\u1ee7
        </p>
      </div>

      {/* Batch actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <span className="text-sm font-medium text-amber-800">\u0110\u00e3 ch\u1ecdn {selectedIds.size} m\u1ee5c</span>
          <button onClick={batchRemove} className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
            <XCircle size={14} /> B\u1ecf kh\u1ecfi trang ch\u1ee7
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-sm text-gray-500 hover:text-gray-700 ml-auto">B\u1ecf ch\u1ecdn</button>
        </div>
      )}

      {/* Filter bar */}
      {homepageWorks.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          <button onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            T\u1ea5t c\u1ea3 ({homepageWorks.length})
          </button>
          {activeTypes.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {typeMap[t] || t} ({homepageWorks.filter((w) => (w.type || "still") === t).length})
            </button>
          ))}
        </div>
      )}

      {/* Hero Preview */}
      {showPreview && heroWork && (
        <div className="mb-6 rounded-xl overflow-hidden border border-violet-200 shadow-lg">
          <div className="bg-violet-50 px-4 py-2 flex items-center gap-2 border-b border-violet-200">
            <Eye size={14} className="text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Preview Hero \u2014 {heroWork.videoUrl && isVideoFile(heroWork.videoUrl) ? "Video" : "\u1ea2nh"} full m\u00e0n h\u00ecnh</span>
          </div>
          <div className="relative aspect-[21/9] bg-gray-900">
            {heroWork.videoUrl && isVideoFile(heroWork.videoUrl) ? (
              <video src={heroWork.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline poster={heroWork.image} />
            ) : (
              <img src={heroWork.image} alt={heroWork.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs text-white/60 mb-1">HERO \u2014 V\u1ecb tr\u00ed #1</p>
              <h3 className="text-xl font-semibold drop-shadow-lg">{heroWork.title}</h3>
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2 inline-block">
                {typeMap[heroWork.type || "still"] || heroWork.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Homepage works list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredHomepageWorks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Star size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">{filterType !== "all" ? "Kh\u00f4ng c\u00f3 m\u1ee5c n\u00e0o lo\u1ea1i n\u00e0y" : "Ch\u01b0a c\u00f3 \u1ea3nh n\u00e0o tr\u00ean trang ch\u1ee7"}</p>
          <p className="text-sm mt-1">B\u1ea5m &ldquo;Th\u00eam \u1ea3nh&rdquo; \u0111\u1ec3 ch\u1ecdn works hi\u1ec3n th\u1ecb</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Select all */}
          <div className="flex items-center gap-2 px-2 py-1">
            <button onClick={selectAll} className="text-gray-400 hover:text-gray-600">
              {selectedIds.size === homepageWorks.length ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <span className="text-xs text-gray-400">Ch\u1ecdn t\u1ea5t c\u1ea3</span>
          </div>

          {filteredHomepageWorks.map((work, idx) => {
            const realIdx = homepageWorks.findIndex((w) => w.id === work.id);
            return (
              <div
                key={work.id} draggable
                onDragStart={() => handleDragStart(realIdx)}
                onDragOver={(e) => handleDragOver(e, realIdx)}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                onDrop={() => handleDrop(realIdx)}
                className={`flex items-center gap-3 bg-white rounded-xl border p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing ${
                  realIdx === 0 ? "border-amber-300 bg-amber-50/50 ring-1 ring-amber-200" : "border-gray-200"
                } ${dragOverIdx === realIdx && dragIdx !== realIdx ? "border-blue-400 ring-2 ring-blue-200 bg-blue-50/50" : ""
                } ${dragIdx === realIdx ? "opacity-40 scale-[0.98]" : ""
                } ${selectedIds.has(work.id) ? "ring-2 ring-blue-300 bg-blue-50/30" : ""}`}
              >
                {/* Checkbox */}
                <button onClick={(e) => { e.stopPropagation(); toggleSelect(work.id); }} className="text-gray-300 hover:text-blue-500 shrink-0">
                  {selectedIds.has(work.id) ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                </button>

                {/* Drag handle */}
                <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0">
                  <GripVertical size={18} />
                </div>

                {/* Position */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${realIdx === 0 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {realIdx + 1}
                </div>

                {/* Thumbnail with video indicator */}
                <div className="relative w-20 h-14 shrink-0 cursor-pointer group" onClick={() => setLightbox({ work, idx: realIdx })}>
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover rounded-lg" />
                  {(work.videoUrl && isVideoFile(work.videoUrl)) && (
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
                  <p className="font-medium text-gray-900 truncate text-sm">{work.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {typeMap[work.type || "still"] || work.type}
                    </span>
                    {work.videoUrl && (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Film size={10} /> Video
                      </span>
                    )}
                    {realIdx === 0 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        \u2605 Hero
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => openEdit(work)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Ch\u1ec9nh s\u1eeda">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setSwapTarget({ work, index: realIdx })} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Thay th\u1ebf">
                    <ArrowLeftRight size={15} />
                  </button>
                  <div className="flex flex-col">
                    <button onClick={() => moveUp(realIdx)} disabled={realIdx === 0} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors" title="L\u00ean">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveDown(realIdx)} disabled={realIdx === homepageWorks.length - 1} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors" title="Xu\u1ed1ng">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromHomepage(work)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors" title="B\u1ecf kh\u1ecfi trang ch\u1ee7">
                    <X size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(work)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="X\u00f3a v\u0129nh vi\u1ec5n">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditWork(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold">Ch\u1ec9nh s\u1eeda: {editWork.title}</h3>
              <button onClick={() => setEditWork(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ti\u00eau \u0111\u1ec1 (EN)</label>
                <input type="text" value={editForm.title || ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ti\u00eau \u0111\u1ec1 (JP)</label>
                <input type="text" value={editForm.titleJa || ""} onChange={(e) => setEditForm((f) => ({ ...f, titleJa: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              {/* Type + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lo\u1ea1i</label>
                  <select value={editForm.type || "still"} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {typeOptions.map((t) => <option key={t} value={t}>{typeMap[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh m\u1ee5c</label>
                  <select value={editForm.category || "3DCG"} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {categoryOptions.map((c) => <option key={c} value={c}>{categoryMap[c]}</option>)}
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">\u1ea2nh ch\u00ednh</label>
                <div className="flex items-start gap-3">
                  {editForm.image && (
                    <img src={editForm.image} alt="" className="w-32 h-20 object-cover rounded-lg border" />
                  )}
                  <div className="flex-1">
                    <input type="text" value={editForm.image || ""} onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mb-2" placeholder="URL \u1ea3nh..." />
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "image"); }} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50">
                      <Upload size={14} /> {uploading ? "\u0110ang upload..." : "Upload \u1ea3nh m\u1edbi"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editForm.videoUrl || ""} onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="YouTube URL ho\u1eb7c \u0111\u01b0\u1eddng d\u1eabn video..." />
                  <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadVideo(e.target.files[0]); }} />
                  <button onClick={() => videoInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium disabled:opacity-50 shrink-0">
                    <Film size={14} /> Upload video
                  </button>
                </div>
                {editForm.videoUrl && isVideoFile(editForm.videoUrl) && (
                  <video src={editForm.videoUrl} className="w-full max-h-40 object-cover rounded-lg mt-2 border" controls muted />
                )}
              </div>

              {/* Before Image (for composite) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">\u1ea2nh Before (Photo Composite)</label>
                <div className="flex items-start gap-3">
                  {editForm.beforeImage && (
                    <img src={editForm.beforeImage} alt="" className="w-32 h-20 object-cover rounded-lg border" />
                  )}
                  <input type="text" value={editForm.beforeImage || ""} onChange={(e) => setEditForm((f) => ({ ...f, beforeImage: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="URL \u1ea3nh before..." />
                </div>
              </div>
            </div>
            {/* Save/Cancel */}
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setEditWork(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">H\u1ee7y</button>
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                <Save size={16} /> {saving ? "\u0110ang l\u01b0u..." : "L\u01b0u thay \u0111\u1ed5i"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete confirm ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">X\u00f3a v\u0129nh vi\u1ec5n?</h3>
                <p className="text-sm text-gray-500">Kh\u00f4ng th\u1ec3 ho\u00e0n t\u00e1c!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 mb-5">
              <img src={deleteConfirm.image} alt="" className="w-16 h-11 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{deleteConfirm.title}</p>
                <span className="text-xs text-gray-500">{typeMap[deleteConfirm.type || "still"]}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg">H\u1ee7y</button>
              <button onClick={() => deletePermanently(deleteConfirm)}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                <Trash2 size={16} /> X\u00f3a v\u0129nh vi\u1ec5n
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><X size={28} /></button>
          {/* Nav */}
          {lightbox.idx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox({ work: homepageWorks[lightbox.idx - 1], idx: lightbox.idx - 1 }); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"><ChevronLeft size={36} /></button>
          )}
          {lightbox.idx < homepageWorks.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox({ work: homepageWorks[lightbox.idx + 1], idx: lightbox.idx + 1 }); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"><ChevronRight size={36} /></button>
          )}
          <div className="max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {lightbox.work.videoUrl && isVideoFile(lightbox.work.videoUrl) ? (
              <video src={lightbox.work.videoUrl} className="max-w-full max-h-[85vh] rounded-lg" controls autoPlay muted poster={lightbox.work.image} />
            ) : (
              <img src={lightbox.work.image} alt={lightbox.work.title} className="max-w-full max-h-[85vh] rounded-lg object-contain" />
            )}
            <p className="text-white text-center mt-3 text-sm">#{lightbox.idx + 1} \u2014 {lightbox.work.title}</p>
          </div>
        </div>
      )}

      {/* ─── Picker modal (Add) ─── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ch\u1ecdn \u1ea3nh th\u00eam v\u00e0o trang ch\u1ee7</h3>
              <button onClick={() => setShowPicker(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="px-6 py-3 border-b">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="T\u00ecm ki\u1ebfm work..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {availableWorks.length === 0 ? (
                <p className="text-center py-8 text-gray-400">Kh\u00f4ng t\u00ecm th\u1ea5y work n\u00e0o</p>
              ) : availableWorks.map((work) => (
                <div key={work.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => addToHomepage(work)}>
                  <div className="relative w-16 h-11 shrink-0">
                    <img src={work.image} alt={work.title} className="w-full h-full object-cover rounded-lg" />
                    {work.videoUrl && isVideoFile(work.videoUrl) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"><Play size={12} className="text-white fill-white" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{work.title}</p>
                    <span className="text-xs text-gray-500">{typeMap[work.type || "still"] || work.type}</span>
                  </div>
                  <Plus size={18} className="text-blue-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Swap modal ─── */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSwapTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Thay th\u1ebf \u1ea3nh</h3>
                <button onClick={() => setSwapTarget(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <img src={swapTarget.work.image} alt={swapTarget.work.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-600 font-medium mb-0.5">{`\u0110ang thay th\u1ebf (v\u1ecb tr\u00ed #${swapTarget.index + 1})`}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{swapTarget.work.title}</p>
                </div>
                <ArrowLeftRight size={20} className="text-amber-500 shrink-0" />
              </div>
            </div>
            <div className="px-6 py-3 border-b">
              <input type="text" placeholder="T\u00ecm ki\u1ebfm work \u0111\u1ec3 thay th\u1ebf..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {availableWorks.length === 0 ? (
                <p className="text-center py-8 text-gray-400">Kh\u00f4ng t\u00ecm th\u1ea5y work n\u00e0o</p>
              ) : availableWorks.map((work) => (
                <div key={work.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group" onClick={() => swapWork(swapTarget.work, work)}>
                  <img src={work.image} alt={work.title} className="w-16 h-11 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{work.title}</p>
                    <span className="text-xs text-gray-500">{typeMap[work.type || "still"] || work.type}</span>
                  </div>
                  <Check size={18} className="text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
