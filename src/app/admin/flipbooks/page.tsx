"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Plus, ExternalLink, Save } from "lucide-react";

interface Flipbook { id: string; title: string; pdfUrl: string; active: boolean; order: number; createdAt: string; }

export default function FlipbooksPage() {
  const [data, setData] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Flipbook | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [heroImage, setHeroImage] = useState("/uploads/1781662116949-House_in_forest__Summer_.webp");
  const [savingHero, setSavingHero] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [flipRes, heroRes] = await Promise.all([
      fetch("/api/flipbooks?limit=100&all=true"),
      fetch("/api/company-content/portfolio"),
    ]);
    const flipJson = await flipRes.json();
    setData(flipJson.data || []);

    const heroJson = await heroRes.json();
    if (heroJson.data?.contentJson) {
      try {
        const parsed = JSON.parse(heroJson.data.contentJson);
        if (parsed?.heroImage) setHeroImage(parsed.heroImage);
      } catch { /* ignore */ }
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveHeroImage = async (newUrl?: string) => {
    const imgToSave = newUrl !== undefined ? newUrl : heroImage;
    setSavingHero(true);
    const res = await fetch("/api/company-content/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentJson: JSON.stringify({ heroImage: imgToSave }) }),
    });
    const json = await res.json();
    setSavingHero(false);
    if (json.data) toast("Đã lưu ảnh Hero Portfolio thành công!", "success");
    else toast("Lỗi khi lưu ảnh", "error");
  };

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/flipbooks/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<Flipbook>[] = [
    { key: "title", label: "Tiêu đề", sortable: true },
    { key: "pdfUrl", label: "File PDF", render: (v) => <a href={String(v)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs"><ExternalLink size={12} /> PDF</a> },
    { key: "active", label: "Trạng thái", render: (v) => <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>{v ? "Hiện" : "Ẩn"}</span> },
    { key: "order", label: "Thứ tự", sortable: true },
  ];

  return (
    <AdminShell
      title={`Portfolio (${data.length})`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => saveHeroImage()}
            disabled={savingHero}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors"
          >
            <Save size={15} /> {savingHero ? "Đang lưu..." : "Lưu ảnh Hero"}
          </button>
          <Link
            href="/admin/flipbooks/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} /> Thêm mới
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Section Banner Image Uploader */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                🖼️ Ảnh Hero Section trang Portfolio
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tải lên hoặc chọn ảnh hiển thị ở cột bên phải phần Hero đầu trang Portfolio (/about-us/portfolio)
              </p>
            </div>
          </div>
          <ImageUpload
            label="Ảnh Hero Portfolio"
            value={heroImage}
            onChange={(url) => {
              setHeroImage(url);
              saveHeroImage(url);
            }}
          />
        </div>

        {/* Flipbooks / Portfolio Data Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Danh sách Portfolio PDF ({data.length})
          </h3>
          <DataTable
            columns={cols}
            data={data}
            loading={loading}
            onEdit={(r) => router.push(`/admin/flipbooks/${r.id}`)}
            onDelete={setDel}
            searchPlaceholder="Tìm portfolio..."
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!del}
        message={`Xóa portfolio "${del?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
