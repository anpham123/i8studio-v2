import "@/app/globals.css";
import AdminProviders from "@/components/admin/AdminProviders";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="bg-gray-50">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
