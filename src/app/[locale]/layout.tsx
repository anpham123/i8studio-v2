import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FloatingCTA from "@/components/public/FloatingCTA";
import ExitIntentPopup from "@/components/public/ExitIntentPopup";
import { prisma } from "@/lib/prisma";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const locales = ["en", "ja"];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://i8studio.vn";

export const metadata: Metadata = {
  title: {
    default: "i8 STUDIO — 3DCG, Animation, VR & BIM",
    template: "%s | i8 STUDIO",
  },
  description:
    "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "i8 STUDIO",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "i8 STUDIO" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale)) notFound();

  const messages = await getMessages();

  // Fetch data for layout components
  const [settings, services] = await Promise.all([
    prisma.setting.findMany(),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <html lang={params.locale}>
      <body className={`${outfit.variable} font-sans antialiased bg-[#0a0a0f] text-white`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer settings={settingsMap} services={services} />
          <FloatingCTA />
          <ExitIntentPopup />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
