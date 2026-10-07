"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, CheckCircle2, Sliders, ShieldCheck, Sparkles } from "lucide-react";

interface EstimatorType {
  id: string;
  name: string;
  rateMin: number;
  rateMax: number;
  unit: string;
}

interface LandingPricingEstimatorProps {
  estimator?: {
    title?: string;
    desc?: string;
    ctaText?: string;
    disclaimer?: string;
    types?: EstimatorType[];
  };
  estimatorData?: {
    title?: string;
    desc?: string;
    ctaText?: string;
    disclaimer?: string;
    types?: EstimatorType[];
  };
  contactHref?: string;
  isJa?: boolean;
  locale?: string;
}

const DEFAULT_TYPES_JA: EstimatorType[] = [
  { id: "villa", name: "高級ヴィラ・注文邸宅", rateMin: 3500, rateMax: 5500, unit: "円 / m²" },
  { id: "townhouse", name: "モダンタウンハウス", rateMin: 2800, rateMax: 4200, unit: "円 / m²" },
  { id: "penthouse", name: "ペントハウス・内装", rateMin: 3000, rateMax: 4800, unit: "円 / m²" },
  { id: "rendering-only", name: "3DCGパース制作のみ", rateMin: 800, rateMax: 1500, unit: "円 / m²換算" },
];

