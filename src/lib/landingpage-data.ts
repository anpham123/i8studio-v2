import {
  contentJa,
  contentEn,
  getGalleryProjectsData,
  getDeliverableCollections,
  getApplicationCards,
  getDefaultApplicationCategories,
  getDefaultPartnerStats,
  getDefaultPartnerBrands,
  getDefaultGalleryTabs,
  getDefaultPricingTiers,
  getDefaultSolutions,
  getDefaultPricingTypologies,
  getDefaultPricing3DServices,
  getDefaultPricingPrinciples,
  getDefaultPricingEstimator,
  type PricingTierItem,
  type SolutionItem,
  type PricingTypologyItem,
  type PricingService3DItem,
  type PricingPrincipleItem,
} from "@/app/[locale]/landingpage/landingI18n";
import { prisma } from "@/lib/prisma";

export interface SectionMeta {
  key: string;
  order: number;
  label: string;
  subLabel: string;
  description: string;
  anchor: string;
}

export const LANDING_SECTIONS: SectionMeta[] = [
  {
    key: "hero",
    order: 1,
    label: "01. Hero & Slogan",
    subLabel: "Mở đầu trang & Diễn họa 3D tương tác",
    description: "Tiêu đề ấn tượng, thông điệp định vị, mô tả ngắn, các nút kêu gọi hành động (CTA) và huy hiệu thành tích.",
    anchor: "#hero",
  },
  {
    key: "pain-points",
    order: 2,
    label: "02. Nỗi đau & Giải pháp Kontur",
    subLabel: "Thách thức thực tế & 4 Trụ cột giải pháp đột phá",
    description: "Nhấn mạnh nỗi đau thực tế của gia chủ và 4 giải pháp công nghệ 1:1, kiểm soát ngân sách & vật liệu của Kontur.",
    anchor: "#noi-dau-giai-phap",
  },
  {
    key: "workflow",
    order: 3,
    label: "03. Quy trình 5 bước",
    subLabel: "Lộ trình kiểm soát tiến độ & thiết kế",
    description: "Quy trình làm việc 5 giai đoạn minh bạch từ tiếp nhận, concept 3D, kỹ thuật đến nghiệm thu bàn giao.",
    anchor: "#quy-trinh-thuc-hien",
  },
  {
    key: "deliverables",
    order: 4,
    label: "04. Hồ sơ bàn giao",
    subLabel: "Chi tiết các bộ sưu tập hồ sơ kỹ thuật",
    description: "Tiêu đề, danh mục các bộ sưu tập bản vẽ chi tiết kỹ thuật bàn giao tới khách hàng.",
    anchor: "#bo-suu-tap",
  },
  {
    key: "services-bento",
    order: 5,
    label: "05. Trụ cột Bento",
    subLabel: "Các khối năng lực dịch vụ kiến trúc & 3D",
    description: "Bố cục lưới Bento gồm các trụ cột chính: Thiết kế kiến trúc, Diễn họa 3D 8K, Tối ưu công năng, Bóc tách dự toán.",
    anchor: "#dich-vu",
  },
  {
    key: "applications",
    order: 6,
    label: "06. Ứng dụng thực tế",
    subLabel: "Giải pháp theo từng đối tượng kiến trúc",
    description: "Bộ lọc và các thẻ giải pháp ứng dụng thực tế (BĐS, KTS, Nhà thầu, Gia chủ, Khách sạn, Vật liệu).",
    anchor: "#ung-dung-thuc-te",
  },
  {
    key: "partners",
    order: 7,
    label: "07. Thương hiệu & Đối tác",
    subLabel: "Thống kê quy mô & Logo marquee",
    description: "4 Chỉ số quy mô phân khúc và dải logo thương hiệu đối tác chuyển động vô tận.",
    anchor: "#khach-hang",
  },
  {
    key: "gallery",
    order: 8,
    label: "08. Triển lãm dự án",
    subLabel: "Showcase các dự án thực tế tiêu biểu",
    description: "Tiêu đề triển lãm, danh mục tab bộ lọc kiến trúc (Villa, Townhouse, Penthouse, Resort, F&B) và thông điệp tương tác.",
    anchor: "#du-an",
  },
  {
    key: "cta",
    order: 9,
    label: "09. Kêu gọi hành động (CTA)",
    subLabel: "Đăng ký tư vấn, hotline & bắt đầu dự án",
    description: "Tiêu đề kêu gọi, cam kết tư vấn 1-1 miễn phí, nút hành động, hotline và thông tin liên hệ.",
    anchor: "#dang-ky-tu-van",
  },
];

