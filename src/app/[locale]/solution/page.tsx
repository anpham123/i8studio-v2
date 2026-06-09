import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SolutionContent from "@/components/public/SolutionContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Solution — What We Create",
    description:
      "High-quality 3DCG, Animation, VR Walkthrough, VR 360, Photo Composite, and Digital Model services for Japanese architecture and real estate.",
    path: "/solution",
    locale: params.locale,
  });
}

export default function SolutionPage() {
  return (
    <div className="min-h-screen bg-white">
      <SolutionContent />
    </div>
  );
}
