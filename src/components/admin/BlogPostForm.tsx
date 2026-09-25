"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { slugify, formatDate } from "@/lib/utils";
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Loader2, X, Calendar, Clock, Send, Eye, CheckCircle2, AlertCircle, Upload, Film } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import RichEditor from "@/components/admin/RichEditor";
import MediaEmbedPreview from "@/components/admin/MediaEmbedPreview";

function toDateTimeLocalValue(isoOrDate?: string | Date | null): string {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const YYYY = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const DD = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
  } catch {
    return "";
  }
}

interface AdditionalImageItem {
  image: string;
  caption?: string;
}

interface Section {
  type: "checkcam" | "stage" | "insight" | "comparison";
  num: string;
  eyebrow: string;
  eyebrowBadge: string;
  title: string;
  body: string[];
  image: string;
  mediaEmbedUrl?: string;
  reverse: boolean;
  caption: string;
  additionalImages: (string | AdditionalImageItem)[];
  additionalImageCaptions?: string[];
  tags: { label: string; ok: string[]; ng: string[] };
  grid: { label: string; image: string }[];
}

const emptySection = (): Section => ({
  type: "stage",
  num: "01",
  eyebrow: "",
  eyebrowBadge: "",
  title: "",
  body: [""],
  image: "",
  mediaEmbedUrl: "",
  reverse: false,
  caption: "",
  additionalImages: [],
  tags: { label: "", ok: [], ng: [] },
  grid: [],
});

interface BlogPostData {
  id?: string;
  slug: string;
  category: string;
  eyebrow: string;
  title: string;
  titleJp: string;
  subtitle: string;
  heroImage: string;
  introDropcap: string;
  introPullquote: string;
  sections: string;
  comparisonBefore: string;
  comparisonAfter: string;
  insightHeading: string;
  insightBody: string;
  excerpt: string;
  coverImage: string;
  coverOrientation?: string;
  author: string;
  authorRole: string;
  readTime: number;
  publishedAt?: string;
  isPublished: boolean;
  isFeatured: boolean;
  locale: string;
}

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const cardCls = "bg-white border border-gray-100 rounded-xl p-5 shadow-sm";