export function getDefaultSectionData(sectionKey: string): { en: any; ja: any } {
  switch (sectionKey) {
    case "hero":
      return {
        en: contentEn.hero,
        ja: contentJa.hero,
      };
    case "pain-points":
      return {
        en: contentEn.painPoints,
        ja: contentJa.painPoints,
      };
    case "solutions":
      return {
        en: contentEn.solutions || {
          eyebrow: "// KONTUR ARCHITECTURAL SOLUTIONS",
          title: "4 Breakthrough Solutions by Kontur to Eliminate Every Risk",
          sub: "Bridging architectural engineering precision with state-of-the-art 3DCG photorealism.",
          items: getDefaultSolutions("en"),
        },
        ja: contentJa.solutions || {
          eyebrow: "// KONTUR ARCHITECTURAL SOLUTIONS · 建築課題の根本解決",
          title: "課題を解決する、Konturの4つの革新的ソリューション",
          sub: "最先端の3DCG空間表現と厳格な建築設計基準を融合。",
          items: getDefaultSolutions("ja"),
        },
      };
    case "workflow":
      return {
        en: contentEn.workflow,
        ja: contentJa.workflow,
      };
    case "services-bento":
      return {
        en: contentEn.servicesBento,
        ja: contentJa.servicesBento,
      };
    case "deliverables":
      return {
        en: {
          info: contentEn.deliverables,
          collections: getDeliverableCollections("en"),
        },
        ja: {
          info: contentJa.deliverables,
          collections: getDeliverableCollections("ja"),
        },
      };
    case "clients":
      return {
        en: contentEn.clients,
        ja: contentJa.clients,
      };
    case "applications":
      return {
        en: {
          info: contentEn.applications,
          categories: getDefaultApplicationCategories("en"),
          cards: getApplicationCards("en"),
        },
        ja: {
          info: contentJa.applications,
          categories: getDefaultApplicationCategories("ja"),
          cards: getApplicationCards("ja"),
        },
      };
    case "partners":
      return {
        en: {
          info: contentEn.partners,
          stats: getDefaultPartnerStats("en"),
          brands: getDefaultPartnerBrands("en"),
        },
        ja: {
          info: contentJa.partners,
          stats: getDefaultPartnerStats("ja"),
          brands: getDefaultPartnerBrands("ja"),
        },
      };
    case "gallery":
      return {
        en: {
          info: {
            ...contentEn.gallery,
            filterTabs: getDefaultGalleryTabs("en"),
          },
          projects: getGalleryProjectsData("en"),
        },
        ja: {
          info: {
            ...contentJa.gallery,
            filterTabs: getDefaultGalleryTabs("ja"),
          },
          projects: getGalleryProjectsData("ja"),
        },
      };
    case "cta":
      return {
        en: contentEn.cta || {
          eyebrow: "// START YOUR PROJECT WITH ZERO RISK //",
          title: "Bringing Your Architectural Visions into Tangible Reality",
          sub: "Send us your project drawings or concept sketch. Our principal architects will deliver a precision 3D feasibility study and itemized estimate within 24 hours.",
          btnPrimary: "Request Free 3D Consultation",
          btnSecondary: "Call Us Now",
          hotline: "0984 384 190",
          email: "contact@kontur.vn",
          benefits: [
            "100% Free Initial Feasibility & Cost Estimate",
            "Rapid 24-Hour Consultation Turnaround",
            "Comprehensive NDA Protection for All Client Data",
            "Nationwide & International Project Capacity",
          ],
        },
        ja: contentJa.cta || {
          eyebrow: "// START YOUR PROJECT WITH ZERO RISK //",
          title: "理想の建築空間を、確かな精度で形にします",
          sub: "図面や構想スケッチをお送りいただくだけで、経験豊富な建築家が24時間以内に初期3D検証と詳細積算をご提案します。",
          btnPrimary: "無料相談・3Dシミュレーションを依頼する",
          btnSecondary: "電話で今すぐ相談する",
          hotline: "0984 384 190",
          email: "contact@kontur.vn",
          benefits: [
            "完全無料の初期ヒアリング & 概算見積り",
            "24時間以内のスピーディーな初期回答",
            "NDA（秘密保持契約）対応で情報厳守",
            "全国・海外プロジェクト対応可能",
          ],
        },
      };
    case "pricing":
      return {
        en: {
          info: {
            title: contentEn.pricing.title,
            sub: contentEn.pricing.sub,
            eyebrow: contentEn.pricing.eyebrow,
            note: contentEn.pricing.note,
          },
          typologies: getDefaultPricingTypologies("en"),
          services3d: getDefaultPricing3DServices("en"),
          estimator: getDefaultPricingEstimator("en"),
          principles: getDefaultPricingPrinciples("en"),
          tiers: getDefaultPricingTiers("en"),
        },
        ja: {
          info: {
            title: contentJa.pricing.title,
            sub: contentJa.pricing.sub,
            eyebrow: contentJa.pricing.eyebrow,
            note: contentJa.pricing.note,
          },
          typologies: getDefaultPricingTypologies("ja"),
          services3d: getDefaultPricing3DServices("ja"),
          estimator: getDefaultPricingEstimator("ja"),
          principles: getDefaultPricingPrinciples("ja"),
          tiers: getDefaultPricingTiers("ja"),
        },
      };
    default:
      return { en: {}, ja: {} };
  }
}

