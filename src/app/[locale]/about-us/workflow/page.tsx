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

  if (row?.contentJson) {
    try {
      const parsed = JSON.parse(row.contentJson);
      if (Array.isArray(parsed)) {
        steps = parsed;
      }
    } catch {
      // ignore parse errors
    }
  }

  // Sort by stepNumber
  steps.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));

  return <WorkflowPageContent steps={steps} />;
}
