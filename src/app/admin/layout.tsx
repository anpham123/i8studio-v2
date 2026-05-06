import AdminProviders from "@/components/admin/AdminProviders";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