export async function getSectionData(sectionKey: string): Promise<{
  sectionKey: string;
  contentEn: any;
  contentJa: any;
  updatedAt?: string;
}> {
  const defaults = getDefaultSectionData(sectionKey);

  try {
    let item: any = null;
    if ("landingPageSection" in prisma) {
      item = await (prisma as any).landingPageSection.findUnique({
        where: { sectionKey },
      });
    } else {
      const rows: any = await (prisma as any).$queryRawUnsafe(
        "SELECT * FROM LandingPageSection WHERE sectionKey = ? LIMIT 1",
        sectionKey
      ).catch(() => []);
      item = rows[0] || null;
    }

    if (!item) {
      return {
        sectionKey,
        contentEn: defaults.en,
        contentJa: defaults.ja,
      };
    }

    let enData = defaults.en;
    let jaData = defaults.ja;

    try {
      if (item.contentEn && item.contentEn !== "{}") {
        enData = { ...defaults.en, ...JSON.parse(item.contentEn) };
      }
    } catch (e) {
      console.error(`Error parsing contentEn for ${sectionKey}:`, e);
    }

    try {
      if (item.contentJa && item.contentJa !== "{}") {
        jaData = { ...defaults.ja, ...JSON.parse(item.contentJa) };
      }
    } catch (e) {
      console.error(`Error parsing contentJa for ${sectionKey}:`, e);
    }

    return {
      sectionKey,
      contentEn: enData,
      contentJa: jaData,
      updatedAt: item.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch section ${sectionKey} from DB:`, error);
    return {
      sectionKey,
      contentEn: defaults.en,
      contentJa: defaults.ja,
    };
  }
}

export interface LandingLayoutConfig {
  order: string[];
  backgroundColors: Record<string, string>;
  visible: Record<string, boolean>;
}

export const DEFAULT_SECTION_ORDER: string[] = [
  "hero",
  "pain-points",
  "workflow",
  "deliverables",
  "services-bento",
  "applications",
  "partners",
  "gallery",
  "cta",
];

export const DEFAULT_SECTION_BG: Record<string, string> = {
  hero: "#07080a",
  "pain-points": "#fdfcf9",
  workflow: "radial-gradient(circle at 50% 30%, #fcfbf9 0%, #f5f0e8 60%, #ece5da 100%)",
  deliverables: "radial-gradient(circle at 50% 30%, #fdfcf9 0%, #f7f4ed 60%, #eee8de 100%)",
  "services-bento": "radial-gradient(circle at 50% 10%, #ffffff 0%, #f9f7f4 60%, #f4f0e8 100%)",
  applications: "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
  partners: "linear-gradient(180deg, #f7f4ee 0%, #ede7dc 100%)",
  gallery: "#07080a",
  cta: "radial-gradient(circle at 50% 30%, #fcfbf9 0%, #f5f0e8 60%, #ece5da 100%)",
};

export const DEFAULT_SECTION_VISIBLE: Record<string, boolean> = {
  hero: true,
  "pain-points": true,
  workflow: true,
  deliverables: true,
  "services-bento": true,
  applications: true,
  partners: true,
  gallery: true,
  cta: true,
};

export async function getLandingLayoutConfig(): Promise<LandingLayoutConfig> {
  try {
    let item: any = null;
    if ("landingPageSection" in prisma) {
      item = await (prisma as any).landingPageSection.findUnique({
        where: { sectionKey: "_layout_settings" },
      });
    } else {
      const rows: any = await (prisma as any).$queryRawUnsafe(
        "SELECT * FROM LandingPageSection WHERE sectionKey = '_layout_settings' LIMIT 1"
      ).catch(() => []);
      item = rows[0] || null;
    }

    if (!item) {
      return {
        order: [...DEFAULT_SECTION_ORDER],
        backgroundColors: { ...DEFAULT_SECTION_BG },
        visible: { ...DEFAULT_SECTION_VISIBLE },
      };
    }

    const raw = item.contentJa || item.contentEn || "{}";
    const parsed = JSON.parse(raw);
    const rawOrder: string[] = Array.isArray(parsed.order) && parsed.order.length > 0
      ? parsed.order
      : [...DEFAULT_SECTION_ORDER];

    // Filter out obsolete keys like standalone 'solutions' (merged into pain-points)
    const validKeys = new Set(DEFAULT_SECTION_ORDER);
    const order: string[] = rawOrder.filter((k) => validKeys.has(k));

    // Ensure all current DEFAULT_SECTION_ORDER items exist in order
    DEFAULT_SECTION_ORDER.forEach((key) => {
      if (!order.includes(key)) {
        order.push(key);
      }
    });

    return {
      order,
      backgroundColors: { ...DEFAULT_SECTION_BG, ...(parsed.backgroundColors || {}) },
      visible: { ...DEFAULT_SECTION_VISIBLE, ...(parsed.visible || {}) },
    };
  } catch (error) {
    console.error("Error loading landing layout config:", error);
    return {
      order: [...DEFAULT_SECTION_ORDER],
      backgroundColors: { ...DEFAULT_SECTION_BG },
      visible: { ...DEFAULT_SECTION_VISIBLE },
    };
  }
}

export async function saveLandingLayoutConfig(config: Partial<LandingLayoutConfig>) {
  const current = await getLandingLayoutConfig();
  const nextConfig: LandingLayoutConfig = {
    order: Array.isArray(config.order) && config.order.length > 0 ? config.order : current.order,
    backgroundColors: { ...current.backgroundColors, ...(config.backgroundColors || {}) },
    visible: { ...current.visible, ...(config.visible || {}) },
  };

  const jsonStr = JSON.stringify(nextConfig);

  if ("landingPageSection" in prisma) {
    await (prisma as any).landingPageSection.upsert({
      where: { sectionKey: "_layout_settings" },
      update: { contentEn: jsonStr, contentJa: jsonStr },
      create: { sectionKey: "_layout_settings", contentEn: jsonStr, contentJa: jsonStr },
    });
  } else {
    const now = new Date().toISOString();
    const existing: any = await (prisma as any).$queryRawUnsafe(
      "SELECT id FROM LandingPageSection WHERE sectionKey = '_layout_settings' LIMIT 1"
    ).catch(() => []);

    if (existing && existing.length > 0) {
      await (prisma as any).$executeRawUnsafe(
        "UPDATE LandingPageSection SET contentEn = ?, contentJa = ?, updatedAt = ? WHERE sectionKey = '_layout_settings'",
        jsonStr, jsonStr, now
      );
    } else {
      const id = `lps_layout_${Date.now()}`;
      await (prisma as any).$executeRawUnsafe(
        "INSERT INTO LandingPageSection (id, sectionKey, contentEn, contentJa, createdAt, updatedAt) VALUES (?, '_layout_settings', ?, ?, ?, ?)",
        id, jsonStr, jsonStr, now, now
      );
    }
  }

  return nextConfig;
}

export async function getAllSectionsData(locale: string = "ja") {
  const isEn = locale === "en";
  const result: Record<string, any> = {};

  for (const s of LANDING_SECTIONS) {
    const data = await getSectionData(s.key);
    result[s.key] = isEn ? data.contentEn : data.contentJa;
  }

  return result;
}

export async function getMergedLandingContent(locale: string = "ja"): Promise<{
  t: import("@/app/[locale]/landingpage/landingI18n").LandingContent;
  layoutConfig: LandingLayoutConfig;
  galleryProjects: Record<string, import("@/app/[locale]/landingpage/landingI18n").GalleryProject>;
  deliverableCollections: any[];
  applicationCards: import("@/app/[locale]/landingpage/landingI18n").ApplicationCard[];
  applicationCategories: import("@/app/[locale]/landingpage/landingI18n").ApplicationCategoryItem[];
  partnerStats: import("@/app/[locale]/landingpage/landingI18n").PartnerStatCard[];
  partnerBrands: import("@/app/[locale]/landingpage/landingI18n").PartnerBrandItem[];
  galleryTabs: import("@/app/[locale]/landingpage/landingI18n").GalleryFilterTab[];
  pricingTiers: import("@/app/[locale]/landingpage/landingI18n").PricingTierItem[];
}> {
  const isEn = locale === "en";
  const { getLandingContent } = await import("@/app/[locale]/landingpage/landingI18n");
  const base = getLandingContent(locale);
  const galleryBase = getGalleryProjectsData(locale);
  const deliverablesBase = getDeliverableCollections(locale);

  try {
    const layoutConfig = await getLandingLayoutConfig();

    let dbSections: any[] = [];
    if ("landingPageSection" in prisma) {
      dbSections = await (prisma as any).landingPageSection.findMany();
    } else {
      dbSections = await (prisma as any).$queryRawUnsafe("SELECT * FROM LandingPageSection").catch(() => []) as any[];
    }

    const map = new Map(dbSections.map((s) => [s.sectionKey, s]));

    const parseLang = (secKey: string) => {
      const item = map.get(secKey);
      if (!item) return null;
      try {
        const raw = isEn ? item.contentEn : item.contentJa;
        return raw && raw !== "{}" ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const hero = parseLang("hero");
    const painPoints = parseLang("pain-points");
    const solutions = parseLang("solutions");
    const workflow = parseLang("workflow");
    const servicesBento = parseLang("services-bento");
    const deliverablesData = parseLang("deliverables");
    const clients = parseLang("clients");
    const applicationsData = parseLang("applications");
    const partnersData = parseLang("partners");
    const galleryData = parseLang("gallery");
    const pricing = parseLang("pricing");
    const ctaData = parseLang("cta");

    const mergedApplicationsCards =
      Array.isArray(applicationsData?.cards) && applicationsData.cards.length > 0
        ? applicationsData.cards
        : getApplicationCards(locale);

    const mergedApplicationCategories =
      Array.isArray(applicationsData?.categories) && applicationsData.categories.length > 0
        ? applicationsData.categories
        : getDefaultApplicationCategories(locale);

    const mergedPartnerStats =
      Array.isArray(partnersData?.stats) && partnersData.stats.length > 0
        ? partnersData.stats
        : getDefaultPartnerStats(locale);

    const mergedPartnerBrands =
      Array.isArray(partnersData?.brands) && partnersData.brands.length > 0
        ? partnersData.brands
        : getDefaultPartnerBrands(locale);

    const mergedGalleryTabs =
      Array.isArray(galleryData?.info?.filterTabs) && galleryData.info.filterTabs.length > 0
        ? galleryData.info.filterTabs
        : (Array.isArray(galleryData?.filterTabs) && galleryData.filterTabs.length > 0
            ? galleryData.filterTabs
            : getDefaultGalleryTabs(locale));

    // Hợp nhất dữ liệu gallery projects
    let baseProjects: Record<string, any> = { ...galleryBase };
    if (galleryData?.projects && typeof galleryData.projects === "object") {
      if (Array.isArray(galleryData.projects)) {
        baseProjects = {};
        galleryData.projects.forEach((p: any) => {
          if (p?.id) baseProjects[p.id] = p;
        });
      } else if (Object.keys(galleryData.projects).length > 0) {
        baseProjects = { ...galleryData.projects };
      }
    }
    if (galleryData?.spotlight && typeof galleryData.spotlight === "object") {
      const spId = galleryData.spotlight.id || "p-lakeside";
      if (baseProjects[spId]) {
        baseProjects[spId] = {
          ...baseProjects[spId],
          ...galleryData.spotlight,
          priceValue: galleryData.spotlight.priceValue || baseProjects[spId].priceValue,
          priceEstimate: galleryData.spotlight.priceValue || galleryData.spotlight.priceEstimate || baseProjects[spId].priceEstimate,
        };
      }
      if (baseProjects["p-lakeside"]) {
        baseProjects["p-lakeside"] = {
          ...baseProjects["p-lakeside"],
          ...galleryData.spotlight,
          priceValue: galleryData.spotlight.priceValue || baseProjects["p-lakeside"].priceValue,
          priceEstimate: galleryData.spotlight.priceValue || galleryData.spotlight.priceEstimate || baseProjects["p-lakeside"].priceEstimate,
        };
      }
    }

    // Hợp nhất dữ liệu bảng giá tham khảo
    let mergedPricingTiers: PricingTierItem[] = getDefaultPricingTiers(locale);
    if (Array.isArray(pricing?.tiers) && pricing.tiers.length > 0) {
      mergedPricingTiers = pricing.tiers;
    } else if (pricing && typeof pricing === "object") {
      const dynamicTiers: PricingTierItem[] = [];
      Object.keys(pricing).forEach((k) => {
        if (k.startsWith("tier") && typeof pricing[k] === "object" && pricing[k] !== null) {
          dynamicTiers.push({ id: k, ...pricing[k] });
        }
      });
      if (dynamicTiers.length > 0) {
        mergedPricingTiers = dynamicTiers;
      }
    }

    const mergedTypologies =
      Array.isArray(pricing?.typologies) && pricing.typologies.length > 0
        ? pricing.typologies
        : getDefaultPricingTypologies(locale);

    const mergedServices3D =
      Array.isArray(pricing?.services3d) && pricing.services3d.length > 0
        ? pricing.services3d
        : getDefaultPricing3DServices(locale);

    const mergedEstimator = pricing?.estimator || getDefaultPricingEstimator(locale);

    const mergedPrinciples =
      Array.isArray(pricing?.principles) && pricing.principles.length > 0
        ? pricing.principles
        : getDefaultPricingPrinciples(locale);

    const mergedSolutionsItems =
      Array.isArray(painPoints?.solutionItems) && painPoints.solutionItems.length > 0
        ? painPoints.solutionItems
        : Array.isArray(solutions?.items) && solutions.items.length > 0
        ? solutions.items
        : getDefaultSolutions(locale);

    return {
      t: {
        ...base,
        hero: hero ? { ...base.hero, ...hero } : base.hero,
        painPoints: painPoints ? { ...base.painPoints, ...painPoints } : base.painPoints,
        solutions: {
          ...(base.solutions || {}),
          ...(solutions || {}),
          items: mergedSolutionsItems,
        },
        workflow: workflow ? { ...base.workflow, ...workflow } : base.workflow,
        servicesBento: servicesBento ? { ...base.servicesBento, ...servicesBento } : base.servicesBento,
        deliverables: deliverablesData?.info ? { ...base.deliverables, ...deliverablesData.info } : base.deliverables,
        clients: clients ? { ...base.clients, ...clients } : base.clients,
        applications: applicationsData?.info
          ? { ...base.applications, ...applicationsData.info, categories: mergedApplicationCategories, cards: mergedApplicationsCards }
          : { ...base.applications, categories: mergedApplicationCategories, cards: mergedApplicationsCards },
        partners: partnersData?.info
          ? { ...base.partners, ...partnersData.info, stats: mergedPartnerStats, brands: mergedPartnerBrands }
          : { ...base.partners, stats: mergedPartnerStats, brands: mergedPartnerBrands },
        gallery: galleryData?.info
          ? { ...base.gallery, ...galleryData.info, filterTabs: mergedGalleryTabs }
          : { ...base.gallery, filterTabs: mergedGalleryTabs },
        pricing: {
          ...base.pricing,
          ...(pricing || {}),
          typologies: mergedTypologies,
          services3d: mergedServices3D,
          estimator: mergedEstimator,
          principles: mergedPrinciples,
          tiers: mergedPricingTiers,
        },
        cta: ctaData ? { ...(base.cta || {}), ...ctaData } : base.cta,
      },
      layoutConfig,
      galleryProjects: baseProjects,
      galleryTabs: mergedGalleryTabs,
      pricingTiers: mergedPricingTiers,
      deliverableCollections:
        Array.isArray(deliverablesData?.collections) && deliverablesData.collections.length > 0
          ? deliverablesData.collections
          : deliverablesBase,
      applicationCards: mergedApplicationsCards,
      applicationCategories: mergedApplicationCategories,
      partnerStats: mergedPartnerStats,
      partnerBrands: mergedPartnerBrands,
    };
  } catch (e) {
    console.error("Error fetching merged landing content:", e);
    return {
      t: base,
      layoutConfig: {
        order: [...DEFAULT_SECTION_ORDER],
        backgroundColors: { ...DEFAULT_SECTION_BG },
        visible: { ...DEFAULT_SECTION_VISIBLE },
      },
      galleryProjects: galleryBase,
      galleryTabs: getDefaultGalleryTabs(locale),
      pricingTiers: getDefaultPricingTiers(locale),
      deliverableCollections: deliverablesBase,
      applicationCards: getApplicationCards(locale),
      applicationCategories: getDefaultApplicationCategories(locale),
      partnerStats: getDefaultPartnerStats(locale),
      partnerBrands: getDefaultPartnerBrands(locale),
    };
  }
}
