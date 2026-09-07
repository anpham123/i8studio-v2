import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import WorkflowPageContent from "@/components/public/WorkflowPageContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Workflow — Production Process",
    description:
      "Learn about i8 STUDIO's professional production workflow.",
    path: "/about-us/workflow",
    locale: params.locale,
  });
}

export default async function WorkflowPage() {
  // Fetch workflow steps from DB (company_content section="workflow")
  const row = await prisma.companyContent.findUnique({
    where: { section: "workflow" },
  });

  let steps: Array<{
    stepNumber: number;
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
    image: string;
    tags: string;
  }> = [];
  let heroImage = "";

  if (row?.contentJson) {
    try {
      const parsed = JSON.parse(row.contentJson);
      const rawSteps = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray(parsed.steps)
        ? parsed.steps
        : [];

      steps = rawSteps.map((s: any) => ({
        stepNumber: s.stepNumber || 0,
        titleJa: s.titleJa || "",
        titleEn: s.titleEn || "",
        descJa: s.descJa || "",
        descEn: s.descEn || "",
        image: s.image || (Array.isArray(s.images) && s.images[0]) || "",
        images: Array.isArray(s.images) && s.images.length > 0 ? s.images : s.image ? [s.image] : [],
        tags: s.tags || "",
      }));

      if (parsed && typeof parsed === "object" && parsed.heroImage) {
        heroImage = parsed.heroImage;
      }
    } catch {
      // ignore parse errors
    }
  }

  // Sort by stepNumber
  steps.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));

  return <WorkflowPageContent steps={steps} heroImage={heroImage || undefined} />;
}
