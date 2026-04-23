"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Subscriber { id: string; email: string; name: string; source: string; createdAt: string; }

export default function SubscribersPage() {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/subscribers?limit=1000");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/subscribers/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const exportCsv = () => {
    const rows = [["Email","Name","Source","Date"], ...data.map((s) => [s.email, s.name, s.source, formatDate(new Date(s.createdAt))])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const cols: Column<Subscriber>[] = [
    { key: "email", label: "Email", sortable: true },
    { key: "name", label: "Tên" },
    { key: "source", label: "Nguồn", render: (v) => <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{String(v) || "—"}</span> },
    { key: "createdAt", label: "Ngày đăng ký", render: (v) => <span className="text-xs text-gray-500">{formatDate(new Date(String(v)))}</span> },
  ];

  return (
    <AdminShell title={`Subscribers (${data.length})`} actions={<button onClick={exportCsv} className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"><Download size={15} /> Xuất CSV</button>}>
      <DataTable columns={cols} data={data} loading={loading} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa subscriber "${del?.email}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
