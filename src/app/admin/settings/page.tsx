"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Save, Building2, Phone, Globe } from "lucide-react";

interface SettingGroup {
  title: string;
  icon: React.ElementType;
  fields: { key: string; label: string; placeholder?: string; type?: "text" | "textarea" }[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    title: "Thông tin công ty",
    icon: Building2,
    fields: [
      { key: "companyName", label: "Tên công ty (EN)", placeholder: "i8 STUDIO" },
      { key: "companyNameJa", label: "Tên công ty (JA)", placeholder: "アイハチ スタジオ" },
      { key: "foundedYear", label: "Năm thành lập", placeholder: "2020" },
    ],
  },
  {
    title: "Liên hệ",
    icon: Phone,
    fields: [
      { key: "email", label: "Email liên hệ", placeholder: "info@i8studio.vn" },
      { key: "phone", label: "Số điện thoại", placeholder: "0914 049 090" },
      { key: "address", label: "Địa chỉ (EN)", placeholder: "Da Nang, Vietnam" },
      { key: "addressJa", label: "Địa chỉ (JA)", placeholder: "ベトナム ダナン市" },
      { key: "lineUrl", label: "LINE URL", placeholder: "https://line.me/..." },
      { key: "chatworkUrl", label: "Chatwork URL", placeholder: "https://chatwork.com/..." },
    ],
  },
  {
    title: "Mạng xã hội",
    icon: Globe,
    fields: [
      { key: "socialFacebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
      { key: "socialInstagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
      { key: "socialLinkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/..." },
      { key: "socialYoutube", label: "YouTube URL", placeholder: "https://youtube.com/..." },
    ],
  },
  {
    title: "Giới thiệu (About Us) - Nội dung",
    icon: Building2,
    fields: [
      { key: "aboutTitle", label: "Tiêu đề (EN)", placeholder: "About us" },
      { key: "aboutTitleJa", label: "Tiêu đề (JA)", placeholder: "会社概要" },
      { key: "aboutDesc1", label: "Mô tả dòng 1 (EN)", type: "textarea" },
      { key: "aboutDesc1Ja", label: "Mô tả dòng 1 (JA)", type: "textarea" },
      { key: "aboutDesc2", label: "Mô tả dòng 2 (EN)", type: "textarea" },
      { key: "aboutDesc2Ja", label: "Mô tả dòng 2 (JA)", type: "textarea" },
    ],
  },
  {
    title: "Giới thiệu (About Us) - Mốc lịch sử (Milestones)",
    icon: Globe,
    fields: [
      { key: "aboutMilestone1Year", label: "Mốc 1 - Năm", placeholder: "2019" },
      { key: "aboutMilestone1Text", label: "Mốc 1 - Nội dung (EN)", placeholder: "Founded in Da Nang, Vietnam" },
      { key: "aboutMilestone1TextJa", label: "Mốc 1 - Nội dung (JA)", placeholder: "ベトナム・ダナンで創業" },
      
      { key: "aboutMilestone2Year", label: "Mốc 2 - Năm", placeholder: "2020" },
      { key: "aboutMilestone2Text", label: "Mốc 2 - Nội dung (EN)", placeholder: "First Japanese client partnerships" },
      { key: "aboutMilestone2TextJa", label: "Mốc 2 - Nội dung (JA)", placeholder: "日本のクライアントとの取引開始" },
      
      { key: "aboutMilestone3Year", label: "Mốc 3 - Năm", placeholder: "2022" },
      { key: "aboutMilestone3Text", label: "Mốc 3 - Nội dung (EN)", placeholder: "200+ projects completed" },
      { key: "aboutMilestone3TextJa", label: "Mốc 3 - Nội dung (JA)", placeholder: "200件以上のプロジェクト完了" },
      
      { key: "aboutMilestone4Year", label: "Mốc 4 - Năm", placeholder: "2024" },
      { key: "aboutMilestone4Text", label: "Mốc 4 - Nội dung (EN)", placeholder: "50+ active Japanese clients" },
      { key: "aboutMilestone4TextJa", label: "Mốc 4 - Nội dung (JA)", placeholder: "50社以上のアクティブな日本のクライアント" },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const json = await res.json();
    const map = json.data || {};
    setValues(map);
    setOriginal(map);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const hasChanges = JSON.stringify(values) !== JSON.stringify(original);

  const saveAll = async () => {
    setSaving(true);
    // Only send changed keys
    const changed: Record<string, string> = {};
    for (const key of Object.keys(values)) {
      if (values[key] !== original[key]) changed[key] = values[key] || "";
    }
    // Also include new keys that weren't in original
    for (const group of SETTING_GROUPS) {
      for (const field of group.fields) {
        if (!(field.key in original) && values[field.key]) {
          changed[field.key] = values[field.key];
        }
      }
    }

    if (Object.keys(changed).length === 0) {
      setSaving(false);
      toast("Không có thay đổi", "info");
      return;
    }

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changed),
    });
    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setOriginal({ ...values });
      toast("Đã lưu tất cả", "success");
    } else {
      toast("Lỗi khi lưu", "error");
    }
  };

  if (loading) return <AdminShell title="Cài đặt"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell
      title="Cài đặt hệ thống"
      actions={
        <button
          onClick={saveAll}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Lưu tất cả
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {SETTING_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Group header */}
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <Icon size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={values[field.key] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-gray-300 resize-y"
                      />
                    ) : (
                      <input
                        value={values[field.key] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-gray-300"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Unsaved changes indicator */}
        {hasChanges && (
          <div className="sticky bottom-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between shadow-lg">
            <span className="text-sm text-blue-700 font-medium">Có thay đổi chưa lưu</span>
            <button
              onClick={saveAll}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu tất cả
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
