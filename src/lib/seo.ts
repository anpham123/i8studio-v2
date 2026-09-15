import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://i8studio.vn";
const SITE_NAME = "i8 STUDIO";
const DEFAULT_DESCRIPTION =
  "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/uploads/1787120036307-Cover16_240806_view03.webp`;

export function getSiteUrl() {
  return SITE_URL;
}

export function toAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  locale,
  image,
  images,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  locale: string;
  image?: string;
  images?: string[];
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  const imageList = (
    images && images.length > 0
      ? images
      : [image ?? DEFAULT_OG_IMAGE]
  ).map((img) => toAbsoluteUrl(img));

  const primaryImage = imageList[0] || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ja: `${SITE_URL}/ja${path}`,
        "x-default": `${SITE_URL}/ja${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: imageList.map((imgUrl) => ({
        url: imgUrl,
        width: 1200,
        height: 630,
        alt: title,
      })),
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [primaryImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "i8 STUDIO",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-default.jpg`,
      width: "1200",
      height: "630",
    },
    image: `${SITE_URL}/og-default.jpg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-914-049-090",
      contactType: "customer service",
      availableLanguage: ["Japanese", "English", "Vietnamese"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Da Nang",
      addressCountry: "VN",
    },
    foundingDate: "2019",
    sameAs: ["https://x.com/i8studio_3d"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "i8 STUDIO",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ["en", "ja"],
  };
}

export function webPageJsonLd({
  title,
  description,
  url,
  images = [],
}: {
  title: string;
  description: string;
  url: string;
  images?: string[];
}) {
  const absoluteImages = (images.length > 0 ? images : [DEFAULT_OG_IMAGE]).map(toAbsoluteUrl);
  const primary = absoluteImages[0];

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: toAbsoluteUrl(url),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: primary,
      width: "1200",
      height: "630",
    },
    image: absoluteImages,
  };
}

export function collectionPageJsonLd({
  title,
  description,
  url,
  items = [],
}: {
  title: string;
  description: string;
  url: string;
  items: Array<{ title: string; url: string; image?: string; description?: string }>;
}) {
  const absoluteUrl = toAbsoluteUrl(url);
  const itemImages = items.map((it) => it.image ? toAbsoluteUrl(it.image) : DEFAULT_OG_IMAGE);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: itemImages[0] || DEFAULT_OG_IMAGE,
    },
    image: itemImages.slice(0, 8),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.slice(0, 16).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(item.url),
        name: item.title,
        image: item.image ? toAbsoluteUrl(item.image) : undefined,
        description: item.description,
      })),
    },
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  imageUrl,
  images = [],
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  images?: string[];
  datePublished: string;
  dateModified: string;
}) {
  const imageList = (
    images.length > 0
      ? images
      : [imageUrl || DEFAULT_OG_IMAGE]
  ).filter(Boolean).map((img) => toAbsoluteUrl(img));

  const primaryImage = imageList[0] || toAbsoluteUrl(DEFAULT_OG_IMAGE);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": toAbsoluteUrl(url),
    },
    headline: title,
    description,
    url: toAbsoluteUrl(url),
    image: imageList,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: primaryImage,
      width: "1200",
      height: "630",
    },
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: "i8 STUDIO",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "i8 STUDIO",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.jpg`,
        width: "1200",
        height: "630",
      },
    },
  };
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
