import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://i8studio.vn";
const SITE_NAME = "i8 STUDIO";
const DEFAULT_DESCRIPTION =
  "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export function getSiteUrl() {
  return SITE_URL;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  locale,
  image,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  locale: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ja: `${SITE_URL}/ja${path}`,
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "i8 STUDIO",
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.jpg`,
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
    sameAs: [] as string[],
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

export function articleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl ?? DEFAULT_OG_IMAGE,
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
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-default.jpg` },
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
