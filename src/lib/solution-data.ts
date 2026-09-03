/**
 * SolutionService type — shared interface for solution/service data.
 * Used across frontend components. Data comes from the Service DB model.
 */
export interface SolutionService {
  slug: string;
  titleJa: string;
  titleEn: string;
  heroImage: string;
  heroVideo: string;
  heroTaglineJa: string;
  heroTaglineEn: string;
  heroDescJa: string;
  heroDescEn: string;
  mediaEmbedUrl: string;
  features: {
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
    image: string;
    mediaEmbedUrl?: string;
    displayMode?: "single" | "beforeAfter";
    imageBefore?: string;
    imageAfter?: string;
  }[];
  process: {
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
  }[];
  plans: {
    name: string;
    features: string[];
    price: string;
    highlighted?: boolean;
  }[];
}

export const JAPANESE_SERVICE_NAMES: Record<string, string> = {
  "cg-perspective": "CGパース",
  "cg-video": "CG動画",
  "photo-composite": "写真合成",
  "virtual-staging": "バーチャルステージング",
  "vr360": "VR360",
  "vr-walkthrough": "VRウォークスルー",
  "digital-model": "デジタル模型",
  "ar": "AR",
  "exe-content": "EXEコンテンツ",
  "bim-services": "BIMサービス",
  "pachinko-slot-cg": "パチンコ・スロットCG",
  "anime-illustration": "アニメ・イラスト",
};

export const ENGLISH_SERVICE_NAMES: Record<string, string> = {
  "cg-perspective": "CG Perspective",
  "cg-video": "CG Video",
  "photo-composite": "Photo Compositing",
  "virtual-staging": "Virtual Staging",
  "vr360": "VR360",
  "vr-walkthrough": "VR Walkthrough",
  "digital-model": "Digital Model",
  "ar": "AR",
  "exe-content": "EXE Content",
  "bim-services": "BIM Services",
  "pachinko-slot-cg": "Pachinko & Slot CG",
  "anime-illustration": "Anime & Illustration",
};

export function getServiceName(
  svc: { slug: string; name?: string; nameJa?: string | null },
  isJa: boolean
): string {
  const normalizedSlug = (svc.slug || "").toLowerCase().trim().replace(/_/g, "-");
  if (isJa) {
    if (JAPANESE_SERVICE_NAMES[normalizedSlug]) {
      return JAPANESE_SERVICE_NAMES[normalizedSlug];
    }
    const ja = (svc.nameJa || "").trim();
    const looksJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(ja);
    return looksJapanese ? ja : (svc.nameJa || svc.name || "");
  }
  if (ENGLISH_SERVICE_NAMES[normalizedSlug]) {
    return ENGLISH_SERVICE_NAMES[normalizedSlug];
  }
  return svc.name || svc.nameJa || "";
}

/** Convert a Prisma Service row to SolutionService */
export function dbServiceToSolution(db: Record<string, unknown>): SolutionService {
  let features: SolutionService["features"] = [];
  try {
    const parsed = JSON.parse((db.featuresJson as string) || "[]");
    if (Array.isArray(parsed)) features = parsed;
  } catch { /* empty */ }

  // Fall back to legacy feature1/feature2 fields if no dynamic features
  if (features.length === 0) {
    const f1Title = (db.feature1TitleJa as string) || (db.feature1TitleEn as string);
    const f2Title = (db.feature2TitleJa as string) || (db.feature2TitleEn as string);
    if (f1Title) {
      features.push({
        titleJa: (db.feature1TitleJa as string) || "",
        titleEn: (db.feature1TitleEn as string) || "",
        descJa: (db.feature1DescJa as string) || "",
        descEn: (db.feature1DescEn as string) || "",
        image: (db.feature1Image as string) || "",
      });
    }
    if (f2Title) {
      features.push({
        titleJa: (db.feature2TitleJa as string) || "",
        titleEn: (db.feature2TitleEn as string) || "",
        descJa: (db.feature2DescJa as string) || "",
        descEn: (db.feature2DescEn as string) || "",
        image: (db.feature2Image as string) || "",
      });
    }
  }

  let process: SolutionService["process"] = [];
  try {
    const parsed = JSON.parse((db.processJson as string) || "[]");
    if (Array.isArray(parsed)) process = parsed;
  } catch { /* empty */ }

  let plans: SolutionService["plans"] = [];
  try {
    const parsed = JSON.parse((db.plansJson as string) || "[]");
    if (Array.isArray(parsed)) plans = parsed;
  } catch { /* empty */ }

  const slug = db.slug as string;
  const rawNameJa = (db.nameJa as string) || "";
  const rawName = (db.name as string) || "";

  return {
    slug,
    titleJa: getServiceName({ slug, name: rawName, nameJa: rawNameJa }, true),
    titleEn: getServiceName({ slug, name: rawName, nameJa: rawNameJa }, false),
    heroImage: (db.heroImage as string) || "",
    heroVideo: (db.heroVideo as string) || "",
    heroTaglineJa: (db.heroTaglineJa as string) || "",
    heroTaglineEn: (db.heroTaglineEn as string) || "",
    heroDescJa: (db.heroDescJa as string) || "",
    heroDescEn: (db.heroDescEn as string) || "",
    mediaEmbedUrl: (db.mediaEmbedUrl as string) || "",
    features,
    process,
    plans,
  };
}
