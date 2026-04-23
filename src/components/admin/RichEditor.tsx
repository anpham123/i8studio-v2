"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Quote, Undo, Redo, Image as ImageIcon, Link, Minus,
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
    const url = prompt("Image URL:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt("Link URL:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
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
