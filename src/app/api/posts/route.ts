import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/validations";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const where = {
    ...(search && { title: { contains: search } }),
    ...(category && { category }),
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.slug && body.title) body.slug = slugify(body.title);
    const data = PostSchema.parse(body);
    const post = await prisma.post.create({
      data: {
        ...data,
        publishedAt: data.status === "PUBLISHED" && !data.publishedAt
          ? new Date()
          : data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
