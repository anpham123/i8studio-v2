import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "i8 STUDIO — 3DCG, Animation, VR & BIM",
  description:
    "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
  icons: {
    icon: "/api/favicon",
  },
  verification: {
    google: "M2yi6RIMJiVIW2Ijao6mABwtiEQG-OSWAx0PInw6tS8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
