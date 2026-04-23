import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(1).max(500),
  titleJa: z.string().max(500).optional().default(""),
  slug: z.string().min(1).max(500),
  content: z.string().optional().default(""),
  contentJa: z.string().optional().default(""),
  excerpt: z.string().max(1000).optional().default(""),
  excerptJa: z.string().max(1000).optional().default(""),
  coverImage: z.string().optional().default(""),
  category: z.enum(["NEWS", "BLOG"]).default("NEWS"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  metaTitle: z.string().max(200).optional().default(""),
  metaDescription: z.string().max(500).optional().default(""),
  publishedAt: z.string().nullable().optional(),
});

export const WorkSchema = z.object({
  title: z.string().min(1).max(300),
  titleJa: z.string().max(300).optional().default(""),
  subtitle: z.string().max(300).optional().default(""),
  category: z.enum(["3DCG", "Animation", "VR", "BIM"]).default("3DCG"),
  image: z.string().optional().default(""),
  videoUrl: z.string().optional().default(""),
  order: z.number().int().optional().default(0),
  featured: z.boolean().optional().default(false),
});

export const ServiceSchema = z.object({
  name: z.string().min(1).max(200),
  nameJa: z.string().max(200).optional().default(""),
  slug: z.string().min(1).max(200),
  description: z.string().optional().default(""),
  descriptionJa: z.string().optional().default(""),
  icon: z.string().max(100).optional().default(""),
  image: z.string().optional().default(""),
  priceHint: z.string().max(200).optional().default(""),
  priceHintJa: z.string().max(200).optional().default(""),
  order: z.number().int().optional().default(0),
});

export const SlideSchema = z.object({
  title: z.string().min(1).max(300),
  titleJa: z.string().max(300).optional().default(""),
  subtitle: z.string().max(500).optional().default(""),
  subtitleJa: z.string().max(500).optional().default(""),
  image: z.string().optional().default(""),
  gradient: z.string().max(200).optional().default(""),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const QASchema = z.object({
  question: z.string().min(1).max(500),
  questionJa: z.string().max(500).optional().default(""),
  answer: z.string().min(1),
  answerJa: z.string().optional().default(""),
  order: z.number().int().optional().default(0),
});

export const TestimonialSchema = z.object({
  clientName: z.string().min(1).max(200),
  clientTitle: z.string().max(200).optional().default(""),
  clientCompany: z.string().max(200).optional().default(""),
  clientPhoto: z.string().optional().default(""),
  quote: z.string().min(1),
  quoteJa: z.string().optional().default(""),
  rating: z.number().int().min(1).max(5).optional().default(5),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const PartnerSchema = z.object({
  name: z.string().min(1).max(200),
  logo: z.string().optional().default(""),
  url: z.string().optional().default(""),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const CaseStudySchema = z.object({
  title: z.string().min(1).max(500),
  titleJa: z.string().max(500).optional().default(""),
  slug: z.string().min(1).max(500),
  client: z.string().max(200).optional().default(""),
  challenge: z.string().optional().default(""),
  challengeJa: z.string().optional().default(""),
  solution: z.string().optional().default(""),
  solutionJa: z.string().optional().default(""),
  result: z.string().optional().default(""),
  resultJa: z.string().optional().default(""),
  beforeImage: z.string().optional().default(""),
  afterImage: z.string().optional().default(""),
  metrics: z.string().optional().default("[]"),
  serviceType: z.string().max(100).optional().default(""),
  featured: z.boolean().optional().default(false),
});

export const FlipbookSchema = z.object({
  title: z.string().min(1).max(300),
  titleJa: z.string().max(300).optional().default(""),
  description: z.string().optional().default(""),
  descriptionJa: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  pdfUrl: z.string().min(1),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});
