"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function SeoRenamePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    successCount: number;
    skippedCount: number;
    errorCount: number;
    logs: string[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMsg("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Vui lòng chọn file Excel trước khi thực hiện.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/seo-rename", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi xử lý file");
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="Đổi tên file SEO">
      <div className="max-w-4xl mx-auto py-2 px-2 sm:px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
          Đổi Tên File Ảnh Tự Động (SEO Image Rename)
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Tải file Excel để tự động đổi tên file trong thư mục lưu trữ và cập nhật đường dẫn Database.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quy ước cột trong file Excel:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-md text-xs">Cột B</span>
            <span className="text-gray-700 font-medium">Tên file cũ (hoặc link ảnh cũ)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-md text-xs">Cột F</span>
            <span className="text-gray-700 font-medium">Tên file mới chuẩn SEO</span>
          </div>
        </div>

        {/* Upload box */}
        <div className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-8 text-center transition-colors bg-gray-50/50">
          <input
            type="file"
            id="excel-file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="excel-file" className="cursor-pointer flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-gray-900 mb-1">
              {file ? file.name : "Nhấp để chọn file Excel (.xlsx, .xls)"}
            </span>
            <span className="text-xs text-gray-400">Hỗ trợ file Excel chứa danh sách tên file cũ & mới</span>
          </label>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý đổi tên & cập nhật DB...
              </>
            ) : (
              <>
                Bắt đầu đổi tên tự động
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Report */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Kết quả thực hiện:</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-2xl font-bold text-emerald-700">{result.successCount}</span>
              <span className="text-xs text-emerald-600 font-medium">Thành công</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <span className="block text-2xl font-bold text-amber-700">{result.skippedCount}</span>
              <span className="text-xs text-amber-600 font-medium">Bỏ qua (trùng tên)</span>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
              <span className="block text-2xl font-bold text-red-700">{result.errorCount}</span>
              <span className="text-xs text-red-600 font-medium">Lỗi</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-900 mb-2">Chi tiết xử lý:</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs max-h-64 overflow-y-auto space-y-1">
            {result.logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}
      </div>
    </AdminShell>
  );
}
