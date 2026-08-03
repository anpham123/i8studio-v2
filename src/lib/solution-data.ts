/**
 * SolutionService type — shared interface for solution/service data.
 * Used across frontend components. Data comes from the Service DB model.
 */
export interface SolutionService {
  slug: string;
  titleJa: string;
  titleEn: string;
  heroTaglineJa: string;
  heroTaglineEn: string;
  heroDescJa: string;
  heroDescEn: string;
  features: {
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
    image: string;
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
    heroTaglineJa: (db.heroTaglineJa as string) || "",
    heroTaglineEn: (db.heroTaglineEn as string) || "",
    heroDescJa: (db.heroDescJa as string) || "",
    heroDescEn: (db.heroDescEn as string) || "",
    features,
    process,
    plans,
  };
}