export default function BlogPostForm({ initial }: { initial?: BlogPostData }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<BlogPostData>({
    slug: initial?.slug || "",
    category: initial?.category || "",
    eyebrow: initial?.eyebrow || "",
    title: initial?.title || "",
    titleJp: initial?.titleJp || "",
    subtitle: initial?.subtitle || "",
    heroImage: initial?.heroImage || "",
    introDropcap: initial?.introDropcap || "",
    introPullquote: initial?.introPullquote || "",
    sections: initial?.sections || "[]",
    comparisonBefore: initial?.comparisonBefore || "",
    comparisonAfter: initial?.comparisonAfter || "",
    insightHeading: initial?.insightHeading || "",
    insightBody: initial?.insightBody || "",
    excerpt: initial?.excerpt || "",
    coverImage: initial?.coverImage || "",
    coverOrientation: initial?.coverOrientation || "landscape",
    author: initial?.author || "",
    authorRole: initial?.authorRole || "",
    readTime: initial?.readTime || 5,
    publishedAt: initial?.publishedAt ? new Date(initial.publishedAt).toISOString() : new Date().toISOString(),
    isPublished: initial?.isPublished || false,
    isFeatured: initial?.isFeatured || false,
    locale: initial?.locale || "ja",
  });

  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const parsed = JSON.parse(initial?.sections || "[]");
      // Ensure additionalImages array exists on each section
      return parsed.map((s: Section) => ({ ...emptySection(), ...s, additionalImages: s.additionalImages || [] }));
    } catch { return []; }
  });
  const [saving, setSaving] = useState(false);
  const [savingAction, setSavingAction] = useState<"draft" | "publish" | "schedule" | "save" | null>(null);
  const [uploadingVrIndex, setUploadingVrIndex] = useState<number | null>(null);
  const [uploadVrProgress, setUploadVrProgress] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleInput, setScheduleInput] = useState<string>(() => {
    const d = initial?.publishedAt && new Date(initial.publishedAt).getTime() > Date.now()
      ? new Date(initial.publishedAt)
      : new Date(Date.now() + 3600 * 1000);
    return toDateTimeLocalValue(d);
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug || "",
        category: initial.category || "",
        eyebrow: initial.eyebrow || "",
        title: initial.title || "",
        titleJp: initial.titleJp || "",
        subtitle: initial.subtitle || "",
        heroImage: initial.heroImage || "",
        introDropcap: initial.introDropcap || "",
        introPullquote: initial.introPullquote || "",
        sections: initial.sections || "[]",
        comparisonBefore: initial.comparisonBefore || "",
        comparisonAfter: initial.comparisonAfter || "",
        insightHeading: initial.insightHeading || "",
        insightBody: initial.insightBody || "",
        excerpt: initial.excerpt || "",
        coverImage: initial.coverImage || "",
        coverOrientation: initial.coverOrientation || "landscape",
        author: initial.author || "",
        authorRole: initial.authorRole || "",
        readTime: initial.readTime || 5,
        publishedAt: initial.publishedAt ? new Date(initial.publishedAt).toISOString() : new Date().toISOString(),
        isPublished: initial.isPublished || false,
        isFeatured: initial.isFeatured || false,
        locale: initial.locale || "ja",
      });
      const d = initial.publishedAt && new Date(initial.publishedAt).getTime() > Date.now()
        ? new Date(initial.publishedAt)
        : new Date(Date.now() + 3600 * 1000);
      setScheduleInput(toDateTimeLocalValue(d));
      try {
        const parsed = JSON.parse(initial.sections || "[]");
        setSections(parsed.map((s: Section) => ({ ...emptySection(), ...s, additionalImages: s.additionalImages || [] })));
      } catch {
        // ignore
      }
    }
  }, [initial]);

  const [categories, setCategories] = useState<{ id: string; slug: string; nameJa: string; nameEn: string }[]>([]);

  // Fetch blog categories
  useEffect(() => {
    fetch("/api/blog-categories").then((r) => r.json()).then((d) => setCategories(d.data || []));
  }, []);

  const set = (key: keyof BlogPostData, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleTitleBlur = () => {
    if (!form.slug && form.title) set("slug", slugify(form.title.replace(/<[^>]*>/g, "")));
  };

  // Section management
  const addSection = () => setSections((s) => [...s, emptySection()]);
  const insertSectionAfter = (i: number) => {
    setSections((s) => {
      const arr = [...s];
      arr.splice(i + 1, 0, emptySection());
      return arr;
    });
  };
  const removeSection = (i: number) => setSections((s) => s.filter((_, j) => j !== i));
  const moveSection = (i: number, dir: -1 | 1) => {
    setSections((s) => {
      const arr = [...s];
      const ni = i + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return arr;
    });
  };
  const updateSection = (i: number, key: keyof Section, val: unknown) => {
    setSections((s) => s.map((sec, j) => j === i ? { ...sec, [key]: val } : sec));
  };
  const updateBody = (si: number, bi: number, val: string) => {
    setSections((s) => s.map((sec, j) => {
      if (j !== si) return sec;
      const body = [...sec.body];
      body[bi] = val;
      return { ...sec, body };
    }));
  };
  const addBodyParagraph = (si: number) => {
    setSections((s) => s.map((sec, j) => j === si ? { ...sec, body: [...sec.body, ""] } : sec));
  };
  const removeBodyParagraph = (si: number, bi: number) => {
    setSections((s) => s.map((sec, j) => {
      if (j !== si || sec.body.length <= 1) return sec;
      return { ...sec, body: sec.body.filter((_, k) => k !== bi) };
    }));
  };

  const handleUploadVrVideo = (si: number, file: File) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      toast("Chỉ chấp nhận video MP4, WebM, MOV", "error");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      toast("Video quá lớn (tối đa 200MB)", "error");
      return;
    }
    setUploadingVrIndex(si);
    setUploadVrProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setUploadVrProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      setUploadingVrIndex(null);
      setUploadVrProgress(0);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.url) {
          updateSection(si, "mediaEmbedUrl", data.url);
          toast("Upload video thành công!", "success");
        } else {
          toast(data.error || "Upload video thất bại", "error");
        }
      } catch { toast("Upload video thất bại", "error"); }
    };
    xhr.onerror = () => {
      setUploadingVrIndex(null);
      setUploadVrProgress(0);
      toast("Có lỗi xảy ra khi upload video", "error");
    };
    xhr.open("POST", "/api/upload-video");
    xhr.send(fd);
  };

  // Additional images management
  const addAdditionalImage = (si: number, url: string) => {
    setSections((s) =>
      s.map((sec, j) =>
        j === si
          ? {
            ...sec,
            additionalImages: [
              ...(sec.additionalImages || []),
              { image: url, caption: "" },
            ],
          }
          : sec
      )
    );
  };

  const updateAdditionalImageCaption = (si: number, imgIdx: number, caption: string) => {
    setSections((s) =>
      s.map((sec, j) => {
        if (j !== si) return sec;
        const current = [...(sec.additionalImages || [])];
        const item = current[imgIdx];
        if (typeof item === "string") {
          current[imgIdx] = { image: item, caption };
        } else {
          current[imgIdx] = { ...item, caption };
        }
        return { ...sec, additionalImages: current };
      })
    );
  };

  const removeAdditionalImage = (si: number, imgIdx: number) => {
    setSections((s) =>
      s.map((sec, j) => {
        if (j !== si) return sec;
        return {
          ...sec,
          additionalImages: (sec.additionalImages || []).filter((_, k) => k !== imgIdx),
        };
      })
    );
  };

  const handleSave = async (options?: {
    isPublished?: boolean;
    publishedAt?: string;
    actionType?: "draft" | "publish" | "schedule" | "save";
  }) => {
    if (!form.title.trim()) { toast("Vui lòng nhập tiêu đề", "error"); return; }
    if (!form.slug.trim()) { toast("Vui lòng nhập slug", "error"); return; }

    const action = options?.actionType || "save";
    setSaving(true);
    setSavingAction(action);

    let finalCoverImage = form.coverImage;
    // If heroImage was cleared and coverImage was matching the initial hero/cover, clear coverImage too
    if (!form.heroImage && (form.coverImage === initial?.heroImage || form.coverImage === initial?.coverImage)) {
      finalCoverImage = "";
    } else if (!finalCoverImage && form.heroImage) {
      finalCoverImage = form.heroImage;
    }

    const nextIsPublished = options?.isPublished !== undefined ? options.isPublished : form.isPublished;
    const nextPublishedAt = options?.publishedAt !== undefined ? options.publishedAt : (form.publishedAt || new Date().toISOString());

    const payload = {
      ...form,
      isPublished: nextIsPublished,
      publishedAt: nextPublishedAt,
      heroImage: form.heroImage || "",
      coverImage: finalCoverImage || "",
      sections: JSON.stringify(sections),
      readTime: Number(form.readTime) || 5,
    };
    const url = isEdit ? `/api/blog-posts/${initial!.id}` : "/api/blog-posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const errMsg = Array.isArray(json.error)
          ? json.error.map((e: { path?: string[]; message?: string }) => `${(e.path || []).join(".")}: ${e.message}`).join(", ")
          : json.error || "Lỗi không xác định";
        toast(`Lỗi: ${errMsg}`, "error");
        setSaving(false);
        setSavingAction(null);
        return;
      }

      setForm((prev) => ({
        ...prev,
        isPublished: nextIsPublished,
        publishedAt: nextPublishedAt,
      }));
      setScheduleModalOpen(false);

      if (action === "draft" || !nextIsPublished) {
        toast("Đã lưu bản nháp thành công!", "success");
      } else {
        const isScheduled = new Date(nextPublishedAt).getTime() > Date.now();
        if (isScheduled) {
          const dateStr = formatDate(new Date(nextPublishedAt), "HH:mm dd/MM/yyyy");
          toast(`Đã lên lịch đăng lúc ${dateStr}!`, "success");
        } else {
          toast(isEdit ? "Đã lưu thay đổi!" : "Đã xuất bản bài viết thành công!", "success");
        }
      }

      if (!isEdit) router.push(`/admin/blog-posts/${json.data.id}`);
    } catch {
      toast("Lỗi kết nối server", "error");
    }
    setSaving(false);
    setSavingAction(null);
  };

  const confirmSchedule = () => {
    if (!scheduleInput) {
      toast("Vui lòng chọn thời gian lên lịch", "error");
      return;
    }
    const d = new Date(scheduleInput);
    if (isNaN(d.getTime())) {
      toast("Thời gian không hợp lệ", "error");
      return;
    }
    if (d.getTime() <= Date.now()) {
      toast("Thời gian lên lịch phải lớn hơn thời điểm hiện tại", "error");
      return;
    }
    handleSave({
      isPublished: true,
      publishedAt: d.toISOString(),
      actionType: "schedule",
    });
  };

  const setQuickSchedule = (hoursAhead: number) => {
    const d = new Date(Date.now() + hoursAhead * 3600 * 1000);
    setScheduleInput(toDateTimeLocalValue(d));
  };

  const setTomorrowMorning = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    setScheduleInput(toDateTimeLocalValue(d));
  };

  const setNextDaysMorning = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(9, 0, 0, 0);
    setScheduleInput(toDateTimeLocalValue(d));
  };

  const isCurrentlyScheduled = form.isPublished && new Date(form.publishedAt || "").getTime() > Date.now();
  const isCurrentlyPublished = form.isPublished && new Date(form.publishedAt || "").getTime() <= Date.now();

  return (
    <div className="space-y-6">
      {/* Top Header Actions via Portal */}
      {mounted && typeof document !== "undefined" && document.getElementById("admin-header-actions") &&
        createPortal(
          <div className="flex items-center gap-2">
            {/* Preview link */}
            {form.slug && (
              <a
                href={`/${form.locale || "ja"}/blogs/${form.slug}?preview=admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 transition-colors shadow-xs"
                title="Xem trước bài viết trên web"
              >
                <Eye size={14} className="text-gray-500" />
                <span>Xem trước</span>
              </a>
            )}

            {/* Lưu nháp */}
            <button
              type="button"
              onClick={() => handleSave({ isPublished: false, actionType: "draft" })}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors shadow-xs cursor-pointer ${
                !form.isPublished
                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              title="Lưu dưới dạng bản nháp (không công khai)"
            >
              {saving && savingAction === "draft" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu nháp
            </button>

            {/* Lên lịch đăng */}
            <button
              type="button"
              onClick={() => {
                const initialSchedule = isCurrentlyScheduled
                  ? new Date(form.publishedAt!)
                  : new Date(Date.now() + 3600 * 1000);
                setScheduleInput(toDateTimeLocalValue(initialSchedule));
                setScheduleModalOpen(true);
              }}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors shadow-xs cursor-pointer ${
                isCurrentlyScheduled
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
              title="Lên lịch xuất bản tự động"
            >
              {saving && savingAction === "schedule" ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
              {isCurrentlyScheduled ? "Đổi lịch đăng" : "Lên lịch..."}
            </button>

            {/* Nếu đang chỉnh sửa bài đã publish hoặc đã lên lịch -> có nút Lưu thay đổi */}
            {isEdit && (form.isPublished || isCurrentlyScheduled) && (
              <button
                type="button"
                onClick={() => handleSave({ actionType: "save" })}
                disabled={saving}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 transition-colors shadow-xs cursor-pointer"
                title="Lưu các nội dung vừa chỉnh sửa mà không đổi ngày đăng"
              >
                {saving && savingAction === "save" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Lưu thay đổi
              </button>
            )}

            {/* Đăng ngay */}
            <button
              type="button"
              onClick={() => handleSave({ isPublished: true, publishedAt: new Date().toISOString(), actionType: "publish" })}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              title="Xuất bản hiển thị ngay lập tức"
            >
              {saving && savingAction === "publish" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isCurrentlyPublished ? "Cập nhật & Đăng ngay" : "Đăng ngay"}
            </button>
          </div>,
          document.getElementById("admin-header-actions")!
        )
      }

      {/* Hero */}
      <div className={cardCls}>
        <h3 className="text-sm font-bold text-gray-700 mb-4">🎨 Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Tiêu đề (hỗ trợ &lt;br&gt;)</label>
            <textarea value={form.title} onChange={(e) => set("title", e.target.value)} onBlur={handleTitleBlur} className={inputCls} rows={2} placeholder="Mastering the Art of Architectural CG" />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              <option value="">— Chọn danh mục —</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.nameJa || c.nameEn} ({c.slug})</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} className={inputCls} placeholder="Process Case Study · 2026" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Subtitle</label>
            <textarea value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Hero Image</label>
            <ImageUpload
              value={form.heroImage}
              onChange={(v) => {
                setForm((prev) => {
                  const shouldSyncCover =
                    !prev.coverImage ||
                    prev.coverImage === prev.heroImage ||
                    prev.coverImage === initial?.heroImage ||
                    prev.coverImage === initial?.coverImage;
                  return {
                    ...prev,
                    heroImage: v,
                    ...(shouldSyncCover ? { coverImage: v } : {}),
                  };
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className={cardCls}>
        <h3 className="text-sm font-bold text-gray-700 mb-4">📖 Intro Section</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Dropcap Paragraph</label>
            <RichEditor value={form.introDropcap} onChange={(v) => set("introDropcap", v)} />
          </div>
          <div>
            <label className={labelCls}>Pullquote</label>
            <textarea value={form.introPullquote} onChange={(e) => set("introPullquote", e.target.value)} className={inputCls} rows={3} />
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className={cardCls}>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700">📑 Content Sections ({sections.length})</h3>
        </div>

        <div className="space-y-4">
          {sections.map((sec, si) => (
            <div key={si} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <select
                    value={sec.type}
                    onChange={(e) => updateSection(si, "type", e.target.value)}
                    className="text-sm border border-gray-200 rounded px-2 py-1 bg-white font-medium text-gray-700"
                  >
                    <option value="stage">Stage (Nội dung + Ảnh)</option>
                    <option value="checkcam">Checkcam (Nội dung + Điểm kiểm tra)</option>
                    <option value="insight">Insight (Khối phân tích chuyên sâu)</option>
                    <option value="comparison">Comparison (So sánh Trước/Sau)</option>
                  </select>
                  <span className="text-xs text-gray-400">Section {si + 1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertSectionAfter(si)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md border border-blue-100 transition-colors font-medium"
                    title="Chèn Section mới ngay dưới đây"
                  >
                    <Plus size={12} /> Chèn bên dưới
                  </button>
                  <button type="button" onClick={() => moveSection(si, -1)} className="p-1 text-gray-400 hover:text-gray-600" title="Di chuyển lên"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveSection(si, 1)} className="p-1 text-gray-400 hover:text-gray-600" title="Di chuyển xuống"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => removeSection(si)} className="p-1 text-red-400 hover:text-red-600" title="Xóa"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Num</label>
                  <input value={sec.num} onChange={(e) => updateSection(si, "num", e.target.value)} className={inputCls} placeholder="01" />
                </div>
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input value={sec.eyebrow} onChange={(e) => updateSection(si, "eyebrow", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Eyebrow Badge</label>
                  <input value={sec.eyebrowBadge} onChange={(e) => updateSection(si, "eyebrowBadge", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="mt-3">
                <label className={labelCls}>Title (hỗ trợ &lt;br&gt;)</label>
                <input value={sec.title} onChange={(e) => updateSection(si, "title", e.target.value)} className={inputCls} />
              </div>

              {/* Body paragraphs — Rich text editor */}
              <div className="mt-3">
                <label className={labelCls}>Body Paragraphs</label>
                {sec.body.map((p, bi) => (
                  <div key={bi} className="mb-3 relative">
                    <RichEditor value={p} onChange={(v) => updateBody(si, bi, v)} />
                    {sec.body.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBodyParagraph(si, bi)}
                        className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 hover:bg-red-200"
                        title="Xóa paragraph"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addBodyParagraph(si)} className="text-xs text-blue-500 hover:text-blue-600">+ Thêm paragraph</button>
              </div>

              {/* Media Visual: VR360 / AR / Video embed or Static Image */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                <label className={labelCls}>
                  🖼️ Visual Media: Ảnh Section hoặc Link VR360 / AR / Video Embed
                </label>

                {/* VR360 Embed Input Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>🌐 Link VR360 / AR / Video Embed (Kuula, Matterport, YouTube, Sketchfab...)</span>
                    </label>
                    {sec.mediaEmbedUrl && (
                      <button
                        type="button"
                        onClick={() => updateSection(si, "mediaEmbedUrl", "")}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Xóa link VR
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={sec.mediaEmbedUrl || ""}
                      onChange={(e) => updateSection(si, "mediaEmbedUrl", e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-mono"
                      placeholder="VD: https://kuula.co/share/... hoặc https://my.matterport.com/show/?m=... hoặc upload video"
                    />
                    <label
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-md text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                        uploadingVrIndex === si
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-wait"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-purple-400 hover:text-purple-600 shadow-2xs"
                      }`}
                      title="Upload video từ máy tính"
                    >
                      {uploadingVrIndex === si ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-purple-500" />
                          <span>{uploadVrProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Film size={13} className="text-purple-600" />
                          <span>Upload video từ máy tính</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        disabled={uploadingVrIndex === si}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadVrVideo(si, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {uploadingVrIndex === si && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Đang upload video...</span>
                        <span className="font-mono font-semibold">{uploadVrProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadVrProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {sec.mediaEmbedUrl && (
                    <div className="mt-2">
                      <p className="text-[11px] text-slate-500 mb-1">Preview tương tác VR360:</p>
                      <MediaEmbedPreview url={sec.mediaEmbedUrl} />
                    </div>
                  )}
                </div>

                {/* Static Image upload */}
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">
                    Ảnh Section {sec.mediaEmbedUrl ? "(Ảnh dự phòng nếu không tải được VR)" : (sec.type === "stage" ? <span className="text-red-500">*</span> : "")}
                  </label>
                  <ImageUpload value={sec.image} onChange={(v) => updateSection(si, "image", v)} allowVideo={false} />
                </div>
              </div>

              {/* Additional images and videos with per-item caption */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <label className={labelCls}>📸 Ảnh &amp; Video bổ sung &amp; Caption riêng từng mục (Additional Media)</label>

                {sec.additionalImages && sec.additionalImages.length > 0 && (
                  <div className="space-y-3 mb-3">
                    {sec.additionalImages.map((item, imgIdx) => {
                      const mediaSrc = typeof item === "string" ? item : item.image;
                      const mediaCap = typeof item === "string" ? (sec.additionalImageCaptions?.[imgIdx] || "") : (item.caption || "");
                      const isVid = /\.(mp4|webm|mov)(\?.*)?$/i.test(mediaSrc);

                      return (
                        <div key={imgIdx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
                            {isVid ? (
                              <>
                                <video src={mediaSrc} className="max-w-full max-h-full object-contain" muted />
                                <span className="absolute bottom-1 right-1 bg-purple-600 text-white text-[9px] font-bold px-1 rounded">VID</span>
                              </>
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={mediaSrc} alt="" className="max-w-full max-h-full object-contain" />
                            )}
                          </div>

                          <div className="flex-1">
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">
                              Caption cho {isVid ? "video" : "ảnh"} bổ sung {imgIdx + 1}
                            </label>
                            <input
                              value={mediaCap}
                              onChange={(e) => updateAdditionalImageCaption(si, imgIdx, e.target.value)}
                              placeholder={`Nhập chú thích / caption cho ${isVid ? "video" : "ảnh"} này...`}
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(si, imgIdx)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa mục này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <ImageUpload
                  value=""
                  onChange={(v) => { if (v) addAdditionalImage(si, v); }}
                  label="+ Thêm ảnh hoặc video bổ sung mới"
                  allowVideo={true}
                />
              </div>

              {sec.type === "stage" && (
                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" checked={sec.reverse} onChange={(e) => updateSection(si, "reverse", e.target.checked)} id={`rev-${si}`} />
                  <label htmlFor={`rev-${si}`} className="text-sm text-gray-600">Reverse layout (ảnh bên phải)</label>
                </div>
              )}

              {sec.type === "stage" && (
                <div className="mt-3">
                  <label className={labelCls}>Caption ảnh chính (Main Image Caption)</label>
                  <input value={sec.caption} onChange={(e) => updateSection(si, "caption", e.target.value)} className={inputCls} placeholder="Caption chú thích cho ảnh chính ở trên..." />
                </div>
              )}
            </div>
          ))}

          {/* Bottom Full-width Add Section Button */}
          <button
            type="button"
            onClick={addSection}
            className="w-full py-3.5 border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl bg-blue-50/40 hover:bg-blue-50/80 text-blue-600 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-sm cursor-pointer"
          >
            <Plus size={16} />  Thêm Section {sections.length + 1}
          </button>
        </div>
      </div>

      {/* Insight */}
      <div className={cardCls}>
        <h3 className="text-sm font-bold text-gray-700 mb-4">💡 Insight Block</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Heading</label>
            <textarea value={form.insightHeading} onChange={(e) => set("insightHeading", e.target.value)} className={inputCls} rows={2} />
          </div>
          <div>
            <label className={labelCls}>Body</label>
            <RichEditor value={form.insightBody} onChange={(v) => set("insightBody", v)} />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className={cardCls}>
        <h3 className="text-sm font-bold text-gray-700 mb-4">⚙️ Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Excerpt (mô tả ngắn cho card)</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} rows={2} />
          </div>
          <div>
            <label className={labelCls}>Cover Image (ảnh card)</label>
            <ImageUpload value={form.coverImage} onChange={(v) => set("coverImage", v)} />
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Author</label>
              <input value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Author Role</label>
              <input value={form.authorRole} onChange={(e) => set("authorRole", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Read Time (phút)</label>
              <input type="number" value={form.readTime} onChange={(e) => set("readTime", parseInt(e.target.value) || 5)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Định dạng ảnh bìa (Cover Orientation)</label>
            <select
              value={form.coverOrientation || "landscape"}
              onChange={(e) => set("coverOrientation", e.target.value)}
              className={inputCls}
            >
              <option value="landscape">🖼️ Ảnh Ngang (Landscape - 16:9 / 4:3)</option>
              <option value="portrait">📱 Ảnh Dọc (Portrait - 3:4 / 9:16)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Locale</label>
            <select value={form.locale} onChange={(e) => set("locale", e.target.value)} className={inputCls}>
              <option value="ja">日本語 (JA)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
          {/* Status & Publication Controls */}
          <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
            <label className={labelCls}>Trạng thái xuất bản &amp; Lịch hiển thị (Publication Status)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Draft */}
              <button
                type="button"
                onClick={() => set("isPublished", false)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  !form.isPublished
                    ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Bản nháp (Draft)
                </div>
                <p className="text-xs text-gray-500 mt-1">Chỉ lưu trữ nội bộ, không hiển thị cho khách truy cập website.</p>
              </button>

              {/* Publish Now */}
              <button
                type="button"
                onClick={() => {
                  set("isPublished", true);
                  set("publishedAt", new Date().toISOString());
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  form.isPublished && new Date(form.publishedAt || "").getTime() <= Date.now()
                    ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Đăng ngay (Published)
                </div>
                <p className="text-xs text-gray-500 mt-1">Hiển thị công khai ngay lập tức cho tất cả khách truy cập.</p>
              </button>

              {/* Schedule */}
              <button
                type="button"
                onClick={() => {
                  set("isPublished", true);
                  const isAlreadyFuture = form.publishedAt && new Date(form.publishedAt).getTime() > Date.now();
                  if (!isAlreadyFuture) {
                    const nextHour = new Date(Date.now() + 3600 * 1000);
                    set("publishedAt", nextHour.toISOString());
                    setScheduleInput(toDateTimeLocalValue(nextHour));
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  form.isPublished && new Date(form.publishedAt || "").getTime() > Date.now()
                    ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  Lên lịch (Scheduled)
                </div>
                <p className="text-xs text-gray-500 mt-1">Tự động hiển thị công khai khi tới ngày giờ đã chọn.</p>
              </button>
            </div>

            {/* Scheduled Datetime Picker */}
            {form.isPublished && (
              <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-600" />
                    Thời gian xuất bản bài viết
                  </label>
                  <span className="text-xs font-medium">
                    {new Date(form.publishedAt || "").getTime() > Date.now() ? (
                      <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full font-mono">
                        🟣 Lên lịch: {formatDate(new Date(form.publishedAt || ""), "HH:mm dd/MM/yyyy")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-mono">
                        🟢 Đã xuất bản: {formatDate(new Date(form.publishedAt || ""), "HH:mm dd/MM/yyyy")}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocalValue(form.publishedAt)}
                    onChange={(e) => {
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        set("publishedAt", d.toISOString());
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 font-mono"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => set("publishedAt", new Date().toISOString())}
                      className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Bây giờ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(Date.now() + 3600 * 1000);
                        set("publishedAt", d.toISOString());
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 cursor-pointer transition-colors"
                    >
                      +1 giờ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(Date.now() + 3 * 3600 * 1000);
                        set("publishedAt", d.toISOString());
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 cursor-pointer transition-colors"
                    >
                      +3 giờ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        d.setHours(9, 0, 0, 0);
                        set("publishedAt", d.toISOString());
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 cursor-pointer transition-colors"
                    >
                      Ngày mai 09:00
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 2);
                        d.setHours(9, 0, 0, 0);
                        set("publishedAt", d.toISOString());
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 cursor-pointer transition-colors"
                    >
                      +2 ngày 09:00
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              ★ Đánh dấu là bài viết nổi bật (Featured — xuất hiện ở vị trí ưu tiên)
            </label>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Lên lịch xuất bản bài viết</h3>
                  <p className="text-xs text-gray-500">Tự động hiển thị công khai bài viết theo lịch</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className={labelCls}>Chọn ngày &amp; giờ công khai (Giờ Việt Nam / Thiết bị)</label>
              <input
                type="datetime-local"
                value={scheduleInput}
                onChange={(e) => setScheduleInput(e.target.value)}
                min={toDateTimeLocalValue(new Date())}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-gray-400 font-medium">Gợi ý nhanh:</span>
                <button
                  type="button"
                  onClick={() => setQuickSchedule(1)}
                  className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  +1 giờ
                </button>
                <button
                  type="button"
                  onClick={() => setQuickSchedule(3)}
                  className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  +3 giờ
                </button>
                <button
                  type="button"
                  onClick={setTomorrowMorning}
                  className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  Ngày mai 09:00
                </button>
                <button
                  type="button"
                  onClick={() => setNextDaysMorning(2)}
                  className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  +2 ngày 09:00
                </button>
              </div>
            </div>

            {scheduleInput && !isNaN(new Date(scheduleInput).getTime()) && (
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-800 flex items-start gap-2.5">
                <Clock size={16} className="text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Thời điểm xuất bản:</p>
                  <p className="mt-0.5 font-medium">{formatDate(new Date(scheduleInput), "HH:mm, 'ngày' dd/MM/yyyy")}</p>
                  <p className="text-[11px] text-purple-600/80 mt-1">
                    {new Date(scheduleInput).getTime() > Date.now()
                      ? "Bài viết sẽ chỉ hiển thị với admin cho đến thời điểm này."
                      : "⚠️ Thời gian này đã qua. Bài viết sẽ xuất bản ngay lập tức."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmSchedule}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {saving && savingAction === "schedule" ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                Xác nhận lên lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
