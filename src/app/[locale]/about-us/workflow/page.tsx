import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import WorkflowPageContent from "@/components/public/WorkflowPageContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Workflow — Production Process",
    description:
      "Learn about i8 STUDIO's professional 4-step production workflow: Scene Analysis, Modeling, Lighting, and Rendering.",
    path: "/about-us/workflow",
    locale: params.locale,
  });
}

export default function WorkflowPage() {
  return <WorkflowPageContent />;
}
