import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import FadeIn from "@/components/public/FadeIn";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) return {};

  const name = params.locale === "ja" ? service.nameJa || service.name : service.name;
  const description =
    params.locale === "ja"
      ? service.descriptionJa || service.description
      : service.description;

  return buildMetadata({
    title: name,
    description: description || name,
    path: `/service/${service.slug}`,
    locale: params.locale,
    image: service.image || undefined,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const name = locale === "ja" ? service.nameJa || service.name : service.name;
  const description =
    locale === "ja" ? service.descriptionJa || service.description : service.description;
  const priceHint =
    locale === "ja" ? service.priceHintJa || service.priceHint : service.priceHint;

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <Link
            href={`/${locale}/service`}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
          >
            ← All Services
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              {service.image ? (
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={name}
                    className="w-full h-80 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 h-80 flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-bold">{name[0]}</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{name}</h1>
              {priceHint && (
                <p className="text-blue-400 font-semibold text-lg mb-4">{priceHint}</p>
              )}
              <p className="text-white/60 leading-relaxed text-lg mb-8">{description}</p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
