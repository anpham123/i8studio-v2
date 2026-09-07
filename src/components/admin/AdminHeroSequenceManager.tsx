import { useState, useEffect, useRef } from "react";
import { Film, Upload, RefreshCw, CheckCircle2, Save, Type, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

interface HeroMeta {
  totalFrames: number;
  videoUrl: string;
  updatedAt: string;
}

const DEFAULT_HERO_TEXTS: Record<string, string> = {
  heroIntroEyebrowJa: "i8 STUDIO · 3DCG 建築ビジュアライゼーション",
  heroIntroEyebrowEn: "i8 STUDIO · 3DCG ARCHITECTURAL VISUALIZATION",
  heroIntroTitleJa: "建築の美を、映画のような臨場感で",
  heroIntroTitleEn: "Cinematic Architectural Journey",
  heroIntroDescJa: "スクロールして空間の奥行きと光の表情をご体験ください",
  heroIntroDescEn: "Scroll to explore spatial depth, light, and architectural harmony",

  heroBeat1TagJa: "01 · 空間の調和",
  heroBeat1TagEn: "01 · SPATIAL HARMONY",
  heroBeat1TitleJa: "光と影が織りなすリビング空間",
  heroBeat1TitleEn: "Harmonious Living & Natural Light",
  heroBeat1DescJa: "厳密な光学計算に基づき、時間帯による自然光の移ろいと木・石・ファブリックの質感を極限まで再現。",
  heroBeat1DescEn: "Physically-based rendering reproduces true-to-life sunlight, wood textures, and refined interior tones.",

  heroBeat2TagJa: "02 · プライベート空間",
  heroBeat2TagEn: "02 · PRIVATE SANCTUARY",
  heroBeat2TitleJa: "心地よさを追求したプライベート空間",
  heroBeat2TitleEn: "Private Retreat & Materiality",
  heroBeat2DescJa: "間接照明と視線の抜けを考慮したアングル設計。施主様が暮らす未来の情景を鮮やかに伝えます。",
  heroBeat2DescEn: "Atmospheric ambient lighting and seamless indoor-outdoor sightlines create captivating visual storytelling.",

  heroBeat3TagJa: "03 · パノラマ＆スカイ空間",
  heroBeat3TagEn: "03 · PANORAMA & SKY RETREAT",
  heroBeat3TitleJa: "プロジェクトに、圧倒的な説得力を。",
  heroBeat3TitleEn: "Elevate Your Architecture with i8 STUDIO",
  heroBeat3DescJa: "最高峰の3DCGビジュアライゼーションで、未だ見ぬ建築の価値を余すことなく表現します。",
  heroBeat3DescEn: "High-end 3D architectural rendering and animation trusted by leading firms.",
  heroBeat3CtaJa: "無料相談・お見積り",
  heroBeat3CtaEn: "Request Free Quote",
  heroBeat3CtaLink: "/contact",
};

export default function AdminHeroSequenceManager() {
  const [meta, setMeta] = useState<HeroMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Hero Text Settings state
  const [texts, setTexts] = useState<Record<string, string>>(DEFAULT_HERO_TEXTS);
  const [savingTexts, setSavingTexts] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "text">("text");

  const fetchMeta = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hero-sequence", { cache: "no-store" });
      const data = await res.json();
      if (data?.success) {
        setMeta({
          totalFrames: data.totalFrames || 242,
          videoUrl: data.videoUrl || "/uploads/anhherrosection/1.mp4",
          updatedAt: data.updatedAt || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTexts = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const json = await res.json();
      if (json?.data) {
        setTexts((prev) => ({
          ...prev,
          ...json.data,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchTexts();
  }, []);

  const handleSaveTexts = async () => {
    try {
      setSavingTexts(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(texts),
      });

      if (!res.ok) throw new Error("Lưu thất bại");

      toast("Đã lưu nội dung văn bản Hero Section thành công!", "success");

      // Trigger revalidate
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } catch {}
    } catch (err: any) {
      toast(err.message || "Lỗi khi lưu nội dung", "error");
    } finally {
      setSavingTexts(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("video")) {
        toast("Vui lòng chọn file video định dạng MP4, MOV hoặc WebM", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setProcessStep("Đang tải video lên server...");

      const formData = new FormData();
      formData.append("file", selectedFile);

      setProcessStep("Server đang tự động phân rã và nén tối ưu chuỗi ảnh (mất ~3-5 giây)...");

      const res = await fetch("/api/hero-sequence", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Xử lý video thất bại");
      }

      setProcessStep(`Hoàn tất! Đã trích xuất thành công ${data.totalFrames} khung hình.`);
      toast(`Đã cập nhật Hero Video thành công! (${data.totalFrames} khung hình)`, "success");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchMeta();

      // Trigger revalidate
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } catch {}
    } catch (err: any) {
      toast(err.message || "Lỗi khi xử lý video", "error");
    } finally {
      setUploading(false);
      setTimeout(() => setProcessStep(""), 4000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-stone-900 to-[#1c1a16] text-white rounded-2xl p-6 sm:p-7 border border-[#c5a666]/30 shadow-xl mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a666]/20 border border-[#c5a666]/30 text-[#c5a666] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Sparkles size={13} />
            <span>HERO SECTION CONTROLLER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Quản lý Hero Section Trang Chủ
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            Tùy chỉnh <strong>Nội dung văn bản (Song ngữ Nhật - Anh)</strong> và <strong>Video / Hiệu ứng cuộn 3D</strong> trực tiếp từ Admin.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/ja"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur-sm border border-white/10 transition-colors"
          >
            <span>Xem thử trang chủ</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-5 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "text"
              ? "bg-[#c5a666] text-black shadow-lg"
              : "bg-white/5 text-stone-300 hover:bg-white/10"
          }`}
        >
          <Type size={14} />
          <span>Nội dung Văn bản (Song ngữ)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "video"
              ? "bg-[#c5a666] text-black shadow-lg"
              : "bg-white/5 text-stone-300 hover:bg-white/10"
          }`}
        >
          <Film size={14} />
          <span>Video & Chuỗi ảnh Cuộn 3D</span>
        </button>
      </div>

      {/* TAB 1: TEXT CONTENT EDITOR */}
      {activeTab === "text" && (
        <div className="pt-6 space-y-6">
          {/* Section 1: Intro Beat */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c5a666]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5a666]">
                1. Phân đoạn Mở đầu (Intro Beat - Đáy màn hình)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề nhỏ trên (Eyebrow) - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroIntroEyebrowJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroEyebrowJa: e.target.value })}
                  placeholder="i8 STUDIO · 3DCG 建築ビジュアライゼーション"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề nhỏ trên (Eyebrow) - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroIntroEyebrowEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroEyebrowEn: e.target.value })}
                  placeholder="i8 STUDIO · 3DCG ARCHITECTURAL VISUALIZATION"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề chính lớn - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroIntroTitleJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroTitleJa: e.target.value })}
                  placeholder="建築の美を、映画のような臨場感で"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề chính lớn - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroIntroTitleEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroTitleEn: e.target.value })}
                  placeholder="Cinematic Architectural Journey"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Đoạn mô tả phụ - Tiếng Nhật
                </label>
                <textarea
                  rows={2}
                  value={texts.heroIntroDescJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroDescJa: e.target.value })}
                  placeholder="スクロールして空間の奥行きと光の表情をご体験ください"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Đoạn mô tả phụ - Tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={texts.heroIntroDescEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroIntroDescEn: e.target.value })}
                  placeholder="Scroll to explore spatial depth, light, and architectural harmony"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Beat 1 (Góc trái dưới) */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c5a666]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5a666]">
                2. Phân đoạn 1 (Góc dưới bên trái)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat1TagJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1TagJa: e.target.value })}
                  placeholder="01 · 空間の調和"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat1TagEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1TagEn: e.target.value })}
                  placeholder="01 · SPATIAL HARMONY"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat1TitleJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1TitleJa: e.target.value })}
                  placeholder="光と影が織りなすリビング空間"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat1TitleEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1TitleEn: e.target.value })}
                  placeholder="Harmonious Living & Natural Light"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Nhật
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat1DescJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1DescJa: e.target.value })}
                  placeholder="厳密な光学計算に基づき、時間帯による自然光の移ろいと木・石・ファブリックの質感を極限まで再現。"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat1DescEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat1DescEn: e.target.value })}
                  placeholder="Physically-based rendering reproduces true-to-life sunlight, wood textures, and refined interior tones."
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Beat 2 (Góc phải dưới) */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c5a666]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5a666]">
                3. Phân đoạn 2 (Góc dưới bên phải)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat2TagJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2TagJa: e.target.value })}
                  placeholder="02 · プライベート空間"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat2TagEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2TagEn: e.target.value })}
                  placeholder="02 · PRIVATE SANCTUARY"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat2TitleJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2TitleJa: e.target.value })}
                  placeholder="心地よさを追求したプライベート空間"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat2TitleEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2TitleEn: e.target.value })}
                  placeholder="Private Retreat & Materiality"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Nhật
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat2DescJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2DescJa: e.target.value })}
                  placeholder="間接照明と視線の抜けを考慮したアングル設計。施主様が暮らす未来の情景を鮮やかに伝えます。"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat2DescEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat2DescEn: e.target.value })}
                  placeholder="Atmospheric ambient lighting and seamless indoor-outdoor sightlines create captivating visual storytelling."
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Beat 3 (Đáy cuối & Nút CTA) */}
          <div className="bg-black/30 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c5a666]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5a666]">
                4. Phân đoạn 3 & Kêu gọi Hành động (Đáy cuối)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3TagJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3TagJa: e.target.value })}
                  placeholder="03 · パノラマ＆スカイ空間"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nhãn số thứ tự - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3TagEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3TagEn: e.target.value })}
                  placeholder="03 · PANORAMA & SKY RETREAT"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3TitleJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3TitleJa: e.target.value })}
                  placeholder="プロジェクトに、圧倒的な説得力を。"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Tiêu đề - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3TitleEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3TitleEn: e.target.value })}
                  placeholder="Elevate Your Architecture with i8 STUDIO"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Nhật
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat3DescJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3DescJa: e.target.value })}
                  placeholder="最高峰の3DCGビジュアライゼーションで、未だ見ぬ建築の価値を余すことなく表現します。"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Mô tả - Tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={texts.heroBeat3DescEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3DescEn: e.target.value })}
                  placeholder="High-end 3D architectural rendering and animation trusted by leading firms."
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Chữ trên nút bấm - Tiếng Nhật
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3CtaJa || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3CtaJa: e.target.value })}
                  placeholder="無料相談・お見積り"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Chữ trên nút bấm - Tiếng Anh
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3CtaEn || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3CtaEn: e.target.value })}
                  placeholder="Request Free Quote"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Đường dẫn khi click nút bấm (URL link)
                </label>
                <input
                  type="text"
                  value={texts.heroBeat3CtaLink || ""}
                  onChange={(e) => setTexts({ ...texts, heroBeat3CtaLink: e.target.value })}
                  placeholder="/contact"
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a666]"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveTexts}
              disabled={savingTexts}
              className="px-7 py-3 bg-[#c5a666] hover:bg-[#b8935a] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2"
            >
              <Save size={15} />
              <span>{savingTexts ? "Đang lưu..." : "Lưu thay đổi nội dung"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO & 3D SEQUENCE MANAGER */}
      {activeTab === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Current Status Box */}
          <div className="lg:col-span-5 bg-black/40 rounded-xl p-5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-stone-400">Trạng thái hiện tại</span>
                <button
                  onClick={fetchMeta}
                  className="text-stone-400 hover:text-white transition-colors"
                  title="Tải lại thông tin"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                </button>
              </div>

              {meta && (
                <div className="space-y-3 text-xs sm:text-sm font-light">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-stone-400">Tổng khung hình cuộn:</span>
                    <span className="font-mono font-bold text-[#c5a666] text-base">
                      {meta.totalFrames} frames
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-stone-400">Cập nhật lần cuối:</span>
                    <span className="text-stone-300 font-mono text-xs">
                      {meta.updatedAt ? new Date(meta.updatedAt).toLocaleString("vi-VN") : "Gốc ban đầu"}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-stone-400 block mb-1.5">Video gốc đang chạy:</span>
                    <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-black">
                      <video
                        src={meta.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Form Box */}
          <div className="lg:col-span-7 bg-white/[0.03] rounded-xl p-5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-stone-400 block mb-3">
                Tải Video MP4 mới để tự động thay thế
              </span>

              {/* Drop / Select area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? "border-[#c5a666] bg-[#c5a666]/10"
                    : "border-white/20 hover:border-white/40 bg-black/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload
                  size={28}
                  className={`mx-auto mb-2 ${selectedFile ? "text-[#c5a666]" : "text-stone-400"}`}
                />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Nhấp để đổi file khác
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-stone-300 font-medium">
                      Nhấp để chọn file video mới từ máy tính
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Hỗ trợ file .mp4, .mov (Khuyến nghị video 1–2 phút, 1080p)
                    </p>
                  </div>
                )}
              </div>

              {/* Processing indicator */}
              {uploading && (
                <div className="mt-4 p-3.5 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center gap-3">
                  <RefreshCw size={16} className="text-blue-400 animate-spin shrink-0" />
                  <span className="text-xs text-blue-200 font-light">{processStep}</span>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Tự động tối ưu 100% không làm nặng web</span>
              </div>

              <button
                onClick={handleUploadAndProcess}
                disabled={!selectedFile || uploading}
                className="px-6 py-2.5 bg-[#c5a666] hover:bg-[#b8935a] disabled:opacity-40 disabled:hover:bg-[#c5a666] text-[#111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Tải lên & Tự động cắt ảnh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
