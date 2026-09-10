"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import RichEditor from "@/components/admin/RichEditor";
import { useToast } from "@/components/admin/Toast";
import { Save, Loader2, Plus, X, Trash2, RefreshCw } from "lucide-react";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "milestones", label: "Milestones" },
  { key: "workflow", label: "Workflow" },
] as const;

interface Milestone {
  year?: string;
  yearJa: string;
  yearEn: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  image?: string;
  images?: string[];
}
interface WorkflowStep {
  stepNumber: number;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  image: string;
  images?: string[];
  tags: string;
}

export default function CompanyContentPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "workflow">("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Overview
  const [overview, setOverview] = useState({
    heroImage: "",
    teamImage: "",
    introJa: "", introEn: "",
    staffCount: "80", yearsExperience: "6", clientCount: "200", projectCount: "3000",
  });

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Workflow
  const [workflowHeroImage, setWorkflowHeroImage] = useState("/uploads/workflow-hero.png");
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
        if (sec.section === "milestones") {
          const rawMilestones = Array.isArray(content) ? content : [];
          setMilestones(
            rawMilestones.map((m: any) => ({
              ...m,
              images: Array.isArray(m.images) && m.images.length > 0 ? m.images : m.image ? [m.image] : [],
            }))
          );
        }
        if (sec.section === "workflow") {
          if (Array.isArray(content)) {
            setWorkflow(
              content.map((s: any) => ({
                ...s,
                images: Array.isArray(s.images) && s.images.length > 0 ? s.images : s.image ? [s.image] : [],
              }))
            );
          } else if (content && typeof content === "object") {
            const rawSteps = Array.isArray(content.steps) ? content.steps : [];
            setWorkflow(
              rawSteps.map((s: any) => ({
                ...s,
                images: Array.isArray(s.images) && s.images.length > 0 ? s.images : s.image ? [s.image] : [],
              }))
            );
            if (content.heroImage) setWorkflowHeroImage(content.heroImage);
          }
        }
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
    if (json.data) toast("Đã lưu thành công!", "success"); else toast("Lỗi khi lưu dữ liệu", "error");
  };

  const handleSave = () => {
    if (activeTab === "overview") saveSection("overview", overview);
    if (activeTab === "milestones") {
      const formatted = milestones.map((m) => ({
        ...m,
        image: m.images && m.images.length > 0 ? m.images[0] : m.image || "",
        images: m.images && m.images.length > 0 ? m.images : m.image ? [m.image] : [],
      }));
      saveSection("milestones", formatted);
    }
    if (activeTab === "workflow") {
      saveSection("workflow", {
        heroImage: workflowHeroImage,
        steps: workflow,
      });
    }
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
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Hero & Team Images */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Hình ảnh Hero Section & Đội ngũ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh nền Hero Section (Company Overview)</label>
                  <p className="text-xs text-gray-500 mb-2">Ảnh hiển thị toàn màn hình ở đầu trang Company Overview.</p>
                  <ImageUpload
                    value={overview.heroImage || ""}
                    onChange={(url) => setOverview((o) => ({ ...o, heroImage: url }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh tập thể Đội ngũ (Team Section)</label>
                  <p className="text-xs text-gray-500 mb-2">Ảnh tập thể 80 thành viên i8 Studio.</p>
                  <ImageUpload
                    value={overview.teamImage || ""}
                    onChange={(url) => setOverview((o) => ({ ...o, teamImage: url }))}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Số liệu thống kê (Stats Bar)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Số nhân sự (VD: 80)</label>
                  <input
                    value={overview.staffCount || ""}
                    onChange={(e) => setOverview((o) => ({ ...o, staffCount: e.target.value }))}
                    placeholder="80"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Số năm KN (VD: 6)</label>
                  <input
                    value={overview.yearsExperience || ""}
                    onChange={(e) => setOverview((o) => ({ ...o, yearsExperience: e.target.value }))}
                    placeholder="6"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Khách hàng (VD: 200)</label>
                  <input
                    value={overview.clientCount || ""}
                    onChange={(e) => setOverview((o) => ({ ...o, clientCount: e.target.value }))}
                    placeholder="200"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Dự án hoàn thành (VD: 3000)</label>
                  <input
                    value={overview.projectCount || ""}
                    onChange={(e) => setOverview((o) => ({ ...o, projectCount: e.target.value }))}
                    placeholder="3000"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Philosophy / Message */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Lời ngỏ / Triết lý công ty (Intro Text)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">🇯🇵 Tiếng Nhật (JP)</label>
                  <RichEditor
                    value={overview.introJa || ""}
                    onChange={(val) => setOverview((o) => ({ ...o, introJa: val }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">🇬🇧 Tiếng Anh (EN)</label>
                  <RichEditor
                    value={overview.introEn || ""}
                    onChange={(val) => setOverview((o) => ({ ...o, introEn: val }))}
                  />
                </div>
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
                <button onClick={() => setMilestones((m) => [...m, { yearJa: "", yearEn: "", titleJa: "", titleEn: "", descJa: "", descEn: "", image: "", images: [] }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm</button>
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

                  {/* Multi-image section for Milestone (with 2s Auto Slideshow) */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                          🖼️ Thư viện ảnh mốc này ({ms.images?.length || (ms.image ? 1 : 0)} ảnh)
                        </label>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Tải lên 2-3 ảnh để chạy hiệu ứng tự động đổi ảnh mỗi 2s trên trang Our Journey
                        </p>
                      </div>
                      <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                        ⏱️ Tự động chuyển ảnh 2s
                      </span>
                    </div>

                    {/* Existing images list */}
                    {ms.images && ms.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {ms.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-xs"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100/80 border-b border-gray-200">
                              <span className="text-[11px] font-bold text-gray-700">
                                Ảnh {imgIdx + 1} {imgIdx === 0 && <span className="text-blue-600 font-normal">(Ảnh chính)</span>}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const n = [...milestones];
                                  const curImgs = n[i].images || [];
                                  const updatedImgs = curImgs.filter((_, idx) => idx !== imgIdx);
                                  n[i] = {
                                    ...n[i],
                                    images: updatedImgs,
                                    image: updatedImgs[0] || "",
                                  };
                                  setMilestones(n);
                                }}
                                className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa ảnh này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Thumbnail Preview */}
                            <div className="relative aspect-[4/3] bg-black/5 overflow-hidden flex items-center justify-center p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt=""
                                className="w-full h-full object-contain rounded"
                              />
                            </div>

                            {/* Change Photo Button */}
                            <div className="p-2 border-t border-gray-100 bg-white">
                              <ImageUpload
                                label="🔄 Đổi ảnh này"
                                value=""
                                onChange={(newUrl) => {
                                  if (!newUrl) return;
                                  const n = [...milestones];
                                  const curImgs = [...(n[i].images || [])];
                                  curImgs[imgIdx] = newUrl;
                                  n[i] = {
                                    ...n[i],
                                    images: curImgs,
                                    image: curImgs[0] || "",
                                  };
                                  setMilestones(n);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new photo if fewer than 5 images */}
                    {(ms.images?.length || 0) < 5 && (
                      <div className="pt-2">
                        <ImageUpload
                          label={
                            (ms.images?.length || 0) === 0
                              ? "Tải lên ảnh mốc lịch sử (Ảnh 1)"
                              : `+ Thêm ảnh khác cho mốc ${i + 1} (Ảnh ${(ms.images?.length || 0) + 1})`
                          }
                          value=""
                          onChange={(newUrl) => {
                            if (!newUrl) return;
                            const n = [...milestones];
                            const curImgs = n[i].images ? [...n[i].images!] : n[i].image ? [n[i].image!] : [];
                            const updatedImgs = [...curImgs, newUrl];
                            n[i] = {
                              ...n[i],
                              images: updatedImgs,
                              image: updatedImgs[0] || "",
                            };
                            setMilestones(n);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Workflow Tab ── */}
        {activeTab === "workflow" && (
          <div className="space-y-5">
            {/* Hero Section Banner Image */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    🖼️ Ảnh Banner Đầu Trang (Hero Section)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Tải lên ảnh nền cho phần Hero Section trang Workflow (Nền toàn màn hình hiển thị chữ WORK / FLOW chia 2 nửa ngày - đêm)
                  </p>
                </div>
              </div>
              <ImageUpload
                label="Ảnh Hero Section Workflow"
                value={workflowHeroImage}
                onChange={(url) => {
                  setWorkflowHeroImage(url);
                  saveSection("workflow", {
                    heroImage: url,
                    steps: workflow,
                  });
                }}
              />
            </div>

            {/* Workflow Steps */}
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
                  {/* Multi-image section with Change Photo & Delete & Add Photo */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                          🖼️ Thư viện ảnh bước này ({step.images?.length || (step.image ? 1 : 0)} ảnh)
                        </label>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Tải lên 2-3 ảnh để chạy hiệu ứng tự động đổi ảnh mỗi 3s trên trang người dùng
                        </p>
                      </div>
                      <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                        ⏱️ Tự động chuyển ảnh 3s
                      </span>
                    </div>

                    {/* Existing images list */}
                    {step.images && step.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {step.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-xs"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100/80 border-b border-gray-200">
                              <span className="text-[11px] font-bold text-gray-700">
                                Ảnh {imgIdx + 1} {imgIdx === 0 && <span className="text-blue-600 font-normal">(Ảnh chính)</span>}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const n = [...workflow];
                                  const curImgs = n[i].images || [];
                                  const updatedImgs = curImgs.filter((_, idx) => idx !== imgIdx);
                                  n[i] = {
                                    ...n[i],
                                    images: updatedImgs,
                                    image: updatedImgs[0] || "",
                                  };
                                  setWorkflow(n);
                                }}
                                className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa ảnh này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Thumbnail Preview */}
                            <div className="relative aspect-[4/3] bg-black/5 overflow-hidden flex items-center justify-center p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt=""
                                className="w-full h-full object-contain rounded"
                              />
                            </div>

                            {/* Change Photo Button */}
                            <div className="p-2 border-t border-gray-100 bg-white">
                              <ImageUpload
                                label="🔄 Đổi ảnh này"
                                value=""
                                onChange={(newUrl) => {
                                  if (!newUrl) return;
                                  const n = [...workflow];
                                  const curImgs = [...(n[i].images || [])];
                                  curImgs[imgIdx] = newUrl;
                                  n[i] = {
                                    ...n[i],
                                    images: curImgs,
                                    image: curImgs[0] || "",
                                  };
                                  setWorkflow(n);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new photo if fewer than 5 images */}
                    {(step.images?.length || 0) < 5 && (
                      <div className="pt-2">
                        <ImageUpload
                          label={
                            (step.images?.length || 0) === 0
                              ? "Tải lên ảnh bước (Ảnh 1)"
                              : `+ Thêm ảnh khác cho bước ${step.stepNumber} (Ảnh ${(step.images?.length || 0) + 1})`
                          }
                          value=""
                          onChange={(url) => {
                            if (!url) return;
                            const n = [...workflow];
                            const curImgs = n[i].images || (n[i].image ? [n[i].image] : []);
                            const updatedImgs = [...curImgs, url];
                            n[i] = {
                              ...n[i],
                              images: updatedImgs,
                              image: updatedImgs[0] || "",
                            };
                            setWorkflow(n);
                          }}
                        />
                      </div>
                    )}
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
