"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2, Upload, FileText } from "lucide-react";

export default function EditFlipbookPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/flipbooks/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) { setForm({ ...d.data, order: String(d.data.order) }); setPdfFileName(String(d.data.pdfUrl || "").split("/").pop() || ""); }
      setLoading(false);
    });
  }, [id]);

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") return toast("Chỉ chấp nhận file PDF", "error");
    if (file.size > 50 * 1024 * 1024) return toast("File PDF tối đa 50MB", "error");
    setUploadingPdf(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-pdf", { method: "POST", body: fd });
    const data = await res.json();
    setUploadingPdf(false);
    if (data.url) { set("pdfUrl", data.url); setPdfFileName(file.name); toast("Đã upload PDF", "success"); }
    else toast("Lỗi upload PDF", "error");
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/flipbooks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(String(form.order)) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Flipbook"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Flipbook" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["title","Tiêu đề (EN)"],["titleJa","Tiêu đề (JA)"]].map(([k,l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (EN)</label><textarea value={String(form.description || "")} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (JA)</label><textarea value={String(form.descriptionJa || "")} onChange={(e) => set("descriptionJa", e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div className="flex items-end pb-2.5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={Boolean(form.active)} onChange={(e) => set("active", e.target.checked)} className="rounded" /><span className="text-sm text-gray-700">Hiển thị</span></label></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">File PDF</label>
            {form.pdfUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="text-blue-600 shrink-0" size={20} />
                  <span className="text-sm text-blue-700 truncate flex-1">{pdfFileName || String(form.pdfUrl)}</span>
                  <button onClick={() => pdfInputRef.current?.click()} className="text-xs text-blue-600 hover:underline shrink-0">Thay PDF mới</button>
                </div>
              </div>
            ) : (
              <div onClick={() => pdfInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handlePdfUpload(f); }} className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                {uploadingPdf ? <div className="flex flex-col items-center gap-2 text-blue-600"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /><span className="text-sm">Đang upload...</span></div> : <div className="flex flex-col items-center gap-2 text-gray-400"><Upload size={24} /><span className="text-sm">Kéo thả PDF hoặc click để chọn</span></div>}
              </div>
            )}
            <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh bìa (tùy chọn)" value={String(form.coverImage || "")} onChange={(url) => set("coverImage", url)} />
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa flipbook "${form.title}"?`} onConfirm={async () => { await fetch(`/api/flipbooks/${id}`, { method: "DELETE" }); router.push("/admin/flipbooks"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
