"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  BarChart3, TrendingUp, Eye, Globe, ChevronLeft, ChevronRight,
  Loader2, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface DayData { date: string; count: number }
interface PageData { page: string; count: number }
interface ChannelData { key: string; name: string; icon: string; count: number; pct: number }

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function monthLabel(year: number, month: number) {
  const d = new Date(year, month);
  return d.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
}

function shortDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.getDate().toString();
}

/* ------------------------------------------------------------------ */
/*  Line Chart (pure SVG — no deps)                                    */
/* ------------------------------------------------------------------ */
function LineChart({ data, label }: { data: DayData[]; label: string }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[320px] text-gray-400 text-sm">
        Chưa có dữ liệu cho tháng này
      </div>
    );
  }

  const W = 900, H = 280;
  const PAD = { top: 30, right: 30, bottom: 50, left: 55 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  // Round up to nearest nice number
  const niceMax = Math.ceil(maxVal / 5) * 5 || 5;

  const x = (i: number) => PAD.left + (i / (data.length - 1 || 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH;

  const points = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const areaPath = `M${x(0)},${y(data[0].count)} ` +
    data.slice(1).map((d, i) => `L${x(i + 1)},${y(d.count)}`).join(" ") +
    ` L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  // Y-axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((niceMax / yTicks) * i));

  // X-axis: show ~8 labels max
  const step = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-[3px] rounded bg-blue-500" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Grid lines */}
        {yLabels.map((v) => (
          <g key={v}>
            <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)}
              stroke="#f0f0f0" strokeWidth={1} />
            <text x={PAD.left - 10} y={y(v) + 4} textAnchor="end"
              className="fill-gray-400" fontSize={11}>{v}</text>
          </g>
        ))}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.count)} r={4} fill="white"
              stroke="#3b82f6" strokeWidth={2} />
            {/* Tooltip-like label on hover (always visible for small sets) */}
            {data.length <= 15 && (
              <text x={x(i)} y={y(d.count) - 10} textAnchor="middle"
                className="fill-gray-600" fontSize={10} fontWeight={600}>{d.count}</text>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          i % step === 0 ? (
            <text key={i} x={x(i)} y={H - 10} textAnchor="middle"
              className="fill-gray-400" fontSize={11}>
              {shortDay(d.date)}
            </text>
          ) : null
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Campaign Link Generator Component                                  */
/* ------------------------------------------------------------------ */
function CampaignLinkBuilder() {
  const [targetPage, setTargetPage] = useState("/");
  const [platform, setPlatform] = useState("youtube");
  const [campaign, setCampaign] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const baseUrl = isLocalhost ? "https://i8studio.vn" : (typeof window !== "undefined" ? window.location.origin : "https://i8studio.vn");
  
  const fullUrl = useMemo(() => {
    let url = `${baseUrl}${targetPage}`;
    const params = new URLSearchParams();
    if (platform) params.set("utm_source", platform);
    params.set("utm_medium", platform === "youtube" ? "video_desc" : platform === "instagram" ? "social" : "social");
    const campaignVal = campaign.trim() ? campaign.trim().toLowerCase().replace(/\s+/g, "_") : (platform === "instagram" ? "bio_link" : "general");
    params.set("utm_campaign", campaignVal);
    return `${url}?${params.toString()}`;
  }, [baseUrl, targetPage, platform, campaign]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const officialChannels = [
    {
      key: "ytb",
      name: "YouTube (@i8studio)",
      accountUrl: "https://www.youtube.com/@i8studio",
      icon: "▶️",
      placement: "Dán vào Mô tả Video / Thông tin Kênh",
      trackingUrl: `${baseUrl}/?utm_source=youtube&utm_medium=social&utm_campaign=channel_bio`,
    },
    {
      key: "ig",
      name: "Instagram (@i8studio_cg)",
      accountUrl: "https://www.instagram.com/i8studio_cg/",
      icon: "📸",
      placement: "Dán vào Link Bio / Tin Story Instagram",
      trackingUrl: `${baseUrl}/ja?utm_source=instagram&utm_medium=social&utm_campaign=bio_link`,
    },
    {
      key: "fb",
      name: "Facebook (/i8studio.vn/)",
      accountUrl: "https://www.facebook.com/i8studio.vn/",
      icon: "📘",
      placement: "Dán vào Fanpage / Bài đăng Facebook",
      trackingUrl: `${baseUrl}/?utm_source=facebook&utm_medium=social&utm_campaign=fanpage_bio`,
    },
    {
      key: "li",
      name: "LinkedIn (/in/i8-studio/)",
      accountUrl: "https://www.linkedin.com/in/i8-studio/",
      icon: "💼",
      placement: "Dán vào Profile / Bài viết LinkedIn",
      trackingUrl: `${baseUrl}/?utm_source=linkedin&utm_medium=social&utm_campaign=company_bio`,
    },
    {
      key: "x",
      name: "X - Twitter (@i8studio_3d)",
      accountUrl: "https://x.com/i8studio_3d",
      icon: "✖️",
      placement: "Dán vào Tiểu sử Bio / Bài đăng trên X",
      trackingUrl: `${baseUrl}/ja?utm_source=x&utm_medium=social&utm_campaign=profile_bio`,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-md mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>🔗</span>
            <span>Link Đo Lường Sẵn Có Cho 5 Nền Tảng Chính Thức</span>
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Bấm &ldquo;Sao chép&rdquo; và dán trực tiếp vào phần tiểu sử (Bio), mô tả video hoặc bài viết của từng kênh tương ứng:
          </p>
        </div>
        <span className="text-[11px] bg-white/10 text-white/80 px-2.5 py-1 rounded-full">
          Chuẩn UTM Analytics
        </span>
      </div>

      {/* Preset official channel table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {officialChannels.map((item) => {
          const isCopied = copiedKey === item.key;
          return (
            <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <a
                    href={item.accountUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:underline shrink-0"
                  >
                    Xem kênh ↗
                  </a>
                </div>
                <p className="text-[11px] text-gray-400 mb-2">{item.placement}</p>
                <div className="bg-black/40 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-blue-300 truncate mb-3 border border-white/5">
                  {item.trackingUrl}
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyText(item.trackingUrl, item.key)}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isCopied
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                }`}
              >
                {isCopied ? "✓ Đã sao chép Link!" : "Sao chép Link"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom URL Builder dropdown toggle */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-1.5">
          <span>⚙️</span>
          <span>Tạo link tùy chỉnh cho các trang hoặc chiến dịch khác (Workflow, Portfolio, Báo giá...)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nền tảng</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
            >
              <option value="youtube" className="text-gray-900">▶️ YouTube</option>
              <option value="facebook" className="text-gray-900">📘 Facebook</option>
              <option value="instagram" className="text-gray-900">📸 Instagram</option>
              <option value="linkedin" className="text-gray-900">💼 LinkedIn</option>
              <option value="x" className="text-gray-900">✖️ X (Twitter)</option>
              <option value="tiktok" className="text-gray-900">🎵 TikTok</option>
              <option value="email" className="text-gray-900">📧 Email Newsletter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Trang đích</label>
            <select
              value={targetPage}
              onChange={(e) => setTargetPage(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
            >
              <option value="/" className="text-gray-900">Trang chủ (Home)</option>
              <option value="/ja" className="text-gray-900">Trang chủ tiếng Nhật (/ja)</option>
              <option value="/about-us/workflow" className="text-gray-900">Quy trình (Workflow)</option>
              <option value="/ja/about-us/workflow" className="text-gray-900">Quy trình tiếng Nhật (/ja/workflow)</option>
              <option value="/about-us/portfolio" className="text-gray-900">Portfolio</option>
              <option value="/works" className="text-gray-900">Dự án (Works)</option>
              <option value="/contact" className="text-gray-900">Liên hệ (Contact)</option>
              <option value="/price" className="text-gray-900">Bảng giá (Price)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Tên chiến dịch / bài đăng</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="vd: video_residence_01..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="w-full bg-transparent text-xs font-mono text-blue-300 px-2 outline-none select-all truncate"
          />
          <button
            type="button"
            onClick={() => copyText(fullUrl, "custom")}
            className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copiedKey === "custom"
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
            }`}
          >
            {copiedKey === "custom" ? "✓ Đã sao chép!" : "Sao chép Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [topPages, setTopPages] = useState<PageData[]>([]);
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  // Previous month for comparison
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const [prevTotal, setPrevTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const toDay = daysInMonth(year, month);
    const to = `${year}-${String(month + 1).padStart(2, "0")}-${String(toDay).padStart(2, "0")}T23:59:59`;

    // Previous month range
    const pFrom = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-01`;
    const pToDay = daysInMonth(prevYear, prevMonth);
    const pTo = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(pToDay).padStart(2, "0")}T23:59:59`;

    try {
      const [dailyRes, pagesRes, channelsRes, prevRes] = await Promise.all([
        fetch(`/api/analytics?type=pageview&groupBy=day&from=${from}&to=${to}`).then(r => r.json()),
        fetch(`/api/analytics?type=pageview&groupBy=page&from=${from}&to=${to}`).then(r => r.json()),
        fetch(`/api/analytics?type=pageview&groupBy=channel&from=${from}&to=${to}`).then(r => r.json()),
        fetch(`/api/analytics?type=pageview&groupBy=day&from=${pFrom}&to=${pTo}`).then(r => r.json()),
      ]);

      // Fill in missing days with 0
      const bucketMap: Record<string, number> = {};
      for (const d of (dailyRes.data || [])) {
        bucketMap[d.date] = d.count;
      }
      const filled: DayData[] = [];
      for (let day = 1; day <= toDay; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        filled.push({ date: dateStr, count: bucketMap[dateStr] || 0 });
      }

      setDailyData(filled);
      setTopPages(pagesRes.data || []);
      setChannels(channelsRes.data || []);
      setPrevTotal((prevRes.data || []).reduce((s: number, d: DayData) => s + d.count, 0));
    } catch {
      setDailyData([]);
      setTopPages([]);
      setChannels([]);
    }
    setLoading(false);
  }, [year, month, prevYear, prevMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalViews = useMemo(() => dailyData.reduce((s, d) => s + d.count, 0), [dailyData]);
  const avgPerDay = useMemo(() => {
    const activeDays = dailyData.filter(d => d.count > 0).length || 1;
    return Math.round(totalViews / activeDays);
  }, [dailyData, totalViews]);
  const peakDay = useMemo(() => {
    if (!dailyData.length) return { date: "-", count: 0 };
    return dailyData.reduce((max, d) => d.count > max.count ? d : max, dailyData[0]);
  }, [dailyData]);

  // % change from previous month
  const changePercent = prevTotal > 0
    ? Math.round(((totalViews - prevTotal) / prevTotal) * 100)
    : totalViews > 0 ? 100 : 0;

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goForward = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <AdminShell title="Thống kê truy cập">
      {/* Month / Year selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Prev button */}
          <button
            onClick={goBack}
            title="Tháng trước"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  Tháng {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
            >
              {Array.from({ length: now.getFullYear() - 2020 + 3 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={goForward}
            disabled={isCurrentMonth}
            title="Tháng sau"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>

          {/* Quick jump to current month */}
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setYear(now.getFullYear());
                setMonth(now.getMonth());
              }}
              className="px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-1"
            >
              Về tháng hiện tại
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BarChart3 size={15} className="text-blue-500" />
          <span>Đang xem báo cáo: <strong className="text-gray-800">Tháng {month + 1 < 10 ? `0${month + 1}` : month + 1}/{year}</strong></span>
        </div>
      </div>

      {/* Campaign URL Builder Tool */}
      <CampaignLinkBuilder />

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <>
          {/* Stats summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total views */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Eye size={20} />
                </div>
                {changePercent !== 0 && (
                  <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                    changePercent > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {changePercent > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(changePercent)}%
                  </div>
                )}
                {changePercent === 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full bg-gray-50 text-gray-500">
                    <Minus size={12} /> 0%
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Tổng lượt truy cập</div>
            </div>

            {/* Avg per day */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{avgPerDay.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Trung bình/ngày</div>
            </div>

            {/* Peak day */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BarChart3 size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{peakDay.count.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                Cao nhất ({peakDay.date !== "-" ? new Date(peakDay.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : "-"})
              </div>
            </div>

            {/* Prev month total */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Globe size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{prevTotal.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Tháng trước</div>
            </div>
          </div>

          {/* Traffic Channel Attribution Breakdown (Social Networks & Sources) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>📊</span>
                  <span>Lượng Truy Cập Theo Nền Tảng (Traffic Attribution by Social Channels)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Đo lường số lượng click từ Facebook, Instagram, LinkedIn, Twitter (X), YouTube, Google và các nguồn khác
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold">
                Tháng {month + 1}/{year}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {channels.map((ch) => {
                let cardBg = "bg-gray-50 border-gray-200 text-gray-900";
                let badgeStyle = "bg-gray-200 text-gray-700";

                if (ch.key === "facebook") {
                  cardBg = "bg-blue-50/70 border-blue-100 text-blue-900";
                  badgeStyle = "bg-blue-100 text-blue-700";
                } else if (ch.key === "instagram") {
                  cardBg = "bg-pink-50/70 border-pink-100 text-pink-900";
                  badgeStyle = "bg-pink-100 text-pink-700";
                } else if (ch.key === "linkedin") {
                  cardBg = "bg-sky-50/70 border-sky-100 text-sky-900";
                  badgeStyle = "bg-sky-100 text-sky-700";
                } else if (ch.key === "twitter") {
                  cardBg = "bg-neutral-50 border-neutral-200 text-neutral-900";
                  badgeStyle = "bg-neutral-200 text-neutral-800";
                } else if (ch.key === "youtube") {
                  cardBg = "bg-red-50/70 border-red-100 text-red-900";
                  badgeStyle = "bg-red-100 text-red-700";
                } else if (ch.key === "google") {
                  cardBg = "bg-emerald-50/70 border-emerald-100 text-emerald-900";
                  badgeStyle = "bg-emerald-100 text-emerald-700";
                } else if (ch.key === "direct") {
                  cardBg = "bg-indigo-50/70 border-indigo-100 text-indigo-900";
                  badgeStyle = "bg-indigo-100 text-indigo-700";
                }

                return (
                  <div
                    key={ch.key}
                    className={`rounded-xl p-4 border text-center transition-all hover:shadow-md ${cardBg}`}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                      <span className="text-lg">{ch.icon}</span>
                      <span className="truncate">{ch.name}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">
                      {ch.count.toLocaleString()}
                    </div>
                    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeStyle}`}>
                      {ch.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Biểu đồ xu hướng truy cập theo ngày
            </h2>
            <p className="text-xs text-gray-400 mb-4">(Tháng {month + 1}/{year})</p>
            <LineChart data={dailyData} label="Lượt truy cập" />
          </div>

          {/* Top pages table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Trang được truy cập nhiều nhất</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-6 py-3 font-semibold">#</th>
                    <th className="text-left px-6 py-3 font-semibold">Trang</th>
                    <th className="text-right px-6 py-3 font-semibold">Lượt xem</th>
                    <th className="text-right px-6 py-3 font-semibold">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topPages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    topPages.map((p, i) => (
                      <tr key={p.page} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-6 py-3 font-medium text-gray-800">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{p.page}</code>
                        </td>
                        <td className="px-6 py-3 text-right font-semibold text-gray-900">
                          {p.count.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500">
                          {totalViews > 0 ? Math.round((p.count / totalViews) * 100) : 0}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
