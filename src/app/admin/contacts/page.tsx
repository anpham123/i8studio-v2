"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import { formatDate } from "@/lib/utils";

interface Contact { id: string; fullName: string; email: string; service: string; message: string; read: boolean; createdAt: string; }

export default function ContactsPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contacts?limit=100");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cols: Column<Contact>[] = [
    { key: "fullName", label: "Họ tên", sortable: true, render: (v, row) => <span className={row.read ? "text-gray-600" : "font-semibold text-gray-900"}>{String(v)}</span> },
    { key: "email", label: "Email" },
    { key: "service", label: "Dịch vụ" },
    { key: "read", label: "Trạng thái", render: (v) => <span className={`text-xs px-2 py-0.5 rounded-full ${!v ? "bg-blue-50 text-blue-600 font-medium" : "bg-gray-100 text-gray-400"}`}>{v ? "Đã đọc" : "Chưa đọc"}</span> },
    { key: "createdAt", label: "Ngày gửi", render: (v) => <span className="text-xs text-gray-500">{formatDate(new Date(String(v)))}</span> },
  ];

  return (
    <AdminShell title="Liên hệ">
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/contacts/${r.id}`)} />
    </AdminShell>
  );
}
