import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Portfolio — About Us",
    description: "Explore the i8 STUDIO portfolio showcasing our best works.",
    path: "/about-us/portfolio",
    locale: params.locale,
  });
}

export default function AboutPortfolioPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-3xl font-medium text-[#111] mb-4">Portfolio</h1>
        <p className="text-gray-500 text-lg">
          Coming soon — our company portfolio will be showcased here.
        </p>
      </div>
    </div>
  );
}
