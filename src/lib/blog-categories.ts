export interface BlogCategoryDef {
  slug: string;
  route: string;
  key: string;
  nameJa: string;
  nameEn: string;
  descJa: string;
  descEn: string;
  aliases: string[];
}

export const BLOG_CATEGORIES: BlogCategoryDef[] = [
  {
    slug: "case-study",
    route: "case-study",
    key: "caseStudy",
    nameJa: "ケーススタディ",
    nameEn: "Case Study",
    descJa: "実際のプロジェクト事例を通じて、課題解決のプロセスと成果をご紹介します。",
    descEn: "Real project case studies and architectural visualization solutions.",
    aliases: ["case-study", "case_study", "Case Study", "ケーススタディ", "事例紹介"],
  },
  {
    slug: "technique",
    route: "tips",
    key: "technique",
    nameJa: "テクニック共有",
    nameEn: "Technique Sharing",
    descJa: "3DCG制作の実践的なテクニックやノウハウを共有します。",
    descEn: "Practical 3DCG production techniques and professional workflow insights.",
    aliases: ["technique", "technique-sharing", "tips", "Technique Sharing", "技術共有", "テクニック共有", "制作プロセス / ArchViz", "Production Process / ArchViz"],
  },
  {
    slug: "knowledge",
    route: "knowledge",
    key: "knowledge",
    nameJa: "ナレッジ",
    nameEn: "Knowledge",
    descJa: "建築ビジュアライゼーション業界の知識と最新トレンドをお届けします。",
    descEn: "Industry knowledge, architectural visualization basics and architectural insights.",
    aliases: ["knowledge", "Knowledge", "建築知識", "ナレッジ", "建築パース"],
  },
  {
    slug: "ai",
    route: "ai-feature",
    key: "ai",
    nameJa: "AI特集",
    nameEn: "AI Column",
    descJa: "AI技術を活用した制作ワークフローと最新事例をご紹介します。",
    descEn: "AI-powered architectural visualization workflows, experiments and case studies.",
    aliases: ["ai", "ai-feature", "ai-updates", "AI Column", "AI特集", "AI最新情報"],
  },
  {
    slug: "life-gallery",
    route: "life-gallery",
    key: "lifeGallery",
    nameJa: "i8 ライフギャラリー",
    nameEn: "I8 Life Gallery",
    descJa: "i8 STUDIOのチームメンバーの日常やカルチャーをお伝えします。",
    descEn: "A glimpse into the daily life, culture, and behind-the-scenes at i8 STUDIO.",
    aliases: ["life-gallery", "i8-life-gallery", "I8 Life Gallery", "I8 ライフギャラリー", "i8ライフギャラリー"],
  },
];

export function getCategoryBySlugOrRoute(slugOrRoute: string): BlogCategoryDef | undefined {
  return BLOG_CATEGORIES.find(
    (c) => c.slug === slugOrRoute || c.route === slugOrRoute || c.key === slugOrRoute
  );
}

export function getCategoryAliases(slugOrRoute: string): string[] {
  const cat = getCategoryBySlugOrRoute(slugOrRoute);
  return cat ? cat.aliases : [slugOrRoute];
}

export function translateBlogEyebrow(eb?: string, isJa = true): string {
  if (!eb) return "";
  if (!isJa) return eb;
  const trimmed = eb.trim();
  const map: Record<string, string> = {
    "CONSULTATION": "ヒアリング・要件定義",
    "MODELING": "3Dモデリング",
    "CAMERA ANGLE": "アングル提案・選定",
    "VISUAL REFINEMENT": "ビジュアル調整",
    "REVIEW": "初稿レビュー",
    "DELIVERY": "最終納品",
    "OUR PHILOSOPHY": "私たちのこだわり",
    "Check Cam": "アングル確認",
    "CHECK CAM": "アングル確認",
    "Render v1": "初回レンダリング",
    "RENDER V1": "初回レンダリング",
    "Render v2": "精密レンダリング",
    "RENDER V2": "精密レンダリング",
    "Final Render": "最終レンダリング",
    "FINAL RENDER": "最終レンダリング",
    "AI INTEGRATION": "AI連携",
    "INNOVATION": "技術革新",
    "Insight": "インサイト",
    "Process": "制作工程",
    "PROCESS": "制作工程",
  };
  return map[trimmed] || map[trimmed.toUpperCase()] || trimmed;
}

export function translateBlogBadge(badge?: string, isJa = true): string {
  if (!badge) return "";
  if (!isJa) return badge;
  const trimmed = badge.trim();
  const map: Record<string, string> = {
    "INNOVATION": "技術革新",
    "納品": "最終納品",
    "１回目 レンダー": "初回レンダリング",
    "２回目 レンダー": "精密レンダリング",
    "アングル確認": "アングル確認",
    "レンダリング v1": "初回レンダリング",
    "レンダリング v2": "精密レンダリング",
  };
  if (map[trimmed]) return map[trimmed];
  return trimmed
    .replace(/^STEP\s*0?(\d+)$/i, (_, n) => `ステップ ${parseInt(n) < 10 ? '0' + parseInt(n) : n}`)
    .replace(/STEP\s*(\d+)/gi, "ステップ $1");
}
