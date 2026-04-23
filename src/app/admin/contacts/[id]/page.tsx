"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Trash2, Loader2, Check, Mail, Building2, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Contact { id: string; fullName: string; email: string; service: string; message: string; read: boolean; createdAt: string; }

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/contacts/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setContact(d.data);
      setLoading(false);
    });
  }, [id]);

  const markRead = async () => {
    const res = await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    const data = await res.json();
    if (data.data) { setContact(data.data); toast("Đã đánh dấu đọc", "success"); }
  };

  if (loading) return <AdminShell title="Liên hệ"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;
  if (!contact) return <AdminShell title="Liên hệ"><p className="text-gray-500">Không tìm thấy</p></AdminShell>;

  return (
    <AdminShell title="Chi tiết liên hệ" actions={<div className="flex gap-2">
      {!contact.read && <button onClick={markRead} className="flex items-center gap-2 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-50"><Check size={15} /> Đánh dấu đọc</button>}
      <button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button>
    </div>}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{contact.fullName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{formatDate(new Date(contact.createdAt))}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full ${!contact.read ? "bg-blue-50 text-blue-600 font-medium" : "bg-gray-100 text-gray-400"}`}>{contact.read ? "Đã đọc" : "Chưa đọc"}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400 shrink-0" /><a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a></div>
            {contact.service && <div className="flex items-center gap-3 text-sm"><Building2 size={16} className="text-gray-400 shrink-0" /><span className="text-gray-700">{contact.service}</span></div>}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><MessageSquare size={15} /> Nội dung</div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.message}</div>
          </div>
        </div>
      </div>
      <ConfirmDialog open={showDel} message="Xóa liên hệ này?" onConfirm={async () => { await fetch(`/api/contacts/${id}`, { method: "DELETE" }); router.push("/admin/contacts"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
