"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Quote, Undo, Redo, Image as ImageIcon, Link, Minus, Table as TableIcon,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function RichEditor({ value, onChange, label }: RichEditorProps) {
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

  const addTable = useCallback(() => {
    if (!editor) return;
    const tableHtml = `
<div class="overflow-x-auto my-4">
<table class="comparison-table w-full border-collapse border border-gray-300">
  <thead>
    <tr class="bg-[#f0f4f8]">
      <th class="border border-gray-300 p-3 font-bold text-gray-800">技術</th>
      <th class="border border-gray-300 p-3 font-bold text-gray-800">基本的な特徴</th>
      <th class="border border-gray-300 p-3 font-bold text-gray-800">建築・不動産での例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-3 font-semibold text-center">AR</td>
      <td class="border border-gray-300 p-3">現実空間にデジタル情報を重ねて表示する</td>
      <td class="border border-gray-300 p-3">現地での建物表示、家具配置、施工・設備情報の確認</td>
    </tr>
    <tr>
      <td class="border border-gray-300 p-3 font-semibold text-center">VR</td>
      <td class="border border-gray-300 p-3">視界を仮想空間に置き換え、没入して体験する</td>
      <td class="border border-gray-300 p-3">完成前の空間体験、バーチャル内覧、設計レビュー</td>
    </tr>
    <tr>
      <td class="border border-gray-300 p-3 font-semibold text-center">MR</td>
      <td class="border border-gray-300 p-3">現実空間を認識し、デジタル情報を空間に固定・操作する体験を重視する</td>
      <td class="border border-gray-300 p-3">実寸確認、複数人での設計検討、作業支援</td>
    </tr>
  </tbody>
</table>
</div>
<p></p>
`;
    editor.chain().focus().insertContent(tableHtml).run();
  }, [editor]);

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
          <ToolBtn onClick={addTable} active={false} title="Chèn Bảng So Sánh (Table)">
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
    </div>
  );
}
