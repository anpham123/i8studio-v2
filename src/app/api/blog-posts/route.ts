import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostSchema } from "@/lib/validations";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const locale = searchParams.get("locale") || "";
  const published = searchParams.get("published");

  const where = {
    ...(locale && { locale }),
    ...(published === "true" && { isPublished: true }),
  };

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.slug && body.title) body.slug = slugify(body.title);
    const data = BlogPostSchema.parse(body);
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
