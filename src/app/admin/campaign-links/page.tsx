"use client";

import { useState, useEffect, useMemo } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Link2,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sparkles,
  HelpCircle,
  Share2,
} from "lucide-react";
import type { CampaignLinkItem } from "@/app/api/campaign-links/route";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: "📸", defaultMedium: "social" },
  { id: "tiktok", name: "TikTok", icon: "🎵", defaultMedium: "social" },
  { id: "facebook", name: "Facebook", icon: "📘", defaultMedium: "social" },
  { id: "youtube", name: "YouTube", icon: "▶️", defaultMedium: "social" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", defaultMedium: "social" },
  { id: "x", name: "X (Twitter)", icon: "✖️", defaultMedium: "social" },
  { id: "threads", name: "Threads", icon: "🧵", defaultMedium: "social" },
  { id: "zalo", name: "Zalo", icon: "💬", defaultMedium: "chat" },
  { id: "google", name: "Google Ads / SEO", icon: "🔍", defaultMedium: "cpc" },
  { id: "other", name: "Nền tảng khác", icon: "🌐", defaultMedium: "referral" },
];

const CHANNEL_PRESETS = [
  { id: "main", label: "Kênh chính (Main)", campaignSuffix: "bio_link" },
  { id: "sub1", label: "Kênh phụ 1 (Sub 1)", campaignSuffix: "sub1_bio" },
  { id: "sub2", label: "Kênh phụ 2 (Sub 2)", campaignSuffix: "sub2_bio" },
  { id: "sub3", label: "Kênh phụ 3 (Sub 3)", campaignSuffix: "sub3_bio" },
  { id: "custom", label: "Tự đặt tên chiến dịch", campaignSuffix: "" },
];

const PLACEMENTS = [
  { id: "bio", label: "Tiểu sử (Bio link)", medium: "social" },
  { id: "story", label: "Tin Story / Reels", medium: "story" },
  { id: "post", label: "Bài đăng (Post)", medium: "social_post" },
  { id: "video", label: "Mô tả Video", medium: "video_desc" },
  { id: "dm", label: "Tin nhắn tư vấn (DM)", medium: "direct_message" },
  { id: "ads", label: "Quảng cáo trả phí (Ads)", medium: "cpc" },
];

const DESTINATIONS = [
  { path: "/ja", label: "🇯🇵 Trang chủ website i8 tiếng Nhật (/ja) — Mặc định", badge: "Khuyên dùng" },
  { path: "/", label: "🌐 Trang chủ website i8 (/)" },
  { path: "/ja/landingpage", label: "📄 Landing Page kiến trúc 3D (/ja/landingpage)" },
  { path: "/ja/price", label: "🇯🇵 Bảng giá dịch vụ tiếng Nhật (/ja/price)" },
  { path: "/ja/about-us/portfolio", label: "🇯🇵 Portfolio công trình tiếng Nhật (/ja/portfolio)" },
  { path: "/ja/about-us/workflow", label: "🇯🇵 Quy trình 5 bước tiếng Nhật (/ja/workflow)" },
  { path: "/ja/contact", label: "🇯🇵 Form liên hệ tiếng Nhật (/ja/contact)" },
  { path: "/en", label: "🇬🇧 Trang chủ tiếng Anh (/en)" },
  { path: "custom", label: "🔗 Tự nhập đường dẫn khác..." },
];

