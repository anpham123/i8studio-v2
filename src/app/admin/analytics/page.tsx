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
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [topPages, setTopPages] = useState<PageData[]>([]);
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
      const [dailyRes, pagesRes, prevRes] = await Promise.all([
        fetch(`/api/analytics?type=pageview&groupBy=day&from=${from}&to=${to}`).then(r => r.json()),
        fetch(`/api/analytics?type=pageview&groupBy=page&from=${from}&to=${to}`).then(r => r.json()),
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
      setPrevTotal((prevRes.data || []).reduce((s: number, d: DayData) => s + d.count, 0));
    } catch {
      setDailyData([]);
      setTopPages([]);
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
      {/* Month selector */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-1 shadow-sm">
          <button onClick={goBack}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="px-3 text-sm font-semibold text-gray-800 min-w-[90px] text-center">
            {monthLabel(year, month)}
          </span>
          <button onClick={goForward} disabled={isCurrentMonth}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <BarChart3 size={14} />
          <span>Biểu đồ thống kê truy cập tháng</span>
        </div>
      </div>

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
              <div className="text-xs text-gray-500 mt-1">Lượt truy cập</div>
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

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Thống kê truy cập website i8studio.vn
            </h2>
            <p className="text-xs text-gray-400 mb-4">(theo tháng)</p>
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
