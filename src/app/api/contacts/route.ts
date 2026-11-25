import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sendContactAutoReplyEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic"

const schema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  service: z.string().max(100).optional().default(""),
  hearAboutUs: z.string().max(100).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  message: z.string().min(1).max(5000),
  locale: z.string().max(10).optional().default("ja"),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const readFilter = searchParams.get("read"); // "true" | "false" | null

    const where = {
      ...(search && {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
        ],
      }),
      ...(readFilter === "true" && { read: true }),
      ...(readFilter === "false" && { read: false }),
    };

    const [data, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ]);
    return NextResponse.json({ data, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit contact form submissions
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`contacts:${ip}`, RATE_LIMITS.FORM_SUBMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const { locale, ...contactData } = parsed;
    const contact = await prisma.contactSubmission.create({ data: contactData });

    // Automatically send confirmation email from info@i8studio.vn to the user's email
    const mailResult = await sendContactAutoReplyEmail({
      fullName: contactData.fullName,
      email: contactData.email,
      service: contactData.service,
      message: contactData.message,
      hearAboutUs: contactData.hearAboutUs,
      locale,
      ip,
      createdAt: contact.createdAt,
    });

    return NextResponse.json(
      { data: contact, autoReplySent: mailResult.sent },
      { status: 201 }
    );
  } catch (e) {
    console.error("CONTACT SUBMISSION ERROR:", e);
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
