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
  type PricingTierItem,
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
    label: "02. Nỗi đau & Thách thức",
    subLabel: "4 Vấn đề trở ngại của gia chủ",
    description: "Nhấn mạnh những nỗi đau thực tế của khách hàng (ý tưởng không khớp, đội chi phí, trễ tiến độ, lệch vật liệu).",
    anchor: "#quy-trinh",
  },
  {
    key: "workflow",
    order: 3,
    label: "03. Quy trình 5 bước",
    subLabel: "Lộ trình kiểm soát tiến độ & thiết kế",
    description: "Quy trình làm việc 5 giai đoạn minh bạch từ tiếp nhận, concept 3D, kỹ thuật đến nghiệm thu bàn giao.",
    anchor: "#dich-vu",
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
    key: "clients",
    order: 6,
    label: "06. Đối tác & Uy tín",
    subLabel: "Cam kết tiêu chuẩn & niềm tin",
    description: "Các chứng chỉ, cam kết về độ chính xác thực tế, bảo hành bản vẽ và đồng hành cùng chủ nhà.",
    anchor: "#doi-tac",
  },
  {
    key: "applications",
    order: 7,
    label: "07. Ứng dụng thực tế",
    subLabel: "Giải pháp theo từng đối tượng kiến trúc",
    description: "Bộ lọc và các thẻ giải pháp ứng dụng thực tế (BĐS, KTS, Nhà thầu, Gia chủ, Khách sạn, Vật liệu).",
    anchor: "#ung-dung",
  },
  {
    key: "partners",
    order: 8,
    label: "08. Thương hiệu & Đối tác",
    subLabel: "Thống kê quy mô & Logo marquee",
    description: "4 Chỉ số quy mô phân khúc và dải logo thương hiệu đối tác chuyển động vô tận.",
    anchor: "#khach-hang",
  },
  {
    key: "gallery",
    order: 9,
    label: "09. Triển lãm dự án",
    subLabel: "Showcase các dự án thực tế tiêu biểu",
    description: "Tiêu đề triển lãm, danh mục tab bộ lọc kiến trúc (Villa, Townhouse, Penthouse, Resort, F&B) và thông điệp tương tác.",
    anchor: "#du-an",
  },
  {
    key: "pricing",
    order: 10,
    label: "10. Báo giá minh bạch",
    subLabel: "3 Gói dịch vụ & Cam kết thi công",
    description: "Bảng chi phí 3 gói kiến trúc, định mức đơn giá, cam kết thời gian hoàn thành và quyền lợi giám sát.",
    anchor: "#bao-gia",
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
    case "pricing":
      return {
        en: {
          info: {
            title: contentEn.pricing.title,
            sub: contentEn.pricing.sub,
          },
          tiers: getDefaultPricingTiers("en"),
        },
        ja: {
          info: {
            title: contentJa.pricing.title,
            sub: contentJa.pricing.sub,
          },
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
    const workflow = parseLang("workflow");
    const servicesBento = parseLang("services-bento");
    const deliverablesData = parseLang("deliverables");
    const clients = parseLang("clients");
    const applicationsData = parseLang("applications");
    const partnersData = parseLang("partners");
    const galleryData = parseLang("gallery");
    const pricing = parseLang("pricing");

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

    // Hợp nhất dữ liệu gallery projects (hỗ trợ cả projects lẫn spotlight)
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
    if (galleryData?.spotlight && typeof galleryData.spotlight === "object" && baseProjects["p-lakeside"]) {
      baseProjects["p-lakeside"] = {
        ...baseProjects["p-lakeside"],
        ...galleryData.spotlight,
      };
    }
    // Hợp nhất dữ liệu bảng giá (hỗ trợ cả mảng tiers động lẫn cấu trúc cũ tier1, tier2, tier3)
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

    return {
      t: {
        ...base,
        hero: hero ? { ...base.hero, ...hero } : base.hero,
        painPoints: painPoints ? { ...base.painPoints, ...painPoints } : base.painPoints,
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
        pricing: pricing ? { ...base.pricing, ...pricing, tiers: mergedPricingTiers } : { ...base.pricing, tiers: mergedPricingTiers },
      },
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
