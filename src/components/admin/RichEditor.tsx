"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Quote, Undo, Redo, Image as ImageIcon, Link, Minus,
  Table as TableIcon, Plus, Trash2, X, Sparkles,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function RichEditor({ value, onChange, label }: RichEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [tableHeaders, setTableHeaders] = useState<string[]>([
    "技術",
    "基本的な特徴",
    "建築・不動産での例",
  ]);
  const [tableRows, setTableRows] = useState<string[][]>([
    [
      "AR",
      "現実空間にデジタル情報を重ねて表示する",
      "現地での建物表示、家具配置、施工・設備情報の確認",
    ],
    [
      "VR",
      "視界を仮想空間に置き換え、没入して体験する",
      "完成前の空間体験、バーチャル内覧、設計レビュー",
    ],
    [
      "MR",
      "現実空間を認識し、デジタル情報を空間に固定・操作する体験を重視する",
      "実寸確認、複数人での設計検討、作業支援",
    ],
  ]);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false, allowBase64: true })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none text-gray-800",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt("Link URL:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  // Insert Table into Editor
  const handleInsertTable = () => {
    if (!editor) return;

    let tableHtml = `<div class="overflow-x-auto my-6"><table class="comparison-table"><thead><tr>`;
    tableHeaders.forEach((h, i) => {
      tableHtml += `<th>${h || `Cột ${i + 1}`}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;

    tableRows.forEach((row) => {
      tableHtml += `<tr>`;
      row.forEach((cell, ci) => {
        tableHtml += `<td>${cell || ""}</td>`;
      });
      tableHtml += `</tr>`;
    });

    tableHtml += `</tbody></table></div><p></p>`;

    editor.chain().focus().insertContent(tableHtml).run();
    setIsTableModalOpen(false);
  };

  const loadSampleTable = () => {
    setTableHeaders(["技術", "基本的な特徴", "建築・不動産での例"]);
    setTableRows([
      ["AR", "現実空間にデジタル情報を重ねて表示する", "現地での建物表示、家具配置、施工・設備情報の確認"],
      ["VR", "視界を仮想空間に置き換え、没入して体験する", "完成前の空間体験、バーチャル内覧、設計レビュー"],
      ["MR", "現実空間を認識し、デジタル情報を空間に固定・操作する体験を重視する", "実寸確認、複数人での設計検討、作業支援"],
    ]);
  };

  const addColumn = () => {
    setTableHeaders((prev) => [...prev, `Cột ${prev.length + 1}`]);
    setTableRows((prev) => prev.map((row) => [...row, ""]));
  };

  const removeColumn = (colIdx: number) => {
    if (tableHeaders.length <= 1) return;
    setTableHeaders((prev) => prev.filter((_, i) => i !== colIdx));
    setTableRows((prev) => prev.map((row) => row.filter((_, i) => i !== colIdx)));
  };

  const addRow = () => {
    setTableRows((prev) => [...prev, new Array(tableHeaders.length).fill("")]);
  };

  const removeRow = (rowIdx: number) => {
    if (tableRows.length <= 1) return;
    setTableRows((prev) => prev.filter((_, i) => i !== rowIdx));
  };

  const updateHeader = (colIdx: number, val: string) => {
    setTableHeaders((prev) => prev.map((h, i) => (i === colIdx ? val : h)));
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    setTableRows((prev) =>
      prev.map((row, r) =>
        r === rowIdx ? row.map((cell, c) => (c === colIdx ? val : cell)) : row
      )
    );
  };

  if (!editor) return null;

  const ToolBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button" onClick={onClick} title={title}
      className={`p-1.5 rounded text-sm transition-colors ${active ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
    >
      {children}
    </button>
  );

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-0.5 p-2 border-b border-gray-100 bg-gray-50">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic size={15} />
          </ToolBtn>
          <div className="w-px bg-gray-200 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            <Heading3 size={15} />
          </ToolBtn>
          <div className="w-px bg-gray-200 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <List size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
            <ListOrdered size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
            <Quote size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
            <Minus size={15} />
          </ToolBtn>
          <div className="w-px bg-gray-200 mx-1" />
          <ToolBtn onClick={addImage} active={false} title="Insert image">
            <ImageIcon size={15} />
          </ToolBtn>
          <ToolBtn onClick={addLink} active={editor.isActive("link")} title="Add link">
            <Link size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => setIsTableModalOpen(true)} active={false} title="Chèn Bảng So Sánh (Comparison Table)">
            <TableIcon size={15} />
          </ToolBtn>
          <div className="w-px bg-gray-200 mx-1 ml-auto" />
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
            <Undo size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
            <Redo size={15} />
          </ToolBtn>
        </div>
        <EditorContent editor={editor} />
      </div>

      {/* Comparison Table Builder Modal */}
      {mounted && isTableModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTableModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 relative z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <TableIcon size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Tạo Bảng So Sánh (Comparison Table)</h3>
                  <p className="text-xs text-gray-500">Tùy chỉnh cột, dòng và xem trước bảng so sánh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadSampleTable}
                  className="flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                >
                  <Sparkles size={14} /> Nạp mẫu AR / VR / MR
                </button>
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Columns Header Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    1. Tiêu đề các Cột ({tableHeaders.length} cột)
                  </span>
                  <button
                    type="button"
                    onClick={addColumn}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
                  >
                    <Plus size={13} /> Thêm cột
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tableHeaders.map((h, ci) => (
                    <div key={ci} className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                      <span className="text-xs font-bold text-gray-400 pl-1">{ci + 1}.</span>
                      <input
                        value={h}
                        onChange={(e) => updateHeader(ci, e.target.value)}
                        placeholder={`Tiêu đề cột ${ci + 1}`}
                        className="flex-1 bg-white px-2.5 py-1.5 text-sm font-semibold rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {tableHeaders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColumn(ci)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa cột"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    2. Nội dung các Dòng ({tableRows.length} dòng)
                  </span>
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
                  >
                    <Plus size={13} /> Thêm dòng
                  </button>
                </div>
                <div className="space-y-3">
                  {tableRows.map((row, ri) => (
                    <div key={ri} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          Dòng #{ri + 1}
                        </span>
                        {tableRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(ri)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} /> Xóa dòng
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tableHeaders.map((_, ci) => (
                          <div key={ci}>
                            <label className="block text-[11px] text-gray-400 mb-1 truncate">
                              {tableHeaders[ci] || `Cột ${ci + 1}`}
                            </label>
                            <textarea
                              value={row[ci] || ""}
                              onChange={(e) => updateCell(ri, ci, e.target.value)}
                              placeholder={`Nội dung...`}
                              rows={2}
                              className="w-full bg-white px-2.5 py-1.5 text-xs text-gray-800 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                  3. Xem trước hiển thị (Preview)
                </span>
                <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#f0f4f8] border-b border-gray-300">
                        {tableHeaders.map((h, i) => (
                          <th
                            key={i}
                            className={`p-3 font-bold text-gray-900 border-r last:border-r-0 border-gray-300 ${
                              i === 0 ? "w-[18%] text-center" : ""
                            }`}
                          >
                            {h || `Cột ${i + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {tableRows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-gray-50/60">
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`p-3 text-gray-700 leading-relaxed border-r last:border-r-0 border-gray-300 ${
                                ci === 0 ? "font-semibold text-center text-gray-900 bg-gray-50/50" : ""
                              }`}
                            >
                              {cell || <span className="text-gray-300 italic">(Trống)</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus size={16} /> Chèn Bảng vào Bài Viết
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
