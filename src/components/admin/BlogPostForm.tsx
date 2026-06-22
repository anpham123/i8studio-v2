"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import RichEditor from "@/components/admin/RichEditor";

interface Section {
  type: "checkcam" | "stage" | "insight" | "comparison";
  num: string;
  eyebrow: string;
  eyebrowBadge: string;
  title: string;
  body: string[];
  image: string;
  reverse: boolean;
  caption: string;
  additionalImages: string[];
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
  author: string;
  authorRole: string;
  readTime: number;
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
    author: initial?.author || "",
    authorRole: initial?.authorRole || "",
    readTime: initial?.readTime || 5,
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

  const set = (key: keyof BlogPostData, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleTitleBlur = () => {
    if (!form.slug && form.title) set("slug", slugify(form.title.replace(/<[^>]*>/g, "")));
  };

  // Section management
  const addSection = () => setSections((s) => [...s, emptySection()]);
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

  // Additional images management
  const addAdditionalImage = (si: number, url: string) => {
    setSections((s) => s.map((sec, j) => j === si ? { ...sec, additionalImages: [...(sec.additionalImages || []), url] } : sec));
  };
  const removeAdditionalImage = (si: number, imgIdx: number) => {
    setSections((s) => s.map((sec, j) => {
      if (j !== si) return sec;
      return { ...sec, additionalImages: (sec.additionalImages || []).filter((_, k) => k !== imgIdx) };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, sections: JSON.stringify(sections) };
    const url = isEdit ? `/api/blog-posts/${initial!.id}` : "/api/blog-posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      toast(isEdit ? "Đã cập nhật" : "Đã tạo", "success");
      if (!isEdit) router.push(`/admin/blog-posts/${json.data.id}`);
    } catch {
      toast("Lỗi khi lưu", "error");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Save bar — sticky at top */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-gray-50 -mx-6 px-6 py-3 border-b border-gray-100 -mt-6 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{isEdit ? "Chỉnh sửa Blog Post" : "Tạo Blog Post mới"}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

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
            <input value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls} placeholder="制作プロセス / ArchViz" />
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
            <ImageUpload value={form.heroImage} onChange={(v) => set("heroImage", v)} />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700">📑 Content Sections ({sections.length})</h3>
          <button onClick={addSection} className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-700">
            <Plus size={14} /> Thêm section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((sec, si) => (
            <div key={si} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <select
                    value={sec.type}
                    onChange={(e) => updateSection(si, "type", e.target.value)}
                    className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                  >
                    <option value="stage">Stage</option>
                    <option value="checkcam">Checkcam</option>
                    <option value="insight">Insight</option>
                    <option value="comparison">Comparison</option>
                  </select>
                  <span className="text-xs text-gray-400">Section {si + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveSection(si, -1)} className="p-1 text-gray-400 hover:text-gray-600" title="Di chuyển lên"><ChevronUp size={14} /></button>
                  <button onClick={() => moveSection(si, 1)} className="p-1 text-gray-400 hover:text-gray-600" title="Di chuyển xuống"><ChevronDown size={14} /></button>
                  <button onClick={() => removeSection(si)} className="p-1 text-red-400 hover:text-red-600" title="Xóa"><Trash2 size={14} /></button>
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
                        onClick={() => removeBodyParagraph(si, bi)}
                        className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 hover:bg-red-200"
                        title="Xóa paragraph"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addBodyParagraph(si)} className="text-xs text-blue-500 hover:text-blue-600">+ Thêm paragraph</button>
              </div>

              {/* Image upload — available for ALL section types */}
              <div className="mt-3">
                <label className={labelCls}>
                  Section Image {sec.type === "stage" && <span className="text-red-500">*</span>}
                </label>
                <ImageUpload value={sec.image} onChange={(v) => updateSection(si, "image", v)} />
              </div>

              {/* Additional images */}
              <div className="mt-3">
                <label className={labelCls}>Ảnh bổ sung (Additional Images)</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {(sec.additionalImages || []).map((img, imgIdx) => (
                    <div key={imgIdx} className="relative w-24 h-20 rounded border border-gray-200 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Additional ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeAdditionalImage(si, imgIdx)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <ImageUpload
                  value=""
                  onChange={(v) => { if (v) addAdditionalImage(si, v); }}
                  label="Thêm ảnh bổ sung"
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
                  <label className={labelCls}>Caption</label>
                  <input value={sec.caption} onChange={(e) => updateSection(si, "caption", e.target.value)} className={inputCls} />
                </div>
              )}
            </div>
          ))}
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
            <label className={labelCls}>Locale</label>
            <select value={form.locale} onChange={(e) => set("locale", e.target.value)} className={inputCls}>
              <option value="ja">日本語 (JA)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
              Featured
            </label>
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
}
