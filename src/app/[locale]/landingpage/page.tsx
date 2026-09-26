import React from "react";
import type { Metadata } from "next";
import "./landingpage.css";
import LandingPageInteractive from "./LandingPageInteractive";
import LandingHero3D from "./LandingHero3D";
import { getLandingContent, getGalleryProjectsData, getDeliverableCollections } from "./landingI18n";
import { getMergedLandingContent } from "@/lib/landingpage-data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const isEn = params.locale === "en";
  return {
    title: isJa
      ? "KONTUR — 建築設計・3DCG空間ビジュアライゼーション"
      : isEn
      ? "KONTUR — Precision Architecture & 3D Visualization"
      : "KONTUR — Kiến Trúc & Diễn Họa 3D Chuẩn Kỹ Thuật",
    description: isJa
      ? "技術基準に準拠した高精度な建築設計と、100%フォトリアルな3DCG空間ビジュアライゼーション。細部まで視覚化し、コストをコントロールし、施工ミスを未然に防ぎます。"
      : isEn
      ? "Technically compliant architectural design and 100% photorealistic 3D rendering. Visualize every detail, control costs, and prevent construction errors before breaking ground."
      : "Giải pháp thiết kế kiến trúc chuẩn kỹ thuật và diễn họa 3D không gian sống chân thực 100%. Giúp bạn hình dung trọn vẹn, kiểm soát chi phí và tránh sai sót thi công.",
  };
}

function renderQuoteWithBreaks(text?: string) {
  if (!text) return null;
  const parts = text.split(/<\/?br\s*\/?>|<\\[bB][rR]>/gi);
  if (parts.length <= 1) {
    return <span className="quote-line">{text}</span>;
  }
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          <span className="quote-line">{part}</span>
        </React.Fragment>
      ))}
    </>
  );
}

