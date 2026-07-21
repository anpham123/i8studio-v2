import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Outfit, Cormorant_Garamond, Noto_Serif_JP, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FloatingCTA from "@/components/public/FloatingCTA";
import ExitIntentPopup from "@/components/public/ExitIntentPopup";
import PageTransition from "@/components/public/PageTransition";
import PageViewTracker from "@/components/public/PageViewTracker";
import { prisma } from "@/lib/prisma";
import CustomCursor from "@/components/public/CustomCursor";

// Always fetch fresh settings — never serve a cached layout with stale bg config
// ISR: regenerate layout data every 120 seconds
export const revalidate = 120;

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-serif",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const locales = ["en", "ja"];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://i8studio.vn";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const logoImageName = settingsMap.logoImage ? settingsMap.logoImage.split("/").pop() : "1";
  const faviconKey = settingsMap.faviconImage ? settingsMap.faviconImage.split("/").pop() : logoImageName;

  return {
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
    icons: {
      icon: `/api/favicon?v=${faviconKey}`,
    },
  };
}

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

  const headerHeight = 76;

  return (
    <html lang={params.locale}>
      <body
        className={`${outfit.variable} ${cormorant.variable} ${notoSerifJP.variable} ${playfair.variable} font-sans antialiased`}
        style={{ "--header-h": `${headerHeight}px` } as React.CSSProperties}
      >
        <NextIntlClientProvider messages={messages}>
          <Header headerHeight={headerHeight} logoImage={settingsMap.logoImage} logoHeight={parseInt(settingsMap.logoHeight) || 48} />
          <main style={{ paddingTop: headerHeight }}>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={settingsMap} services={services} />
          <FloatingCTA />
          <ExitIntentPopup />
          <PageViewTracker />
          <CustomCursor
            cursorImage={settingsMap.cursorImage}
            cursorEnabled={settingsMap.cursorEnabled === "true"}
            cursorSize={parseInt(settingsMap.cursorSize) || 32}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