export default function CampaignLinksPage() {
  const { toast } = useToast();
  const [links, setLinks] = useState<CampaignLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterPlatform, setSelectedFilterPlatform] = useState("all");

  // Form states
  const [platform, setPlatform] = useState("instagram");
  const [channelType, setChannelType] = useState("sub1");
  const [customCampaign, setCustomCampaign] = useState("");
  const [channelName, setChannelName] = useState("");
  const [placement, setPlacement] = useState("bio");
  const [targetPage, setTargetPage] = useState("/ja");
  const [customTargetPage, setCustomTargetPage] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Determine base domain
  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        return "https://i8studio.vn";
      }
      return window.location.origin;
    }
    return "https://i8studio.vn";
  }, []);

  // Compute live UTM link
  const generatedUrl = useMemo(() => {
    let resolvedPage = targetPage === "custom" ? customTargetPage.trim() : targetPage;
    if (!resolvedPage.startsWith("/")) resolvedPage = `/${resolvedPage}`;

    const params = new URLSearchParams();
    params.set("utm_source", platform);

    // Medium
    const activePlacement = PLACEMENTS.find((p) => p.id === placement);
    params.set("utm_medium", activePlacement ? activePlacement.medium : "social");

    // Campaign
    let campaignVal = "";
    if (channelType === "custom") {
      campaignVal = customCampaign.trim().toLowerCase().replace(/\s+/g, "_");
      if (!campaignVal) campaignVal = "custom_campaign";
    } else {
      const preset = CHANNEL_PRESETS.find((p) => p.id === channelType);
      campaignVal = preset?.campaignSuffix || "channel_link";
    }
    params.set("utm_campaign", campaignVal);

    return `${baseUrl}${resolvedPage}?${params.toString()}`;
  }, [baseUrl, targetPage, customTargetPage, platform, placement, channelType, customCampaign]);

  // Load saved links
  useEffect(() => {
    fetch("/api/campaign-links")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setLinks(data.data);
        }
      })
      .catch((err) => console.error("Error loading links:", err))
      .finally(() => setLoading(false));
  }, []);

  // Copy helper
  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast("Đã sao chép đường link vào bộ nhớ tạm!", "success");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Save new link
  const handleSaveLink = async () => {
    try {
      setSaving(true);
      const activePlatformObj = PLATFORMS.find((p) => p.id === platform);
      const activePreset = CHANNEL_PRESETS.find((p) => p.id === channelType);

      let finalName = channelName.trim();
      if (!finalName) {
        finalName = `${activePlatformObj?.name || platform} ${activePreset?.label || ""}`;
      }

      const activePlacement = PLACEMENTS.find((p) => p.id === placement);
      let campaignVal = channelType === "custom"
        ? customCampaign.trim().toLowerCase().replace(/\s+/g, "_") || "custom_campaign"
        : activePreset?.campaignSuffix || "channel_link";

      const payload = {
        name: finalName,
        platform,
        campaign: campaignVal,
        medium: activePlacement ? activePlacement.medium : "social",
        targetPage: targetPage === "custom" ? customTargetPage : targetPage,
        fullUrl: generatedUrl,
        notes: notes.trim(),
      };

      const res = await fetch("/api/campaign-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setLinks(json.data);
        toast("Đã lưu link kênh vào danh sách thành công!", "success");
        setChannelName("");
        setNotes("");
      } else {
        toast(json.error || "Không thể lưu link", "error");
      }
    } catch (e: any) {
      toast(e.message || "Đã xảy ra lỗi khi lưu", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete link
  const handleDeleteLink = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa link "${name}"?`)) return;

    try {
      const res = await fetch("/api/campaign-links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setLinks(json.data);
        toast("Đã xóa link thành công", "success");
      }
    } catch {
      toast("Lỗi khi xóa link", "error");
    }
  };

  // Filter links
  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.campaign.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform =
        selectedFilterPlatform === "all" || item.platform === selectedFilterPlatform;

      return matchesSearch && matchesPlatform;
    });
  }, [links, searchQuery, selectedFilterPlatform]);

  return (
    <AdminShell
      title="Tạo Link Kênh & UTM Tracking"
    >
      <div className="space-y-6">

        {/* =========================================================================
            CẢNH BÁO QUAN TRỌNG: HƯỚNG DẪN TRÁNH LỖI INSTAGRAM LINK SHIM
            ========================================================================= */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
            <p className="font-bold text-amber-950">
              Lưu ý quan trọng khi dán link vào Bio Instagram (Tránh lỗi bị chặn):
            </p>
            <p>
              Tuyệt đối <strong>không copy link trực tiếp từ trang cá nhân Instagram</strong> của kênh khác vì Instagram sẽ tự động bọc mã <code className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono">l.instagram.com</code> khiến Instagram chặn không cho lưu.
            </p>
            <p>
              👉 <strong>Cách làm đúng:</strong> Chỉ cần bấm nút <strong>&ldquo;Sao chép Link&rdquo;</strong> được tạo tự động bên dưới và dán trực tiếp vào mục <strong>Trang web (Website/Links)</strong> trong phần <em>Chỉnh sửa trang cá nhân (Edit Profile)</em> của ứng dụng Instagram.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BỘ CÔNG CỤ TỰ LẬP TẠO LINK (GENERATOR CARD)
            ========================================================================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Tạo Link Theo Dõi Cho Kênh Mới</h3>
                <p className="text-xs text-gray-500">Chọn nền tảng và loại kênh, link chuẩn UTM sẽ tự động tạo ngay tức thì</p>
              </div>
            </div>
            <span className="text-[11px] bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full border border-green-200">
              Tự động hóa 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Nền tảng */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Chọn Nền tảng truyền thông
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PLATFORMS.map((p) => {
                  const isSelected = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-sm">{p.icon}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Loại kênh */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. Kênh chính hay Kênh phụ?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CHANNEL_PRESETS.map((cp) => {
                  const isSelected = channelType === cp.id;
                  return (
                    <button
                      key={cp.id}
                      type="button"
                      onClick={() => setChannelType(cp.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {cp.label}
                    </button>
                  );
                })}
              </div>

              {channelType === "custom" && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={customCampaign}
                    onChange={(e) => setCustomCampaign(e.target.value)}
                    placeholder="Nhập mã kênh (vd: ins_design_phu, tiktok_kenh3...)"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Hệ thống sẽ tự viết thường và thay dấu cách bằng gạch dưới</p>
                </div>
              )}
            </div>

            {/* 3. Vị trí đặt link */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                3. Vị trí đặt link trên kênh
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-gray-800"
              >
                {PLACEMENTS.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Trang đích */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                4. Trang đích (Khách click sẽ mở trang nào)
              </label>
              <select
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-gray-800"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.path} value={d.path}>
                    {d.label} {d.badge ? `★ [${d.badge}]` : ""}
                  </option>
                ))}
              </select>

              {targetPage === "custom" && (
                <input
                  type="text"
                  value={customTargetPage}
                  onChange={(e) => setCustomTargetPage(e.target.value)}
                  placeholder="Nhập đường dẫn trang đích (vd: /ja/news/bai-viet-moi)"
                  className="mt-2 w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              )}
            </div>

            {/* Tên gợi nhớ & Ghi chú */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Tên gợi nhớ cho kênh (tùy chọn)
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="vd: Instagram Phụ 2 - Quản lý bởi Trang"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Ghi chú mục đích / người tạo (tùy chọn)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="vd: Tạo ngày 28/09 để gắn bio nick phụ review"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              KẾT QUẢ LINK TẠO TỰ ĐỘNG (OUTPUT CARD)
              ========================================================================= */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Đường link hoàn chỉnh sẵn sàng sử dụng:</span>
              </span>
              <span className="text-[10px] text-green-400 bg-green-950/60 border border-green-800/60 px-2 py-0.5 rounded-full font-mono">
                Đã chuẩn hóa UTM
              </span>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs sm:text-sm font-mono text-blue-300 break-all select-all leading-relaxed">
              {generatedUrl}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(generatedUrl, "generator")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  copiedId === "generator"
                    ? "bg-green-500 text-white scale-95"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {copiedId === "generator" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Đã sao chép Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao chép Link (Gửi cho khách/team)</span>
                  </>
                )}
              </button>

              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở thử trang</span>
              </a>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveLink}
                className="ml-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? "Đang lưu..." : "Lưu vào danh sách kênh"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DANH SÁCH CÁC KÊNH ĐÃ TẠO (MANAGEMENT TABLE)
            ========================================================================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span>
                <span>Danh Sách Link Kênh Đang Quản Lý ({links.length})</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Các link đã lưu để team copy dùng lại bất cứ khi nào, không cần tạo mới
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm link, tên kênh..."
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 w-44"
                />
              </div>

              <select
                value={selectedFilterPlatform}
                onChange={(e) => setSelectedFilterPlatform(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả nền tảng</option>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Đang tải danh sách link...</div>
          ) : filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">Không tìm thấy link nào phù hợp.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredLinks.map((item) => {
                const isCopied = copiedId === item.id;
                const platformObj = PLATFORMS.find((p) => p.id === item.platform);

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 hover:border-blue-300 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between transition-all group hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 truncate">
                          <span>{platformObj?.icon || "🔗"}</span>
                          <span>{item.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(item.id, item.name)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-1 rounded"
                          title="Xóa link này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                          {item.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-medium">
                          campaign: {item.campaign}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {item.targetPage}
                        </span>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-2 font-mono text-[11px] text-gray-600 break-all select-all">
                        {item.fullUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.fullUrl, item.id)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          isCopied
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-white text-gray-600 hover:text-blue-600 transition-all"
                        title="Mở kiểm tra link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AdminShell>
  );
}
