import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export interface CampaignLinkItem {
  id: string;
  name: string;             // Ví dụ: Instagram Phụ 1 (@i8_phu)
  platform: string;         // instagram, tiktok, facebook, youtube, linkedin, x, etc.
  campaign: string;         // ins_phu_1
  medium: string;           // social, bio_link, video_desc, etc.
  targetPage: string;       // /ja/landingpage, /ja, etc.
  fullUrl: string;          // https://i8studio.vn/ja/landingpage?utm_source=...
  notes?: string;           // Ghi chú kênh / người phụ trách
  createdAt: string;
}

const DEFAULT_LINKS: CampaignLinkItem[] = [
  {
    id: "default-ig-main",
    name: "Instagram Chính (@i8studio_cg)",
    platform: "instagram",
    campaign: "bio_link",
    medium: "social",
    targetPage: "/ja",
    fullUrl: "https://i8studio.vn/ja?utm_source=instagram&utm_medium=social&utm_campaign=bio_link",
    notes: "Kênh Instagram chính thức - gắn link Bio vào web i8 tiếng Nhật",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-ig-sub1",
    name: "Instagram Phụ 1 (Sub-channel 1)",
    platform: "instagram",
    campaign: "sub1_bio",
    medium: "social",
    targetPage: "/ja",
    fullUrl: "https://i8studio.vn/ja?utm_source=instagram&utm_medium=social&utm_campaign=sub1_bio",
    notes: "Kênh phụ 1 - gắn link Bio vào web i8 tiếng Nhật",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-ig-sub2",
    name: "Instagram Phụ 2 (Sub-channel 2)",
    platform: "instagram",
    campaign: "sub2_bio",
    medium: "social",
    targetPage: "/ja",
    fullUrl: "https://i8studio.vn/ja?utm_source=instagram&utm_medium=social&utm_campaign=sub2_bio",
    notes: "Kênh phụ 2 - gắn link Bio vào web i8 tiếng Nhật",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-yt-main",
    name: "YouTube Chính (@i8studio)",
    platform: "youtube",
    campaign: "channel_bio",
    medium: "social",
    targetPage: "/",
    fullUrl: "https://i8studio.vn/?utm_source=youtube&utm_medium=social&utm_campaign=channel_bio",
    notes: "Kênh YouTube chính thức - Mô tả video / Kênh",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-fb-main",
    name: "Facebook Fanpage (/i8studio.vn)",
    platform: "facebook",
    campaign: "fanpage_bio",
    medium: "social",
    targetPage: "/",
    fullUrl: "https://i8studio.vn/?utm_source=facebook&utm_medium=social&utm_campaign=fanpage_bio",
    notes: "Fanpage Facebook chính thức",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-tiktok-main",
    name: "TikTok (@i8studio)",
    platform: "tiktok",
    campaign: "bio_link",
    medium: "social",
    targetPage: "/ja",
    fullUrl: "https://i8studio.vn/ja?utm_source=tiktok&utm_medium=social&utm_campaign=bio_link",
    notes: "Kênh TikTok chính - gắn link Bio",
    createdAt: new Date().toISOString(),
  },
];

const SETTING_KEY = "campaign_tracking_links";

export async function GET() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (!record || !record.value) {
      return NextResponse.json({ data: DEFAULT_LINKS });
    }

    const parsed = JSON.parse(record.value);
    return NextResponse.json({ data: Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LINKS });
  } catch (error) {
    console.error("Error fetching campaign links:", error);
    return NextResponse.json({ data: DEFAULT_LINKS });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newLink: Omit<CampaignLinkItem, "id" | "createdAt"> = await req.json();

    const record = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    let list: CampaignLinkItem[] = [];
    if (record && record.value) {
      try {
        list = JSON.parse(record.value);
      } catch {
        list = [...DEFAULT_LINKS];
      }
    } else {
      list = [...DEFAULT_LINKS];
    }

    const createdItem: CampaignLinkItem = {
      ...newLink,
      id: "link-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };

    // Thêm link mới vào đầu danh sách
    const updatedList = [createdItem, ...list.filter((l) => l.campaign !== createdItem.campaign || l.platform !== createdItem.platform)];

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: JSON.stringify(updatedList) },
      create: { key: SETTING_KEY, value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, data: updatedList });
  } catch (error: any) {
    console.error("Error saving campaign link:", error);
    return NextResponse.json({ error: error?.message || "Failed to save link" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    const record = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (!record || !record.value) {
      return NextResponse.json({ success: true, data: [] });
    }

    const list: CampaignLinkItem[] = JSON.parse(record.value);
    const updatedList = list.filter((item) => item.id !== id);

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: JSON.stringify(updatedList) },
      create: { key: SETTING_KEY, value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, data: updatedList });
  } catch (error: any) {
    console.error("Error deleting campaign link:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete link" }, { status: 500 });
  }
}
