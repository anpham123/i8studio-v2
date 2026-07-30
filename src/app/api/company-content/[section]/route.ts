import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { section: string } }) {
  const item = await prisma.companyContent.findUnique({ where: { section: params.section } });
  if (!item) return NextResponse.json({ data: { section: params.section, contentJson: "{}" } });
  return NextResponse.json({ data: item });
}

export async function PUT(req: NextRequest, { params }: { params: { section: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const item = await prisma.companyContent.upsert({
      where: { section: params.section },
      update: { contentJson: body.contentJson || "{}" },
      create: { section: params.section, contentJson: body.contentJson || "{}" },
    });
    return NextResponse.json({ data: item });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
