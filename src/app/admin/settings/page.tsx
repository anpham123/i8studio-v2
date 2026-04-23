"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Save } from "lucide-react";

const LABELS: Record<string, string> = {
  companyName: "Tên công ty (EN)",
  companyNameJa: "Tên công ty (JA)",
  email: "Email liên hệ",
  phone: "Số điện thoại",
  address: "Địa chỉ (EN)",
  addressJa: "Địa chỉ (JA)",
  lineUrl: "LINE URL",
  chatworkUrl: "Chatwork URL",
  foundedYear: "Năm thành lập",
  socialFacebook: "Facebook URL",
  socialInstagram: "Instagram URL",
  socialLinkedin: "LinkedIn URL",
};

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const json = await res.json();
    // API returns { data: { key: value, ... } } map format
    const map = json.data || {};
    setValues(map);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const saveSetting = async (key: string) => {
    setSaving(key);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: values[key] || "" }) });
    const data = await res.json();
    setSaving(null);
    if (data.success) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Cài đặt"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  const keys = Object.keys(LABELS);

  return (
    <AdminShell title="Cài đặt hệ thống">
      <div className="max-w-2xl space-y-3">
        {keys.map((key) => (
          <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{LABELS[key] || key}</label>
              <input
                value={values[key] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") saveSetting(key); }}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <button onClick={() => saveSetting(key)} disabled={saving === key} className="shrink-0 flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 mt-5">
              {saving === key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
