import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "i8 STUDIO — 3DCG, Animation, VR & BIM",
  description:
    "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
