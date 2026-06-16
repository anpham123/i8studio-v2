"use client";

import AdminShell from "@/components/admin/AdminShell";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <AdminShell title="Tạo Blog Post mới">
      <BlogPostForm />
    </AdminShell>
  );
}
