import "@/app/globals.css";
import AdminProviders from "@/components/admin/AdminProviders";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="bg-gray-50">
      <body className={`${outfit.variable} bg-gray-50 text-gray-900 font-sans antialiased`}>
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}