export default async function LandingPage({
  params,
}: {
  params?: { locale?: string };
}) {
  const currentLocale = params?.locale || "ja";
  const isJa = currentLocale === "ja";
  const isEn = currentLocale === "en";
  const contactHref = `/${currentLocale}/contact`;

  const {
    t,
    galleryProjects: galleryData,
    galleryTabs,
    deliverableCollections: deliverables,
    applicationCards,
    applicationCategories,
    partnerStats,
    partnerBrands,
    pricingTiers,
  } = await getMergedLandingContent(currentLocale);

  const pLakeside = galleryData["p-lakeside"] || Object.values(galleryData)[0] || {
    id: "p-lakeside",
    category: "villa",
    catTag: isJa ? "高級リゾートヴィラ" : isEn ? "LUXURY RETREAT VILLA" : "BIỆT THỰ NGHỈ DƯỠNG CAO CẤP",
    title: "THE LAKESIDE HORIZON VILLA",
    loc: isJa ? "ホーチャム · 850 m²" : isEn ? "Ho Tram • 850 m²" : "Hồ Tràm, Bà Rịa — Vũng Tàu",
    narrative: "",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
    solution: "",
    materials: "",
    deliverables: [],
    keyHighlights: [],
    specs: [],
  };
  const projectList = Object.values(galleryData);

  return (
    <div className="landingpage-root">
      <LandingPageInteractive
        locale={currentLocale}
        deliverableCollections={deliverables}
        galleryProjects={galleryData}
      />

      <LandingHero3D locale={currentLocale} heroContent={t.hero} />

      {/* =========================================================================
          SECTION: PAIN POINTS
          ========================================================================= */}
      <section className="pain-points-section" id="quy-trinh">
        <div className="content-container">

          <div className="pain-title-center-wrap reveal-item">
            <h2 className="pain-single-line-title">
              {t.painPoints.title}
            </h2>
            <div className="pain-title-decor" aria-hidden="true">
              <span className="pain-decor-line left"></span>
              <span className="pain-decor-sparkle">◆</span>
              <span className="pain-decor-line right"></span>
            </div>
          </div>

          <div className="pain-cards-grid" id="painCardsGrid">
            {(t.painPoints?.cards || []).map((card, idx) => {
              const isEven = idx % 2 === 0;
              const sideClass = isEven ? "pain-card-left" : "pain-card-right";
              const delayClass = `delay-${idx % 4}`;
              const activeClass = idx === 0 ? "active-crossfade" : "";

              return (
                <div
                  key={idx}
                  className={`pain-card ${sideClass} ${delayClass} ${activeClass}`}
                  data-index={idx.toString()}
                >
                  <div className="pain-card-progress"></div>
                  <div className="pain-card-top">
                    <span className="pain-tag">{card.tag || (isJa ? `課題 0${idx + 1}` : `PAIN POINT 0${idx + 1}`)}</span>
                    <span className="pain-badge-alert">{card.badge || (isJa ? "設計・施工課題" : "CHALLENGE")}</span>
                  </div>
                  <h3 className="pain-quote">{renderQuoteWithBreaks(card.quote)}</h3>
                  <p className="pain-detail">{card.detail}</p>
                  <div className="solution-box">
                    <span className="sol-label">
                      {card.solLabel || (isJa ? "Konturの解決策:" : isEn ? "KONTUR SOLUTION:" : "Giải pháp Kontur:")}
                    </span>
                    <p className="sol-text">
                      {card.solText || (isJa
                        ? "実寸大1:1スケールの高精細3Dレンダリングにより、完成後の住まいを明確に可視化。"
                        : isEn
                        ? "Photorealistic 1:1 scale 3D renders from realistic viewpoints help visualize every angle."
                        : "Diễn họa 3D chân thực theo tỉ lệ 1:1 từ góc nhìn thực tế giúp gia chủ thấy rõ ngôi nhà tương lai.")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: WORKFLOW DIRECT (5 BƯỚC)
          ========================================================================= */}
      <section className="workflow-direct-section" id="quy-trinh-thuc-hien">
        <div className="workflow-fullwidth-container">

          <div className="workflow-title-center-wrap reveal-item">
            <h2 className="workflow-single-line-title">
              {t.workflow.title}
            </h2>
            <div className="workflow-title-decor" aria-hidden="true">
              <span className="workflow-decor-line left"></span>
              <span className="workflow-decor-sparkle">✦</span>
              <span className="workflow-decor-line right"></span>
            </div>
          </div>

          <div className="alternating-timeline-container" id="alternatingTimeline">
            <div className="timeline-horizontal-axis">
              <div className="timeline-axis-track"></div>
              <div className="timeline-axis-beam"></div>
            </div>

            <div
              className="timeline-steps-grid"
              style={{
                gridTemplateColumns: `repeat(${t.workflow?.steps?.length || 5}, minmax(0, 1fr))`,
              }}
            >
              {(t.workflow?.steps || []).map((step: any, idx: number) => {
                const stepNumStr = String(idx + 1).padStart(2, "0");
                const isEvenSlot = idx % 2 === 0; // 0, 2, 4 -> content top, img bottom
                const defaultImages = [
                  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85",
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
                  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=85",
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=85",
                ];
                const defaultStageTags = [
                  `STAGE 01 • ${isJa ? "現況調査" : isEn ? "SURVEY" : "KHẢO SÁT"}`,
                  "STAGE 02 • WHITEBOX",
                  "STAGE 03 • RENDER 8K",
                  "STAGE 04 • CINEMA & VR",
                  `STAGE 05 • ${isJa ? "図面＆積算" : isEn ? "BLUEPRINTS & BOQ" : "HỒ SƠ & BOQ"}`,
                ];

                const imgSrc = step.stepImage || defaultImages[idx % defaultImages.length];
                const stageTag = step.stepStageTag || defaultStageTags[idx % defaultStageTags.length] || `STAGE ${stepNumStr}`;
                const badgeText = isJa ? `ステップ ${stepNumStr}` : isEn ? `STEP ${stepNumStr}` : `BƯỚC ${stepNumStr}`;

                const contentBlock = (
                  <div className="timeline-content-frameless">
                    <div className="step-frameless-header">
                      <span className="step-badge-pill">{badgeText}</span>
                    </div>
                    <h4 className="step-card-title">{step.stepTitle}</h4>
                    <p className="step-card-desc">{step.stepDesc}</p>
                  </div>
                );

                const imageBlock = (
                  <div className="timeline-image-card">
                    <img
                      src={imgSrc}
                      alt={step.stepTitle || `Step ${stepNumStr}`}
                      className="timeline-step-img"
                    />
                    <div className="timeline-img-overlay">
                      <span className="img-phase-tag">{stageTag}</span>
                    </div>
                  </div>
                );

                const centerNode = (
                  <div className="step-node-center">
                    <div className="step-node-pulse"></div>
                    <div className="step-node-dot">
                      <span>{stepNumStr}</span>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={idx}
                    className={`timeline-step-col ${isEvenSlot ? "step-odd" : "step-even"} step-${idx + 1}`}
                    data-step={idx + 1}
                    style={{ transitionDelay: `${0.08 + idx * 0.12}s` }}
                  >
                    {isEvenSlot ? (
                      <>
                        <div className="step-slot-top">
                          {contentBlock}
                          <div className="step-stem-connector to-node"></div>
                        </div>
                        {centerNode}
                        <div className="step-slot-bottom">
                          <div className="step-stem-connector from-node"></div>
                          {imageBlock}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="step-slot-top">
                          {imageBlock}
                          <div className="step-stem-connector to-node"></div>
                        </div>
                        {centerNode}
                        <div className="step-slot-bottom">
                          <div className="step-stem-connector from-node"></div>
                          {contentBlock}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: BỘ SƯU TẬP (DELIVERABLES)
          ========================================================================= */}
      <section className="deliverables-compare-section" id="bo-suu-tap">
        <div className="showcase-fullwidth-container">
          <div className="deliverables-gallery-block reveal-item">
            <div className="deliverables-block-header">
              <h2 className="deliverables-block-title">{t.deliverables.title}</h2>
              <div className="workflow-title-decor" aria-hidden="true">
                <span className="workflow-decor-line left"></span>
                <span className="workflow-decor-sparkle">✦</span>
                <span className="workflow-decor-line right"></span>
              </div>
            </div>

            <div className="deliverables-showcase-layout" id="deliverablesShowcase">

              {/* CỘT TRÁI: DANH SÁCH BỘ SƯU TẬP */}
              <div className="collections-2x2-grid">
                {(deliverables || []).map((col: any, idx: number) => {
                  const cardThumb =
                    col.thumbnail ||
                    col.photos?.[0]?.url ||
                    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85";
                  const photoCount = col.photos?.length || 0;
                  const countLabel = isJa
                    ? `${photoCount}点（図面・画像）`
                    : isEn
                    ? `${photoCount} Drawings & Images`
                    : `${photoCount} ảnh / bản vẽ`;
                  const colNumLabel = isJa
                    ? `コレクション 0${idx + 1}`
                    : isEn
                    ? `COLLECTION 0${idx + 1}`
                    : `BỘ SƯU TẬP 0${idx + 1}`;

                  return (
                    <div
                      key={col.id || idx}
                      className={`collection-card-item ${idx === 0 ? "active" : ""} delay-${idx % 4}`}
                      data-col-idx={idx.toString()}
                    >
                      <div className="col-card-thumb-wrap">
                        <img
                          src={cardThumb}
                          alt={col.name || `Collection ${idx + 1}`}
                          className="col-card-thumb"
                        />
                      </div>
                      <div className="col-card-info">
                        <span className="col-card-num">{colNumLabel}</span>
                        <h4 className="col-card-title">{col.name}</h4>
                        <div className="col-card-status">
                          <span className="col-card-count">{countLabel}</span>
                          <span className="col-card-active-dot"></span>
                        </div>
                      </div>
                      <div className="col-card-progress-bar">
                        <div className="col-card-progress-fill"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CỘT PHẢI: KHUNG ẢNH LỚN TỰ ĐỘNG CHẠY */}
              {(() => {
                const firstCol = deliverables?.[0];
                const firstPhoto = firstCol?.photos?.[0];
                const totalPhotos = firstCol?.photos?.length || 1;
                const initialSrc =
                  firstPhoto?.url ||
                  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85";
                const initialAlt = firstPhoto?.title || "Showcase Preview";
                const initialTag =
                  firstPhoto?.tag ||
                  (isJa ? "A3総合平面図" : isEn ? "A3 MASTER FLOOR PLAN" : "BẢN VẼ MẶT BẰNG A3");
                const initialTitle =
                  firstPhoto?.title ||
                  (isJa
                    ? "01. 建築意匠平面図＆全体機能レイアウト"
                    : isEn
                    ? "01. Architectural floor plan & master circulation"
                    : "01. Mặt bằng kiến trúc & bố trí công năng tổng thể");

                return (
                  <div className="collection-showcase-viewer showcase-zoom-in">
                    <div className="showcase-img-stage" id="showcaseStage">
                      <img
                        src={initialSrc}
                        alt={initialAlt}
                        className="showcase-main-img"
                        id="showcaseMainImg"
                      />
                      <div className="showcase-gradient-overlay"></div>

                      <div className="showcase-top-meta">
                        <div className="showcase-counter-badge" id="showcaseCounter">
                          {isJa
                            ? `PHOTO 01 / 0${totalPhotos}`
                            : isEn
                            ? `PHOTO 01 / 0${totalPhotos}`
                            : `ẢNH 01 / 0${totalPhotos}`}
                        </div>
                      </div>

                      <div className="showcase-bottom-caption">
                        <div className="showcase-title-row">
                          <span className="photo-category-tag" id="showcasePhotoTag">
                            {initialTag}
                          </span>
                          <h4 className="showcase-photo-title" id="showcasePhotoTitle">
                            {initialTitle}
                          </h4>
                        </div>

                        <div className="showcase-nav-row">
                          <div className="showcase-dots-wrap" id="showcaseDots">
                            {(firstCol?.photos || [0]).map((_: any, pIdx: number) => (
                              <button
                                key={pIdx}
                                type="button"
                                className={`showcase-dot ${pIdx === 0 ? "active" : ""}`}
                                data-p-idx={pIdx.toString()}
                                aria-label={`Photo ${pIdx + 1}`}
                              ></button>
                            ))}
                          </div>
                          <div className="showcase-timer-bar">
                            <div className="showcase-timer-fill" id="showcaseTimerFill"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: HỆ THỐNG TRỤ CỘT DỊCH VỤ (BENTO GRID)
          ========================================================================= */}
      <section className="services-pillars-section" id="dich-vu">
        <div className="content-container">

          <div className="services-bento-header-center reveal-item">
            <h2 className="services-bento-single-title">
              {t.servicesBento.title}
            </h2>
            <div className="workflow-title-decor" aria-hidden="true">
              <span className="workflow-decor-line left"></span>
              <span className="workflow-decor-sparkle">✦</span>
              <span className="workflow-decor-line right"></span>
            </div>
          </div>

          <div className="services-bento-grid" id="servicesBentoGrid">
            {(() => {
              const defaultBentoImages = [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
              ];

              const bentoCards: any[] = (t.servicesBento as any)?.cards || [
                t.servicesBento.card1,
                t.servicesBento.card2,
                t.servicesBento.card3,
                t.servicesBento.card4,
              ].filter(Boolean);

              return bentoCards.map((card: any, idx: number) => {
                const rowIdx = Math.floor(idx / 2);
                const posInRow = idx % 2;
                const isEvenRow = rowIdx % 2 === 0;
                const colClass = isEvenRow
                  ? (posInRow === 0 ? "bento-card-7col" : "bento-card-5col")
                  : (posInRow === 0 ? "bento-card-5col" : "bento-card-7col");
                const slideClass = isEvenRow ? "bento-slide-left" : "bento-slide-right";
                const delayClass = `delay-${posInRow}`;
                const cardImg = card.image || defaultBentoImages[idx % defaultBentoImages.length];
                const cardNumStr = String(idx + 1).padStart(2, "0");

                return (
                  <article
                    key={idx}
                    className={`bento-card ${colClass} bento-card-${idx + 1} ${slideClass} ${delayClass}`}
                    data-bento={idx + 1}
                  >
                    <div className="bento-card-bg">
                      <img
                        src={cardImg}
                        alt={card.title || `Service ${idx + 1}`}
                        className="bento-bg-img"
                        id={`bentoImg${idx + 1}`}
                      />
                      <div className="bento-bg-overlay"></div>
                    </div>

                    <div className="bento-card-body">
                      <h3 className="bento-card-title">{card.title}</h3>
                      <p className="bento-card-desc" id={`bentoDesc${idx + 1}`}>
                        {card.desc}
                      </p>

                      {Array.isArray(card.features) && card.features.length > 0 && (
                        <div className="bento-metrics-row">
                          {card.features.map((feature: string, fIdx: number) => (
                            <span key={fIdx} className="bento-metric-pill">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              });
            })()}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: TRUST DARK (UY TÍN & KHÁCH HÀNG TIN CHỌN)
          ========================================================================= */}
      <section className="trust-dark-section">
        <div className="content-container">

          <div className="trust-header-block reveal-item">
            <span className="trust-eyebrow">
              {t.clients.eyebrow || (isJa ? "500件以上の実績が証明する確かな信頼" : isEn ? "PROVEN TRUST ACROSS 500+ PROJECTS" : "UY TÍN ĐƯỢC CHỨNG MINH QUA 500+ DỰ ÁN")}
            </span>
            <h2 className="trust-title">{t.clients.title}</h2>
          </div>

          <div className="trust-4col-grid">
            {(t.clients.trustCards || []).map((card, idx) => (
              <div key={idx} className={`trust-card reveal-item delay-${idx}`}>
                <span className="trust-num">0{idx + 1}</span>
                <h4 className="trust-card-title">{card.title}</h4>
                <p className="trust-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: APPLICATIONS THEO TỪNG LĨNH VỰC
          ========================================================================= */}
      <section className="applications-section" id="ung-dung-thuc-te">
        <div className="content-container">

          <div className="section-title-split reveal-item">
            <div className="title-left">
              <h2 className="sec-main-title">{t.applications.title}</h2>
            </div>
            <div className="title-right">
              <p className="sec-subtitle">
                {t.applications.subtitle || (isJa
                  ? "空間ビジュアライゼーションと設計シミュレーションを、企画・販売促進・コスト管理・現場施工の各段階に直接適用。"
                  : isEn
                  ? "Spatial rendering and simulation solutions directly applied to sales acceleration, cost control, and precision construction."
                  : "Giải pháp diễn họa & mô phỏng không gian được ứng dụng trực tiếp vào từng giai đoạn thực thi, xúc tiến bán hàng, kiểm soát chi phí và thi công thực tiễn.")}
              </p>
            </div>
          </div>

          <div className="usecase-filter-bar reveal-item">
            <button type="button" className="usecase-tab-btn active" data-filter="all">
              {isJa
                ? `全応用分野 (${String((applicationCards || t.applications?.cards || []).length).padStart(2, "0")})`
                : isEn
                ? `ALL APPLICATIONS (${String((applicationCards || t.applications?.cards || []).length).padStart(2, "0")})`
                : `TẤT CẢ ỨNG DỤNG (${String((applicationCards || t.applications?.cards || []).length).padStart(2, "0")})`}
            </button>
            {(applicationCategories || t.applications?.categories || []).map((cat) => (
              <button
                key={cat.key}
                type="button"
                className="usecase-tab-btn"
                data-filter={cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="usecases-scroll-container" id="usecasesScrollContainer">
            <div className="usecases-grid-3col">
              {(applicationCards || t.applications?.cards || []).map((card, idx) => {
                const delayClass = idx % 3 === 1 ? "delay-1" : idx % 3 === 2 ? "delay-2" : "";
                return (
                  <article
                    key={card.id || idx}
                    className={`usecase-card reveal-item ${delayClass}`}
                    data-category={card.category}
                  >
                    <div className="usecase-img-wrap">
                      <img
                        src={card.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                        alt={card.title}
                        className="usecase-img"
                      />
                      <div className="usecase-badge-row">
                        <span className="usecase-target-tag">{card.targetTag}</span>
                        <span className="usecase-num">{card.num || String(idx + 1).padStart(2, "0")}</span>
                      </div>
                    </div>
                    <div className="usecase-body">
                      <h3 className="usecase-title">{card.title}</h3>
                      <div className="usecase-problem-box">
                        <span className="prob-label">
                          {card.problemLabel || (isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:")}
                        </span>
                        <p className="prob-text">{card.problemText}</p>
                      </div>
                      {Array.isArray(card.checklist) && card.checklist.length > 0 && (
                        <ul className="usecase-checklist">
                          {card.checklist.map((point: string, pIdx: number) => (
                            <li key={pIdx}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {(card.outcomeLabel || card.outcomeVal) && (
                        <div className="usecase-outcome-footer">
                          <span className="outcome-label">
                            {card.outcomeLabel || (isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:")}
                          </span>
                          <span className="outcome-val">{card.outcomeVal}</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: CLIENTS & PARTNERS MARQUEE
          ========================================================================= */}
      <section className="clients-marquee-section" id="khach-hang">
        <div className="content-container">

          <div className="clients-header-center reveal-item">
            <h2 className="clients-centered-title">
              {t.partners?.title || (isJa ? "全国250社以上のパートナー＆企業様" : isEn ? "250+ PARTNERS & CLIENTS NATIONWIDE" : "250+ ĐỐI TÁC & KHÁCH HÀNG TRÊN TOÀN QUỐC")}
            </h2>
            <div className="workflow-title-decor" aria-hidden="true">
              <span className="workflow-decor-line left"></span>
              <span className="workflow-decor-sparkle">✦</span>
              <span className="workflow-decor-line right"></span>
            </div>
          </div>

          <div className="client-industry-grid reveal-item">
            {(partnerStats && partnerStats.length > 0 ? partnerStats : [
              { num: "120+", name: isJa ? "ヴィラ＆高級レジデンス" : isEn ? "Luxury Villas & Residences" : "Biệt Thự & Villa Nghỉ Dưỡng", desc: isJa ? "国内外の個人施主様・富裕層住宅" : isEn ? "High-end private homeowners across prime locations" : "Gia chủ cao cấp tại TP.HCM, Hà Nội, Đà Lạt, Hồ Tràm, Phú Quốc" },
              { num: "45+", name: isJa ? "不動産開発・都市計画" : isEn ? "Real Estate & Urban Projects" : "Dự Án BĐS & Đô Thị", desc: isJa ? "プレセール販売促進およびマーケティング" : isEn ? "Developers, F1 agencies for presale & marketing" : "Chủ đầu tư, sàn phân phối F1 mở bán presale & marketing" },
              { num: "60+", name: isJa ? "建築設計事務所＆デザインスタジオ" : isEn ? "Architecture Studios & Firms" : "Studio & Văn Phòng KTS", desc: isJa ? "国際デザイン誌基準のCGパース委託パートナー" : isEn ? "Design partners outsourcing editorial-standard 3D renders" : "Đối tác thiết kế ủy thác diễn họa 3D chuẩn tạp chí quốc tế" },
              { num: "35+", name: isJa ? "リゾートホテル＆商業施設" : isEn ? "Resorts, Hotels & F&B Chains" : "Resort, Hotel & Chuỗi F&B", desc: isJa ? "独自の世界観を持つ空間コンセプトと高級飲食チェーン" : isEn ? "Iconic viral experiential concepts & luxury dining chains" : "Concept không gian check-in độc bản & chuỗi nhà hàng sang trọng" },
            ]).map((stat, idx) => (
              <div key={idx} className={`client-ind-card delay-${idx % 4}`}>
                <span className="ind-num">{stat.num}</span>
                <h4 className="ind-name">{stat.name}</h4>
                <p className="ind-desc">{stat.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {(() => {
          const displayBrands = (partnerBrands && partnerBrands.length > 0)
            ? partnerBrands
            : [
                {
                  name: "MASTERISE HOMES",
                  sub: isJa ? "高級不動産開発" : isEn ? "Luxury Real Estate" : "Bất động sản hạng sang",
                  img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "NOVALAND GROUP",
                  sub: isJa ? "都市＆リゾート" : isEn ? "Urban & Hospitality" : "Đô thị & Nghỉ dưỡng",
                  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "COTECCONS",
                  sub: isJa ? "総合建設" : isEn ? "General Contractor" : "Tổng thầu xây dựng",
                  img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "HÒA BÌNH CORP",
                  sub: isJa ? "建設コングロマリット" : isEn ? "Construction Group" : "Tập đoàn xây dựng",
                  img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "MIA DESIGN",
                  sub: isJa ? "建築設計事務所" : isEn ? "Architectural Studio" : "Văn phòng kiến trúc",
                  img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "AN CƯỜNG WOOD",
                  sub: isJa ? "インテリア建材" : isEn ? "Interior Materials" : "Vật liệu nội thất",
                  img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
                },
              ];

          // Tạo chuỗi lặp đủ dài để phủ màn hình siêu rộng (ít nhất 18 thẻ)
          const repeatCount = Math.max(2, Math.ceil(18 / Math.max(1, displayBrands.length)));
          const marqueeGroupCards = Array.from({ length: repeatCount }).flatMap(() => displayBrands);

          return (
            <div className="infinite-marquee-container marquee-left-flow">
              <div className="marquee-track">
                {/* Primary Group */}
                <div className="marquee-group">
                  {marqueeGroupCards.map((partner, idx) => (
                    <article key={`marquee-g1-${idx}`} className="partner-story-card">
                      <div className="partner-card-bg">
                        <img
                          src={partner.img}
                          alt={partner.name}
                          className="partner-bg-img"
                          loading="lazy"
                        />
                        <div className="partner-card-overlay"></div>
                      </div>
                      <div className="story-card-inner">
                        <div className="story-brand-center">
                          <h3 className="story-brand-name">{partner.name}</h3>
                          <span className="story-brand-sub">{partner.sub}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Clone Group for seamless infinite scroll */}
                <div className="marquee-group" aria-hidden="true">
                  {marqueeGroupCards.map((partner, idx) => (
                    <article key={`marquee-g2-${idx}`} className="partner-story-card">
                      <div className="partner-card-bg">
                        <img
                          src={partner.img}
                          alt={partner.name}
                          className="partner-bg-img"
                          loading="lazy"
                        />
                        <div className="partner-card-overlay"></div>
                      </div>
                      <div className="story-card-inner">
                        <div className="story-brand-center">
                          <h3 className="story-brand-name">{partner.name}</h3>
                          <span className="story-brand-sub">{partner.sub}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* =========================================================================
          SECTION: GALLERY EXHIBITION (BỘ SƯU TẬP CÔNG TRÌNH)
          ========================================================================= */}
      <section className="gallery-dark-exhibition" id="du-an">
        <div className="content-container">

          <div className="gallery-header-block reveal-item">
            <div className="gallery-header-centered">
              <h2 className="gallery-centered-heading">{t.gallery.title}</h2>
              <div className="workflow-title-decor" aria-hidden="true">
                <span className="workflow-decor-line left"></span>
                <span className="workflow-decor-sparkle">✦</span>
                <span className="workflow-decor-line right"></span>
              </div>
            </div>

            <div className="gallery-filter-bar">
              {(galleryTabs && galleryTabs.length > 0 ? galleryTabs : [
                { key: "all", label: t.gallery?.tabs?.all || (isJa ? "全作品 (06)" : isEn ? "All Works (06)" : "Tất cả công trình (06)") },
                { key: "villa", label: t.gallery?.tabs?.villa || (isJa ? "別荘・高級ヴィラ" : isEn ? "Villas & Estates" : "Biệt Thự (Villa)") },
                { key: "townhouse", label: t.gallery?.tabs?.townhouse || (isJa ? "都市型住宅・タウンハウス" : isEn ? "Townhouses" : "Nhà phố (Townhouse)") },
                { key: "penthouse", label: t.gallery?.tabs?.penthouse || (isJa ? "ペントハウス＆マンション" : isEn ? "Penthouses" : "Penthouse") },
                { key: "resort", label: t.gallery?.tabs?.resort || (isJa ? "リゾート＆宿泊施設" : isEn ? "Resorts & Hotels" : "Resort & Nghỉ dưỡng") },
                { key: "fnb", label: t.gallery?.tabs?.fnb || (isJa ? "カフェ＆商業施設" : isEn ? "Commercial & F&B" : "F&B / Thương mại") },
              ]).map((tab: any, idx: number) => (
                <button
                  key={tab.key || idx}
                  className={`gallery-tab-btn ${idx === 0 ? "active" : ""}`}
                  data-gallery-filter={tab.key}
                  aria-selected={idx === 0 ? "true" : "false"}
                >
                  <span className="tab-dot"></span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-showcase-split-layout">

            {/* CỘT TRÁI: DỰ ÁN SPOTLIGHT */}
            <div className="gallery-split-left-col">
              <div className="gallery-hero-spotlight reveal-item"
                data-project-id="p-lakeside" id="galleryHeroSpotlight">
                <div className="spotlight-visual-frame" id="spotlightVisualFrame">
                  <img src={pLakeside.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90"}
                    alt={pLakeside.title || "Featured Project"} className="spotlight-main-img" id="spotlightMainImg" />
                  <div className="spotlight-gradient-overlay"></div>

                  <div className="spotlight-badge-top">
                    <span className="badge-accent-tag" id="spotlightBadgeAccent">
                      {isJa ? "選択中のプロジェクト" : isEn ? "FEATURED PROJECT" : "DỰ ÁN ĐANG XEM"}
                    </span>
                    <span className="badge-scope-tag" id="spotlightBadgeScope">
                      {isJa ? "建築設計＆8K 3DCG表現" : isEn ? "ARCHITECTURE & 8K 3D RENDERING" : "KIẾN TRÚC & DIỄN HỌA 3D 8K"}
                    </span>
                  </div>

                  <div className="spotlight-hotspots-layer" id="spotlightHotspotsLayer"></div>

                  <div className="spotlight-zoom-hint" id="spotlightZoomHint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <span>{t.gallery.btnZoom}</span>
                  </div>
                </div>

                <div className="spotlight-info-pane" id="spotlightInfoPane">
                  <div className="spotlight-header">
                    <div className="spotlight-header-top-row">
                      <div className="spotlight-cat-tag" id="spotlightCatTag">{pLakeside.catTag}</div>
                      <div className="spotlight-badge-status">✦ {isJa ? "設計・3D実績" : isEn ? "Verified Project" : "Dự Án Tiêu Điểm"}</div>
                    </div>
                    <h3 className="spotlight-title" id="spotlightTitle">{pLakeside.title}</h3>
                    <p className="spotlight-loc" id="spotlightLoc">{pLakeside.loc}</p>
                    {/* MỤC MÔ TẢ CHO CARD LỚN */}
                    <p className="spotlight-narrative" id="spotlightNarrative">{pLakeside.narrative}</p>
                  </div>

                  {/* DEEP ARCHITECTURAL INSIGHTS (KHÁC BIỆT HOÀN TOÀN VỚI THẺ NHỎ) */}
                  <div className="spotlight-deep-details">
                    <div className="spotlight-detail-block">
                      <div className="detail-block-label">
                        <span className="detail-icon">🏛</span>
                        <span>{isJa ? "建築ソリューション" : isEn ? "Architectural Solution" : "Giải pháp kiến trúc & vi khí hậu"}</span>
                      </div>
                      <p className="detail-block-text" id="spotlightDesignSolution">
                        {pLakeside.solution}
                      </p>
                    </div>

                    <div className="spotlight-detail-block">
                      <div className="detail-block-label">
                        <span className="detail-icon">🪵</span>
                        <span>{isJa ? "マテリアル仕様" : isEn ? "Material Palette" : "Vật liệu hoàn thiện chủ đạo"}</span>
                      </div>
                      <p className="detail-block-text" id="spotlightMaterials">
                        {pLakeside.materials}
                      </p>
                    </div>
                  </div>

                  {/* SCOPE OF DELIVERABLES (HỒ SƠ BÀN GIAO) */}
                  <div className="spotlight-deliverables-wrap">
                    <div className="deliverables-heading-line">
                      <span>{isJa ? "納品成果物パッケージ" : isEn ? "Delivered Project Package" : "Gói hồ sơ đã hoàn thiện & bàn giao"}</span>
                    </div>
                    <div className="spotlight-deliverables-row" id="spotlightDeliverables">
                      {pLakeside.deliverables.map((item, idx) => (
                        <span key={idx} className="deliverable-pill">
                          <span className="pill-check">✓</span>
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ADVANCED ENGINEERING METRICS (4 CHỈ SỐ KỸ THUẬT) */}
                  <div className="spotlight-specs-grid" id="spotlightSpecsGrid">
                    {pLakeside.keyHighlights.map((s, idx) => (
                      <div key={idx} className="spec-cell">
                        <span className="spec-k">{s.label}</span>
                        <span className="spec-v highlight-green">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="spotlight-action-row">
                    <a href={contactHref} className="btn-spotlight-primary-cta" id="spotlightConsultBtn">
                      <span>{t.gallery.btnConsult}</span>
                      <span className="btn-icon">→</span>
                    </a>
                    <a href="tel:0984384190" className="btn-spotlight-consult">
                      <span>{t.gallery.hotlineText}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: DANH SÁCH THẺ DỰ ÁN */}
            <div className="gallery-split-right-col">
              <div className="gallery-curated-grid">
                {projectList.map((proj: any, idx: number) => {
                  const isSelected = idx === 0;
                  const delayClass = idx % 2 === 1 ? "delay-1" : "";
                  const specsList: any[] = Array.isArray(proj.specs) ? proj.specs : [];

                  return (
                    <article
                      key={proj.id || idx}
                      className={`project-gallery-card reveal-item ${delayClass} gallery-project-item ${isSelected ? "active-selected-card" : ""}`}
                      data-category={proj.category || "villa"}
                      data-project-id={proj.id}
                    >
                      <div className="gallery-card-thumb">
                        <img
                          src={proj.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"}
                          alt={proj.title}
                          className="gallery-card-img"
                        />
                        <div className="gallery-card-overlay">
                          <span className="card-view-btn">{t.gallery.btnViewDetail}</span>
                        </div>
                        <span className="card-floating-badge">{proj.catTag}</span>
                      </div>
                      <div className="gallery-card-content">
                        <div className="card-meta-line">
                          <span className="card-loc">{proj.loc}</span>
                          <span className="card-style">{proj.style || "Modern Architecture"}</span>
                        </div>
                        <h4 className="card-title">{proj.title}</h4>
                        <p className="card-desc">{proj.narrative}</p>
                        {specsList.length > 0 && (
                          <div className="card-footer-specs">
                            {specsList.map((sp: any, sIdx: number) => {
                              const val = typeof sp === "string" ? sp : (sp?.v || sp?.value || sp?.k || "");
                              if (!val) return null;
                              return <span key={sIdx} className="spec-chip">{val}</span>;
                            })}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          LIGHTBOX MODAL
          ========================================================================= */}
      <div className="gallery-fullscreen-lightbox" id="galleryModal" aria-hidden="true">
        <button className="lightbox-close-btn" id="modalCloseBtn" aria-label={isJa ? "閉じる" : isEn ? "Close" : "Đóng ảnh phóng to"}>✕</button>
        <div className="lightbox-content-wrap" id="lightboxContentWrap">
          <img src="" alt="Architecture Project" className="lightbox-full-img" id="modalMainImg" />
          <div className="lightbox-caption-bar">
            <div className="lightbox-title-box">
              <span id="modalProjTitle" className="lightbox-proj-title"></span>
              <span id="modalProjLoc" className="lightbox-proj-loc"></span>
            </div>
            <a href={contactHref} className="lightbox-consult-btn">
              <span>{t.lightbox.btnConsult}</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: PRICING (BÁO GIÁ MINH BẠCH)
          ========================================================================= */}
      <section className="pricing-architectural-section" id="bao-gia">
        <div className="content-container">

          <div className="pricing-header-block">
            <div className="pricing-header-split">
              <div className="pricing-title-col">
                <h2 className="pricing-main-heading">{t.pricing.title}</h2>
              </div>
              <div className="pricing-desc-col">
                <p className="pricing-sub-desc">
                  {t.pricing.sub}
                </p>
              </div>
            </div>
          </div>

          <div className="pricing-tiers-grid">
            {(pricingTiers && pricingTiers.length > 0
              ? pricingTiers
              : [
                  { ...(t.pricing.tier1 || {}), isFeatured: false },
                  { ...(t.pricing.tier2 || {}), isFeatured: true },
                  { ...(t.pricing.tier3 || {}), isFeatured: false },
                ]
            ).map((tier: any, idx: number) => {
              const isFeatured = Boolean(tier.isFeatured);
              const features: string[] = Array.isArray(tier.features) ? tier.features : [];

              return (
                <div
                  key={tier.id || idx}
                  className={`pricing-tier-card ${isFeatured ? "featured-tier" : ""}`}
                >
                  {isFeatured && (
                    <div className="tier-spotlight-ribbon">
                      {isJa
                        ? "✦ 75%のお客様に選ばれる標準プラン"
                        : isEn
                        ? "✦ CHOSEN BY 75% OF HOMEOWNERS"
                        : "✦ ĐƯỢC 75% GIA CHỦ LỰA CHỌN"}
                    </div>
                  )}

                  <div className="tier-card-header">
                    <span className={`tier-badge-pill ${isFeatured ? "highlight" : ""}`}>
                      {tier.badge}
                    </span>
                    <h3 className="tier-name">{tier.name}</h3>
                    <p className="tier-summary">{tier.sub}</p>
                  </div>

                  <div className="tier-price-box">
                    <span className="tier-price-from">
                      {isJa ? "参考価格" : isEn ? "FROM" : "CHỈ TỪ"}
                    </span>
                    <div className="tier-price-number-row">
                      <span className="tier-price-val">{tier.price}</span>
                      <span className="tier-price-unit">{tier.unit}</span>
                    </div>
                  </div>

                  <div className="tier-commitments-bar">
                    {tier.commitTime && (
                      <div className="commit-item">
                        <span className="commit-icon">⏱</span>
                        <span className="commit-text">
                          <strong>{tier.commitTime}</strong>
                        </span>
                      </div>
                    )}
                    {tier.commitSupport && (
                      <div className="commit-item">
                        <span className="commit-icon">✦</span>
                        <span className="commit-text">
                          <strong>{tier.commitSupport}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Danh sách đặc quyền & Tính năng (Ảnh 2) */}
                  <ul className="tier-features-list">
                    {features.map((f: string, fIdx: number) => (
                      <li key={fIdx}>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={contactHref}
                    className={`btn-tier-action ${isFeatured ? "solid" : "outline"}`}
                  >
                    <span>
                      {tier.btnText ||
                        (isJa
                          ? "プランについて相談する"
                          : isEn
                          ? "Inquire Package"
                          : "Tư vấn gói này")}
                    </span>
                    <span className="btn-arr">→</span>
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
