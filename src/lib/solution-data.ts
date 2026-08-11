/**
 * SolutionService type — shared interface for solution/service data.
 * Used across frontend components. Data comes from the Service DB model.
 */
export interface SolutionService {
  slug: string;
  titleJa: string;
  titleEn: string;
  heroImage: string;
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

  return {
    slug: db.slug as string,
    titleJa: (db.nameJa as string) || "",
    titleEn: (db.name as string) || "",
    heroImage: (db.heroImage as string) || "",
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
