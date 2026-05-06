import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = PostSchema.partial().parse(body);
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...data,
        publishedAt: data.publishedAt !== undefined
          ? (data.publishedAt ? new Date(data.publishedAt) : null)
          : undefined,
      },
    });
    return NextResponse.json({ data: post });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