export default function LandingPricingEstimator({
  estimator,
  estimatorData,
  contactHref = "/ja/contact",
  isJa = true,
  locale = "ja",
}: LandingPricingEstimatorProps) {
  const activeEstimator = estimator || estimatorData;
  const types = activeEstimator?.types && activeEstimator.types.length > 0
    ? activeEstimator.types
    : DEFAULT_TYPES_JA;

  const [selectedTypeId, setSelectedTypeId] = useState<string>(types[0]?.id || "villa");
  const [area, setArea] = useState<number>(200); // 200 m² default

  const selectedType = types.find((t) => t.id === selectedTypeId) || types[0];

  const minTotal = Math.round(area * selectedType.rateMin);
  const maxTotal = Math.round(area * selectedType.rateMax);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isJa ? "ja-JP" : "vi-VN").format(num);
  };

  return (
    <div className="pricing-estimator-container">
      <div className="pricing-estimator-card">
        {/* Top Header */}
        <div className="estimator-header">
          <div className="estimator-title-wrap">
            <span className="estimator-badge">
              <Calculator size={14} className="text-amber-400" />
              <span>{isJa ? "クイック試算シミュレーター" : "CÔNG CỤ DỰ TOÁN SƠ BỘ"}</span>
            </span>
            <h3 className="estimator-title">
              {activeEstimator?.title ||
                (isJa
                  ? "概算コストシミュレーター（参考目安）"
                  : "Dự toán sơ bộ ngân sách theo diện tích")}
            </h3>
            <p className="estimator-desc">
              {activeEstimator?.desc ||
                (isJa
                  ? "建物の種別と延床面積を選択して、設計・3Dビジュアライゼーション費用の概算レンジを即座に試算いただけます。"
                  : "Chọn loại hình công trình và kéo diện tích sàn (m²) dự kiến để ước tính ngay khoảng ngân sách thiết kế tham khảo.")}
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="estimator-body-grid">
          {/* Left: Input Selection */}
          <div className="estimator-controls-col">
            {/* Step 1: Select Type */}
            <div className="control-group">
              <label className="control-label">
                <span className="step-num">1</span>
                <span>{isJa ? "建物の種別を選択:" : "Chọn loại hình công trình:"}</span>
              </label>
              <div className="type-pills-grid">
                {types.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedTypeId(type.id)}
                    className={`type-pill-btn ${selectedTypeId === type.id ? "active" : ""}`}
                  >
                    <span className="type-pill-name">{type.name}</span>
                    <span className="type-pill-rate">
                      {formatNumber(type.rateMin)}〜{formatNumber(type.rateMax)} {type.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Slider for Floor Area */}
            <div className="control-group">
              <div className="control-label-row">
                <label className="control-label">
                  <span className="step-num">2</span>
                  <span>{isJa ? "延床面積（m²）を調整:" : "Diện tích sàn dự kiến (m²):"}</span>
                </label>
                <div className="area-value-display">
                  <input
                    type="number"
                    min={30}
                    max={1500}
                    value={area}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v > 0) setArea(v);
                    }}
                    className="area-number-input"
                  />
                  <span className="area-unit">m²</span>
                </div>
              </div>

              {/* Range Slider */}
              <div className="slider-wrapper">
                <input
                  type="range"
                  min={30}
                  max={800}
                  step={5}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="area-slider-range"
                />
                <div className="slider-ticks">
                  <span>50 m²</span>
                  <span>200 m²</span>
                  <span>400 m²</span>
                  <span>600 m²</span>
                  <span>800 m²+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Calculated Result Display */}
          <div className="estimator-result-col">
            <div className="result-card-inner">
              <span className="result-label">
                {isJa ? "概算費用レンジ（参考目安）" : "KHOẢNG NGÂN SÁCH THAM KHẢO"}
              </span>

              <div className="result-price-highlight">
                <div className="result-price-row">
                  <span className="price-num min">{formatNumber(minTotal)}</span>
                  <span className="price-separator">〜</span>
                  <span className="price-num max">{formatNumber(maxTotal)}</span>
                  <span className="price-unit">{isJa ? "円" : "VNĐ"}</span>
                </div>
                <span className="result-tax-note">
                  {isJa ? "（税別 · 延床面積 " + area + " m² の概算）" : "（Ước tính theo " + area + " m² sàn thực tế）"}
                </span>
              </div>

              {/* What's included checklist */}
              <div className="result-deliverables-box">
                <span className="deliverables-title">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>{isJa ? "概算に含まれる標準項目:" : "Các hạng mục hồ sơ bao gồm:"}</span>
                </span>
                <ul className="deliverables-list">
                  <li>
                    <span>✓</span>
                    <span>{isJa ? "基本計画・動線ゾーニング・生活機能プラン" : "Mặt bằng công năng 2D & phân khu vi khí hậu"}</span>
                  </li>
                  <li>
                    <span>✓</span>
                    <span>{isJa ? "8Kフォトリアル3DCG空間パース（全アングル）" : "Bộ ảnh diễn họa 3D 8K chất lượng cao toàn diện"}</span>
                  </li>
                  <li>
                    <span>✓</span>
                    <span>{isJa ? "日照・自然通風・物理光シミュレーション" : "Mô phỏng ánh sáng vật lý & hướng nắng tự nhiên"}</span>
                  </li>
                  <li>
                    <span>✓</span>
                    <span>{isJa ? "詳細積算内訳書（部材数量・コスト管理）" : "Hồ sơ bóc tách tiên lượng dự toán chống phát sinh"}</span>
                  </li>
                </ul>
              </div>

              {/* CTA Action */}
              <a href={contactHref} className="estimator-cta-btn">
                <span>
                  {activeEstimator?.ctaText ||
                    (isJa
                      ? "この条件で詳細な積算内訳書を依頼する（無料）"
                      : "Gửi mặt bằng để nhận dự toán bóc tách chi tiết (Miễn phí)")}
                </span>
                <ArrowRight size={16} />
              </a>

              <p className="estimator-disclaimer">
                {activeEstimator?.disclaimer ||
                  (isJa
                    ? "※ 表示される金額は一般的な仕様に基づく参考目安です。実際の地盤・構造・特殊要望により変動します。"
                    : "※ Khoảng giá trên mang tính chất tham khảo chuẩn kỹ thuật. Đơn giá chính xác phụ thuộc vào hồ sơ mặt bằng và yêu cầu cụ thể.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
