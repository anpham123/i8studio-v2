import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import ContactSection from "@/components/public/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Contact Us",
    description:
      "Get in touch with i8 STUDIO for your 3DCG, Animation, VR & BIM project. Free consultation, NDA available. We respond within 24 hours.",
    path: "/contact",
    locale: params.locale,
  });
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    prisma.setting.findMany(),
    prisma.service.findMany({ orderBy: { order: "asc" }, select: { name: true } }),
  ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="min-h-screen">
      <ContactSection settings={settingsMap} serviceNames={services.map((s) => s.name)} />
    </div>
  );
}
