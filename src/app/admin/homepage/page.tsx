"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Plus, X, Star, ChevronUp, ChevronDown,
  RefreshCw, ArrowLeftRight, Eye, GripVertical,
  Check,
} from "lucide-react";

interface Work {
  id: string;
  title: string;
  type?: string;
  image: string;
  homeOrder: number;
  featured: boolean;
}

const typeMap: Record<string, string> = {
  still: "Still Image", animation: "Animation", composite: "Photo Composite",
  vr360: "VR 360", walkthrough: "VR Walkthrough", ar: "AR", digital: "Digital Model",
};

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
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Auto-normalize homeOrder for legacy items (all had homeOrder=0)
    await fetch("/api/works/normalize-order", { method: "POST" }).catch(() => {});
    const res = await fetch("/api/works?limit=200");
    const json = await res.json();
    setAllWorks(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Homepage works = featured + has image, sorted by homeOrder
  const homepageWorks = allWorks
    .filter((w) => w.featured && w.image)
    .sort((a, b) => a.homeOrder - b.homeOrder);

  // Available works = has image but not featured
  const availableWorks = allWorks
    .filter((w) => w.image && !w.featured)
    .filter((w) => !search || w.title.toLowerCase().includes(search.toLowerCase()));

  /* ─── API helpers ──────────────────────── */

  const addToHomepage = async (work: Work) => {
    const maxOrder = homepageWorks.length > 0
      ? Math.max(...homepageWorks.map((w) => w.homeOrder)) + 1
      : 1;

    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: true, homeOrder: maxOrder }),
    });
    const json = await res.json();
    if (json.data) {
      setAllWorks((prev) =>
        prev.map((w) => w.id === work.id ? { ...w, featured: true, homeOrder: maxOrder } : w)
      );
      toast(`Đã thêm "${work.title}" vào trang chủ`, "success");
    } else {
      toast("Lỗi khi thêm", "error");
    }
  };

  const removeFromHomepage = async (work: Work) => {
    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: false, homeOrder: 0 }),
    });
    const json = await res.json();
    if (json.data) {
      setAllWorks((prev) =>
        prev.map((w) => w.id === work.id ? { ...w, featured: false, homeOrder: 0 } : w)
      );
      toast(`Đã bỏ "${work.title}" khỏi trang chủ`, "success");
    } else {
      toast("Lỗi khi bỏ", "error");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...homepageWorks];
    const current = items[index];
    const prev = items[index - 1];

    const tmpOrder = current.homeOrder;
    const newCurrentOrder = prev.homeOrder;
    const newPrevOrder = tmpOrder;

    await Promise.all([
      fetch(`/api/works/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeOrder: newCurrentOrder }),
      }),
      fetch(`/api/works/${prev.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeOrder: newPrevOrder }),
      }),
    ]);

    setAllWorks((prevAll) =>
      prevAll.map((w) => {
        if (w.id === current.id) return { ...w, homeOrder: newCurrentOrder };
        if (w.id === prev.id) return { ...w, homeOrder: newPrevOrder };
        return w;
      })
    );
    toast("Đã di chuyển lên", "success");
  };

  const moveDown = async (index: number) => {
    if (index >= homepageWorks.length - 1) return;
    const items = [...homepageWorks];
    const current = items[index];
    const next = items[index + 1];

    const tmpOrder = current.homeOrder;
    const newCurrentOrder = next.homeOrder;
    const newNextOrder = tmpOrder;

    await Promise.all([
      fetch(`/api/works/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeOrder: newCurrentOrder }),
      }),
      fetch(`/api/works/${next.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeOrder: newNextOrder }),
      }),
    ]);

    setAllWorks((prevAll) =>
      prevAll.map((w) => {
        if (w.id === current.id) return { ...w, homeOrder: newCurrentOrder };
        if (w.id === next.id) return { ...w, homeOrder: newNextOrder };
        return w;
      })
    );
    toast("Đã di chuyển xuống", "success");
  };

  /* ─── Swap: replace a homepage item with another work ─── */
  const swapWork = async (oldWork: Work, newWork: Work) => {
    const order = oldWork.homeOrder;
    // Remove old from homepage
    await fetch(`/api/works/${oldWork.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: false, homeOrder: 0 }),
    });
    // Add new at same position
    await fetch(`/api/works/${newWork.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: true, homeOrder: order }),
    });

    setAllWorks((prev) =>
      prev.map((w) => {
        if (w.id === oldWork.id) return { ...w, featured: false, homeOrder: 0 };
        if (w.id === newWork.id) return { ...w, featured: true, homeOrder: order };
        return w;
      })
    );
    setSwapTarget(null);
    toast(`Đã thay "${oldWork.title}" bằng "${newWork.title}"`, "success");
  };

  /* ─── Drag & Drop ─── */
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = async (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }

    const items = [...homepageWorks];
    const [moved] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, moved);

    // Reassign homeOrder sequentially
    const updates = items.map((item, i) => ({
      id: item.id,
      homeOrder: i + 1,
    }));

    // Optimistic UI update
    setAllWorks((prevAll) => {
      const map = new Map(updates.map((u) => [u.id, u.homeOrder]));
      return prevAll.map((w) => map.has(w.id) ? { ...w, homeOrder: map.get(w.id)! } : w);
    });

    setDragIdx(null);
    setDragOverIdx(null);

    // Persist all order changes
    await Promise.all(
      updates.map((u) =>
        fetch(`/api/works/${u.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ homeOrder: u.homeOrder }),
        })
      )
    );
    toast("Đã sắp xếp lại thứ tự", "success");
  };

  /* ─── Revalidate cache ─── */
  const revalidateCache = async () => {
    setRevalidating(true);
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      const json = await res.json();
      if (json.revalidated) {
        toast("Đã cập nhật cache website thành công!", "success");
      } else {
        toast("Lỗi khi cập nhật cache", "error");
      }
    } catch {
      toast("Lỗi khi cập nhật cache", "error");
    }
    setRevalidating(false);
  };

  const heroWork = homepageWorks[0];

  return (
    <AdminShell
      title={`Trang chủ — Ảnh hiển thị (${homepageWorks.length})`}
      actions={
        <div className="flex items-center gap-2">
          {/* Revalidate button */}
          <button
            onClick={revalidateCache}
            disabled={revalidating}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            title="Cập nhật website ngay (xóa cache)"
          >
            <RefreshCw size={16} className={revalidating ? "animate-spin" : ""} />
            {revalidating ? "Đang cập nhật..." : "Cập nhật website"}
          </button>

          {/* Preview button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showPreview
                ? "bg-violet-100 text-violet-700 border border-violet-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye size={16} /> Preview Hero
          </button>

          {/* Add button */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Thêm ảnh
          </button>
        </div>
      }
    >
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Hướng dẫn:</strong> Quản lý ảnh hiển thị trên trang chủ. Ảnh đầu tiên (vị trí 1) sẽ là ảnh hero full màn hình.
          <br />
          🖱️ <strong>Kéo thả</strong> để sắp xếp nhanh &nbsp;|&nbsp;
          ▲ ▼ di chuyển thứ tự &nbsp;|&nbsp;
          🔄 thay thế ảnh &nbsp;|&nbsp;
          ✕ bỏ khỏi trang chủ &nbsp;|&nbsp;
          Bấm <strong>&quot;Cập nhật website&quot;</strong> để áp dụng thay đổi ngay.
        </p>
      </div>

      {/* Hero Preview */}
      {showPreview && heroWork && (
        <div className="mb-6 rounded-xl overflow-hidden border border-violet-200 shadow-lg">
          <div className="bg-violet-50 px-4 py-2 flex items-center gap-2 border-b border-violet-200">
            <Eye size={14} className="text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Preview Hero — Ảnh full màn hình trên trang chủ</span>
          </div>
          <div className="relative aspect-[21/9] bg-gray-900">
            <img
              src={heroWork.image}
              alt={heroWork.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs text-white/60 mb-1">HERO IMAGE — Vị trí #1</p>
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
      ) : homepageWorks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Star size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Chưa có ảnh nào trên trang chủ</p>
          <p className="text-sm mt-1">Bấm &ldquo;Thêm ảnh&rdquo; để chọn works hiển thị</p>
        </div>
      ) : (
        <div className="space-y-2">
          {homepageWorks.map((work, idx) => (
            <div
              key={work.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center gap-4 bg-white rounded-xl border p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing ${
                idx === 0 ? "border-amber-300 bg-amber-50/50 ring-1 ring-amber-200" : "border-gray-200"
              } ${
                dragOverIdx === idx && dragIdx !== idx
                  ? "border-blue-400 ring-2 ring-blue-200 bg-blue-50/50"
                  : ""
              } ${
                dragIdx === idx ? "opacity-40 scale-[0.98]" : ""
              }`}
            >
              {/* Drag handle */}
              <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0">
                <GripVertical size={20} />
              </div>

              {/* Position badge */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                idx === 0 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {idx + 1}
              </div>

              {/* Thumbnail */}
              <img
                src={work.image}
                alt={work.title}
                className="w-20 h-14 object-cover rounded-lg shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{work.title}</p>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {typeMap[work.type || "still"] || work.type}
                </span>
                {idx === 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2 font-medium">
                    ★ Hero
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Swap button */}
                <button
                  onClick={() => setSwapTarget({ work, index: idx })}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Thay thế ảnh khác"
                >
                  <ArrowLeftRight size={16} />
                </button>

                {/* Move buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Di chuyển lên"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === homepageWorks.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Di chuyển xuống"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromHomepage(work)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Bỏ khỏi trang chủ"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Picker modal (Add) ─── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPicker(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chọn ảnh thêm vào trang chủ</h3>
              <button onClick={() => setShowPicker(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-3 border-b">
              <input
                type="text"
                placeholder="Tìm kiếm work..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {availableWorks.length === 0 ? (
                <p className="text-center py-8 text-gray-400">Không tìm thấy work nào</p>
              ) : (
                availableWorks.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      addToHomepage(work);
                    }}
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-16 h-11 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{work.title}</p>
                      <span className="text-xs text-gray-500">{typeMap[work.type || "still"] || work.type}</span>
                    </div>
                    <Plus size={18} className="text-blue-500 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Swap modal (Replace) ─── */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSwapTarget(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Thay thế ảnh</h3>
                <button onClick={() => setSwapTarget(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              {/* Current image being replaced */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <img
                  src={swapTarget.work.image}
                  alt={swapTarget.work.title}
                  className="w-20 h-14 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-600 font-medium mb-0.5">{`Đang thay thế (vị trí #${swapTarget.index + 1})`}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{swapTarget.work.title}</p>
                </div>
                <ArrowLeftRight size={20} className="text-amber-500 shrink-0" />
              </div>
            </div>

            <div className="px-6 py-3 border-b">
              <input
                type="text"
                placeholder="Tìm kiếm work để thay thế..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {availableWorks.length === 0 ? (
                <p className="text-center py-8 text-gray-400">Không tìm thấy work nào</p>
              ) : (
                availableWorks.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group"
                    onClick={() => swapWork(swapTarget.work, work)}
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-16 h-11 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{work.title}</p>
                      <span className="text-xs text-gray-500">{typeMap[work.type || "still"] || work.type}</span>
                    </div>
                    <Check size={18} className="text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
