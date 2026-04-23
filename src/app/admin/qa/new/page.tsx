"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewQAPage() {
  const [form, setForm] = useState({ question: "", questionJa: "", answer: "", answerJa: "", order: "0" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.question || !form.answer) return toast("Câu hỏi và trả lời không được để trống", "error");
    setSaving(true);
    const res = await fetch("/api/qa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/qa/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm Q&A" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi (EN) *</label><input value={form.question} onChange={(e) => set("question", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi (JA)</label><input value={form.questionJa} onChange={(e) => set("questionJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Trả lời (EN) *</label><textarea value={form.answer} onChange={(e) => set("answer", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Trả lời (JA)</label><textarea value={form.answerJa} onChange={(e) => set("answerJa", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
        </div>
      </div>
    </AdminShell>
  );
}
