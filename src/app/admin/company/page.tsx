"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Save, Loader2, Plus, X } from "lucide-react";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "milestones", label: "Milestones" },
  { key: "workflow", label: "Workflow" },
] as const;

interface Milestone { year?: string; yearJa: string; yearEn: string; titleJa: string; titleEn: string; descJa: string; descEn: string; image?: string; }
interface WorkflowStep { stepNumber: number; titleJa: string; titleEn: string; descJa: string; descEn: string; image: string; tags: string; }

export default function CompanyContentPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "workflow">("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Overview
  const [overview, setOverview] = useState({
    introJa: "", introEn: "",
    staffCount: "80", yearsExperience: "6", clientCount: "200", projectCount: "3000",
  });

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Workflow
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/company-content");
    const json = await res.json();
    const sections = json.data || [];
    for (const sec of sections) {
      try {
        const content = JSON.parse(sec.contentJson || "{}");
        if (sec.section === "overview") setOverview((o) => ({ ...o, ...content }));
        if (sec.section === "milestones") setMilestones(Array.isArray(content) ? content : []);
        if (sec.section === "workflow") setWorkflow(Array.isArray(content) ? content : []);
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const saveSection = async (section: string, data: unknown) => {
    setSaving(true);
    const res = await fetch(`/api/company-content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentJson: JSON.stringify(data) }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  const handleSave = () => {
    if (activeTab === "overview") saveSection("overview", overview);
    if (activeTab === "milestones") saveSection("milestones", milestones);
    if (activeTab === "workflow") saveSection("workflow", workflow);
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

  if (loading) return <AdminShell title="Company Content"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell
      title="Company Content"
      actions={<button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}
    >
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t.key ? "bg-white border border-b-white border-gray-200 -mb-px text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Giới thiệu</h3>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Intro (JA)</label><textarea value={overview.introJa} onChange={(e) => setOverview((o) => ({ ...o, introJa: e.target.value }))} rows={4} className={inputCls + " resize-none"} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Intro (EN)</label><textarea value={overview.introEn} onChange={(e) => setOverview((o) => ({ ...o, introEn: e.target.value }))} rows={4} className={inputCls + " resize-none"} /></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Số liệu thống kê</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhân sự</label><input type="number" value={overview.staffCount} onChange={(e) => setOverview((o) => ({ ...o, staffCount: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Năm kinh nghiệm</label><input type="number" value={overview.yearsExperience} onChange={(e) => setOverview((o) => ({ ...o, yearsExperience: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Khách hàng</label><input type="number" value={overview.clientCount} onChange={(e) => setOverview((o) => ({ ...o, clientCount: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Dự án</label><input type="number" value={overview.projectCount} onChange={(e) => setOverview((o) => ({ ...o, projectCount: e.target.value }))} className={inputCls} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Milestones Tab ── */}
        {activeTab === "milestones" && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Milestones ({milestones.length})</h3>
                <button onClick={() => setMilestones((m) => [...m, { yearJa: "", yearEn: "", titleJa: "", titleEn: "", descJa: "", descEn: "", image: "" }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm</button>
              </div>
              {milestones.map((ms, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
                  <button onClick={() => setMilestones((m) => m.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                  <p className="text-xs font-semibold text-blue-600 mb-1">Mốc {i + 1}</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">📅 Năm (JP)</label>
                      <input value={ms.yearJa || ms.year || ""} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], yearJa: e.target.value }; setMilestones(n); }} placeholder="VD: 2019年" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">📅 Năm (EN)</label>
                      <input value={ms.yearEn || ms.year || ""} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], yearEn: e.target.value }; setMilestones(n); }} placeholder="VD: 2019" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇯🇵 Tiêu đề (JP)</label>
                      <input value={ms.titleJa} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], titleJa: e.target.value }; setMilestones(n); }} placeholder="基礎を築いた時期" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇬🇧 Tiêu đề (EN)</label>
                      <input value={ms.titleEn} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], titleEn: e.target.value }; setMilestones(n); }} placeholder="The Foundation Period" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇯🇵 Mô tả (JP)</label>
                      <textarea value={ms.descJa} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], descJa: e.target.value }; setMilestones(n); }} placeholder="Nội dung mô tả tiếng Nhật..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇬🇧 Mô tả (EN)</label>
                      <textarea value={ms.descEn} onChange={(e) => { const n = [...milestones]; n[i] = { ...n[i], descEn: e.target.value }; setMilestones(n); }} placeholder="Description in English..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">🖼️ Ảnh minh hoạ mốc lịch sử</label>
                    <ImageUpload
                      label="Tải ảnh mốc lịch sử"
                      value={ms.image || ""}
                      onChange={(url) => {
                        const n = [...milestones];
                        n[i] = { ...n[i], image: url };
                        setMilestones(n);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Workflow Tab ── */}
        {activeTab === "workflow" && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Workflow Steps ({workflow.length})</h3>
                <button onClick={() => setWorkflow((w) => [...w, { stepNumber: w.length + 1, titleJa: "", titleEn: "", descJa: "", descEn: "", image: "", tags: "" }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm bước</button>
              </div>
              {workflow.map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
                  <button onClick={() => setWorkflow((w) => w.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                  <p className="text-xs font-semibold text-blue-600 mb-1">Bước {step.stepNumber}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🔢 Số thứ tự</label>
                      <input type="number" value={step.stepNumber} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], stepNumber: parseInt(e.target.value) || 0 }; setWorkflow(n); }} placeholder="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇯🇵 Tiêu đề (JP)</label>
                      <input value={step.titleJa} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], titleJa: e.target.value }; setWorkflow(n); }} placeholder="ヒアリング・資料共有" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇬🇧 Tiêu đề (EN)</label>
                      <input value={step.titleEn} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], titleEn: e.target.value }; setWorkflow(n); }} placeholder="Consultation & Briefing" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇯🇵 Mô tả (JP)</label>
                      <textarea value={step.descJa} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], descJa: e.target.value }; setWorkflow(n); }} placeholder="Nội dung mô tả tiếng Nhật..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">🇬🇧 Mô tả (EN)</label>
                      <textarea value={step.descEn} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], descEn: e.target.value }; setWorkflow(n); }} placeholder="Description in English..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">🖼️ Ảnh minh hoạ</label>
                    <ImageUpload label="Ảnh bước" value={step.image} onChange={(url) => { const n = [...workflow]; n[i] = { ...n[i], image: url }; setWorkflow(n); }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">🏷️ Tags (phân cách bằng dấu phẩy)</label>
                    <input value={step.tags} onChange={(e) => { const n = [...workflow]; n[i] = { ...n[i], tags: e.target.value }; setWorkflow(n); }} placeholder="VD: 3ds Max, SketchUp, BIM" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
