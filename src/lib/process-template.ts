/**
 * Standard 6-step production process template for i8 STUDIO services.
 * Used to auto-fill process steps when creating a new service.
 */
export interface ProcessStep {
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
}

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    titleJa: "ヒアリング・資料共有",
    titleEn: "Hearing & Material Sharing",
    descJa: "プロジェクトの要件や目標をヒアリングし、必要な資料を共有していただきます。",
    descEn: "We discuss project requirements and goals, and receive necessary reference materials.",
  },
  {
    titleJa: "方向性確認・3D構築",
    titleEn: "Direction Confirmation & 3D Construction",
    descJa: "デザインの方向性を確認し、3Dモデルの構築を開始します。",
    descEn: "Confirm design direction and begin 3D model construction.",
  },
  {
    titleJa: "アングル提案・表現確認",
    titleEn: "Angle Proposal & Expression Review",
    descJa: "最適なカメラアングルを提案し、表現方法を確認します。",
    descEn: "Propose optimal camera angles and review expression methods.",
  },
  {
    titleJa: "ライティング・マテリアル調整",
    titleEn: "Lighting & Material Adjustment",
    descJa: "ライティングとマテリアルを調整し、リアルな質感を追求します。",
    descEn: "Adjust lighting and materials to achieve realistic textures.",
  },
  {
    titleJa: "初稿提出・フィードバック",
    titleEn: "First Draft & Feedback",
    descJa: "初稿をお客様に提出し、フィードバックをいただきます。",
    descEn: "Submit the first draft for client review and receive feedback.",
  },
  {
    titleJa: "修正対応・最終納品",
    titleEn: "Revision & Final Delivery",
    descJa: "フィードバックに基づき修正を行い、最終成果物を納品します。",
    descEn: "Make revisions based on feedback and deliver the final output.",
  },
];
