import React from "react";
import type { Metadata } from "next";
import "./landingpage.css";
import LandingPageInteractive from "./LandingPageInteractive";
import LandingHero3D from "./LandingHero3D";
import LandingChallengesSolutions from "./LandingChallengesSolutions";
import LandingGalleryShowcase from "./LandingGalleryShowcase";
import { getLandingContent, getGalleryProjectsData, getDeliverableCollections } from "./landingI18n";
import { getMergedLandingContent, DEFAULT_SECTION_ORDER } from "@/lib/landingpage-data";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "KONTUR — 建築設計・3DCG空間ビジュアライゼーション",
    description:
      "技術基準に準拠した高精度な建築設計と、100%フォトリアルな3DCG空間ビジュアライゼーション。細部まで視覚化し、コストをコントロールし、施工ミスを未然に防ぎます。",
  };
}

function renderQuoteWithBreaks(text?: string) {
  if (!text) return null;
  const parts = String(text).split(/<\\?br\s*\/?>|<\/?[bB][rR]\s*\/?>|<\\[bB][rR]\s*\/?>|\n/gi);
  if (parts.length <= 1) {
    return <span className="quote-line block">{text}</span>;
  }
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="quote-line block">
          {part}
        </span>
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
  // Landing page chỉ sử dụng tiếng Nhật trên giao diện user
  const isJa = true;
  const isEn = false;
  const contactHref = `/${currentLocale}/contact`;

  const {
    t,
    layoutConfig,
    galleryProjects: galleryData,
    galleryTabs,
    deliverableCollections: deliverables,
    applicationCards,
    applicationCategories,
    partnerStats,
    partnerBrands,
  } = await getMergedLandingContent("ja");

  const pLakeside = galleryData["p-lakeside"] || Object.values(galleryData)[0] || {
    id: "p-lakeside",
    category: "villa",
    catTag: "高級リゾートヴィラ",
    title: "THE LAKESIDE HORIZON VILLA",
    loc: "ホーチャム · 850 m²",
    narrative: "",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
    priceEstimate: "設計・3D目安: ¥3,500,000〜 (¥4,100/m²)",
    solution: "",
    materials: "",
    deliverables: [],
    keyHighlights: [],
    specs: [],
  };
  const projectList = Object.values(galleryData);

  const sectionOrder = (layoutConfig?.order && layoutConfig.order.length > 0)
    ? layoutConfig.order
    : DEFAULT_SECTION_ORDER;
  const visibleMap = layoutConfig?.visible || {};
  const bgMap = layoutConfig?.backgroundColors || {};

  const getSectionStyle = (key: string): React.CSSProperties | undefined => {
    // Áp dụng màu nền được tùy biến trong Admin
    const customBg = bgMap[key];
    if (customBg && customBg.trim()) {
      return {
        background: customBg,
        backgroundColor: customBg,
        backgroundImage: customBg.includes("gradient") ? customBg : "none",
      };
    }
    return undefined;
  };

  /* =========================================================================
     SECTION 1: HERO
     ========================================================================= */
  const renderHero = () => (
    <LandingHero3D
      key="hero"
      locale="ja"
      heroContent={t.hero}
      style={getSectionStyle("hero")}
    />
  );

  /* =========================================================================
     SECTION 2: NỖI ĐAU & GIẢI PHÁP KONTUR (2 PHẦN TÁCH BIỆT - LIÊN KẾT TRỰC DIỆN 1-1)
     PHẦN 1: Nỗi đau & Thách thức thực tế (4 thẻ trích dẫn)
     CẦU NỐI: Ma trận liên kết trực diện 1-1 giữa Vấn đề và Giải pháp
     PHẦN 2: 4 Trụ cột Giải pháp đột phá Kontur (4 thẻ ma trận bento)
     Màu sắc, cỡ chữ, font chữ, nền đồng bộ 100% với Section 4 (Alabaster Cream)
     ========================================================================= */
  const renderPainPoints = () => (
    <LandingChallengesSolutions
      locale={currentLocale}
      painPointsData={t.painPoints}
      solutionsData={t.solutions}
      title={t.painPoints?.title}
      rawCards={t.painPoints?.cards}
      style={getSectionStyle("pain-points")}
    />
  );

  /* =========================================================================
     SECTION 3: WORKFLOW DIRECT (5 BƯỚC)
     ========================================================================= */
  const renderWorkflow = () => (
    <section
      key="workflow"
      className="workflow-direct-section"
      id="quy-trinh-thuc-hien"
      style={getSectionStyle("workflow")}
    >
      <div className="workflow-fullwidth-container">
        <div className="workflow-title-center-wrap reveal-item">
          <h2 className="workflow-single-line-title">
            {t.workflow?.title}
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
              const isEvenSlot = idx % 2 === 0;
              const defaultImages = [
                "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=85",
              ];
              const defaultStageTags = [
                "STAGE 01 • 現況調査",
                "STAGE 02 • WHITEBOX",
                "STAGE 03 • RENDER 8K",
                "STAGE 04 • CINEMA & VR",
                "STAGE 05 • 図面＆積算",
              ];

              const imgSrc = step.stepImage || defaultImages[idx % defaultImages.length];
              const stageTag = step.stepStageTag || defaultStageTags[idx % defaultStageTags.length] || `STAGE ${stepNumStr}`;
              const badgeText = `ステップ ${stepNumStr}`;

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
  );

  /* =========================================================================
     SECTION 4: DELIVERABLES (BỘ SƯU TẬP HỒ SƠ)
     ========================================================================= */
  const renderDeliverables = () => {
    const firstCol = deliverables?.[0];
    const firstPhoto = firstCol?.photos?.[0];
    const totalPhotos = firstCol?.photos?.length || 1;
    const initialSrc =
      firstPhoto?.url ||
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85";
    const initialAlt = firstPhoto?.title || "Showcase Preview";
    const initialTag = firstPhoto?.tag || "A3総合平面図";
    const initialTitle = firstPhoto?.title || "01. 建築意匠平面図＆全体機能レイアウト";

    return (
      <section
        key="deliverables"
        className="deliverables-compare-section"
        id="bo-suu-tap"
        style={getSectionStyle("deliverables")}
      >
        <div className="showcase-fullwidth-container">
          <div className="deliverables-gallery-block reveal-item">
            <div className="deliverables-block-header">
              <h2 className="deliverables-block-title">{t.deliverables?.title}</h2>
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
                  const countLabel = `${photoCount}点（図面・画像）`;
                  const colNumLabel = `コレクション 0${idx + 1}`;

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
                      {`PHOTO 01 / 0${totalPhotos}`}
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

            </div>
          </div>
        </div>
      </section>
    );
  };

  /* =========================================================================
     SECTION 5: SERVICES BENTO GRID
     ========================================================================= */
  const renderServicesBento = () => {
    const defaultBentoImages = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
    ];

    const bentoCards: any[] = (t.servicesBento as any)?.cards || [
      t.servicesBento?.card1,
      t.servicesBento?.card2,
      t.servicesBento?.card3,
      t.servicesBento?.card4,
    ].filter(Boolean);

    return (
      <section
        key="services-bento"
        className="services-pillars-section"
        id="dich-vu"
        style={getSectionStyle("services-bento")}
      >
        <div className="content-container">
          <div className="services-bento-header-center reveal-item">
            <h2 className="services-bento-single-title">
              {t.servicesBento?.title}
            </h2>
            <div className="workflow-title-decor" aria-hidden="true">
              <span className="workflow-decor-line left"></span>
              <span className="workflow-decor-sparkle">✦</span>
              <span className="workflow-decor-line right"></span>
            </div>
          </div>

          <div className="services-bento-grid" id="servicesBentoGrid">
            {bentoCards.map((card: any, idx: number) => {
              const rowIdx = Math.floor(idx / 2);
              const posInRow = idx % 2;
              const isEvenRow = rowIdx % 2 === 0;
              const colClass = isEvenRow
                ? (posInRow === 0 ? "bento-card-7col" : "bento-card-5col")
                : (posInRow === 0 ? "bento-card-5col" : "bento-card-7col");
              const slideClass = isEvenRow ? "bento-slide-left" : "bento-slide-right";
              const delayClass = `delay-${posInRow}`;
              const cardImg = card.image || defaultBentoImages[idx % defaultBentoImages.length];

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
            })}
          </div>
        </div>
      </section>
    );
  };

  /* =========================================================================
     SECTION 6: CLIENTS & TRUST DARK
     ========================================================================= */
  const renderClients = () => (
    <section
      key="clients"
      className="trust-dark-section"
      id="doi-tac"
      style={getSectionStyle("clients")}
    >
      <div className="content-container">
        <div className="trust-header-block reveal-item">
          <span className="trust-eyebrow">
            {t.clients?.eyebrow || "500件以上の実績が証明する確かな信頼"}
          </span>
          <h2 className="trust-title">{t.clients?.title}</h2>
        </div>

        <div className="trust-4col-grid">
          {(t.clients?.trustCards || []).map((card: any, idx: number) => (
            <div key={idx} className={`trust-card reveal-item delay-${idx}`}>
              <span className="trust-num">0{idx + 1}</span>
              <h4 className="trust-card-title">{card.title}</h4>
              <p className="trust-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* =========================================================================
     SECTION 7: APPLICATIONS THEO TỪNG LĨNH VỰC
     ========================================================================= */
  const renderApplications = () => (
    <section
      key="applications"
      className="applications-section"
      id="ung-dung-thuc-te"
      style={getSectionStyle("applications")}
    >
      <div className="content-container">
        <div className="section-title-split reveal-item">
          <div className="title-left">
            <h2 className="sec-main-title">{t.applications?.title}</h2>
          </div>
          <div className="title-right">
            <p className="sec-subtitle">
              {t.applications?.subtitle || "空間ビジュアライゼーションと設計シミュレーションを、企画・販売促進・コスト管理・現場施工の各段階に直接適用。"}
            </p>
          </div>
        </div>

        <div className="usecase-filter-bar reveal-item">
          <button type="button" className="usecase-tab-btn active" data-filter="all">
            {`全応用分野 (${String((applicationCards || t.applications?.cards || []).length).padStart(2, "0")})`}
          </button>
          {(applicationCategories || t.applications?.categories || []).map((cat: any) => (
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
            {(applicationCards || t.applications?.cards || []).map((card: any, idx: number) => {
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
                        {card.problemLabel || "解決する課題＆ニーズ:"}
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
                          {card.outcomeLabel || "もたらす成果:"}
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
  );

  /* =========================================================================
     SECTION 8: CLIENTS & PARTNERS MARQUEE
     ========================================================================= */
  const renderPartners = () => {
    const displayBrands = (partnerBrands && partnerBrands.length > 0)
      ? partnerBrands
      : [
          {
            name: "MASTERISE HOMES",
            sub: "高級不動産開発",
            img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "NOVALAND GROUP",
            sub: "都市＆リゾート",
            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "COTECCONS",
            sub: "総合建設",
            img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "HÒA BÌNH CORP",
            sub: "建設コングロマリット",
            img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "MIA DESIGN",
            sub: "建築設計事務所",
            img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "AN CƯỜNG WOOD",
            sub: "インテリア建材",
            img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
          },
        ];

    const repeatCount = Math.max(2, Math.ceil(18 / Math.max(1, displayBrands.length)));
    const marqueeGroupCards = Array.from({ length: repeatCount }).flatMap(() => displayBrands);

    return (
      <section
        key="partners"
        className="clients-marquee-section"
        id="khach-hang"
        style={getSectionStyle("partners")}
      >
        <div className="content-container">
          <div className="clients-header-center reveal-item">
            <h2 className="clients-centered-title">
              {t.partners?.title || "全国250社以上のパートナー＆企業様"}
            </h2>
            <div className="workflow-title-decor" aria-hidden="true">
              <span className="workflow-decor-line left"></span>
              <span className="workflow-decor-sparkle">✦</span>
              <span className="workflow-decor-line right"></span>
            </div>
          </div>

          <div className="client-industry-grid reveal-item">
            {(partnerStats && partnerStats.length > 0 ? partnerStats : [
              { num: "120+", name: "ヴィラ＆高級レジデンス", desc: "国内外の個人施主様・富裕層住宅" },
              { num: "45+", name: "不動産開発・都市計画", desc: "プレセール販売促進およびマーケティング" },
              { num: "60+", name: "建築設計事務所＆デザインスタジオ", desc: "国際デザイン誌基準のCGパース委託パートナー" },
              { num: "35+", name: "リゾートホテル＆商業施設", desc: "独自の世界観を持つ空間コンセプトと高級飲食チェーン" },
            ]).map((stat: any, idx: number) => (
              <div key={idx} className={`client-ind-card delay-${idx % 4}`}>
                <span className="ind-num">{stat.num}</span>
                <h4 className="ind-name">{stat.name}</h4>
                <p className="ind-desc">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="infinite-marquee-container marquee-left-flow">
          <div className="marquee-track">
            <div className="marquee-group">
              {marqueeGroupCards.map((partner: any, idx: number) => (
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

            <div className="marquee-group" aria-hidden="true">
              {marqueeGroupCards.map((partner: any, idx: number) => (
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
      </section>
    );
  };

  /* =========================================================================
     SECTION 9: GALLERY EXHIBITION
     ========================================================================= */
  const renderGallery = () => (
    <LandingGalleryShowcase
      key="gallery"
      title={t.gallery?.title}
      subtitle={(t.gallery as any)?.sub || (t.gallery as any)?.subtitle || (t.gallery as any)?.info?.subtitle || (t.gallery as any)?.info?.sub}
      projects={projectList as any}
      contactHref={contactHref}
      style={getSectionStyle("gallery")}
      defaultSpotlightId={pLakeside?.id}
    />
  );

  /* =========================================================================
     SECTION 10: ARCHITECTURAL EDITORIAL CTA (SUSTAINABLE DESIGN - IMAGE 3)
     - Cột trái: Tiêu đề Sustainable Design., 1 câu Slogan, Nút Contact, 4 card contact với icon thật
     - Đã bỏ mô tả chi tiết dưới tiêu đề
     - Đã bỏ 2 chỉ số 15+ & 200+ (Ảnh 4) theo yêu cầu
     - Cột phải: Ảnh kiến trúc lớn không bo góc
     ========================================================================= */
  const renderCta = () => {
    const cta = (t as any)?.cta || {};

    const titleTop = cta.titleTop || "Sustainable";
    const titleBottom = cta.titleBottom || "Design.";
    const slogan = cta.slogan || cta.subTitle || "Enduring Beauty.";
    const btnText = cta.btnText || "Contact";
    const btnUrl = cta.btnHref || contactHref;

    const heroImg = cta.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

    const card1Lbl = cta.card1Label || "Hotline / お電話窓口";
    const card1Val = cta.card1Val || "0984 384 190";
    const card1Href = cta.card1Href || "tel:0984384190";

    const card2Lbl = cta.card2Label || "Email / メール受付";
    const card2Val = cta.card2Val || "info@i8studio.vn";
    const card2Href = cta.card2Href || "mailto:info@i8studio.vn";

    const card3Lbl = cta.card3Label || "Support / 相談対応";
    const card3Val = cta.card3Val || "24時間以内返答・土日祝相談可能";

    const card4Lbl = cta.card4Label || "Studio / 拠点";
    const card4Val = cta.card4Val || "Tokyo & Ho Chi Minh City";

    return (
      <section
        key="cta"
        className="cta-architectural-section"
        id="dang-ky-tu-van"
        style={getSectionStyle("cta")}
      >
        <div className="cta-wide-container">
          <div className="cta-architectural-grid">
            {/* CỘT TRÁI: NỘI DUNG (SLOGAN FULL WIDTH, BUTTON CONTACT Ở GIỮA, 4 CARD CONTACT DƯỚI CÁCH XA) */}
            <div className="cta-arch-content-col">
              <div className="cta-arch-lead-block">
                {/* Câu Slogan kích thước to full width, hỗ trợ xuống dòng <\br> */}
                <h2 className="cta-arch-slogan-heading reveal-item">
                  {renderQuoteWithBreaks(slogan)}
                </h2>

                {/* NÚT BUTTON CONTACT Ở CHÍNH GIỮA */}
                <div className="cta-arch-btn-row reveal-item">
                  <a href={btnUrl} className="cta-arch-contact-btn">
                    <span>{btnText}</span>
                    <span className="cta-btn-arrow">→</span>
                  </a>
                </div>

                {/* 4 CARD CONTACT Ở DƯỚI - CHỈ ĐỂ XEM THÔNG TIN, BỎ CLICK */}
                <div className="cta-arch-contact-info-block reveal-item">
                  <div className="cta-contact-info-grid">
                    <div className="cta-contact-item-card delay-0">
                      <div className="cta-contact-icon-box">
                        <Phone size={17} className="text-amber-600" />
                      </div>
                      <div className="cta-contact-text">
                        <span className="cta-contact-lbl">{card1Lbl}</span>
                        <strong className="cta-contact-val">{card1Val}</strong>
                      </div>
                    </div>

                    <div className="cta-contact-item-card delay-1">
                      <div className="cta-contact-icon-box">
                        <Mail size={17} className="text-amber-600" />
                      </div>
                      <div className="cta-contact-text">
                        <span className="cta-contact-lbl">{card2Lbl}</span>
                        <strong className="cta-contact-val">{card2Val}</strong>
                      </div>
                    </div>

                    <div className="cta-contact-item-card delay-2">
                      <div className="cta-contact-icon-box">
                        <Clock size={17} className="text-amber-600" />
                      </div>
                      <div className="cta-contact-text">
                        <span className="cta-contact-lbl">{card3Lbl}</span>
                        <span className="cta-contact-val-text">{card3Val}</span>
                      </div>
                    </div>

                    <div className="cta-contact-item-card delay-3">
                      <div className="cta-contact-icon-box">
                        <MapPin size={17} className="text-amber-600" />
                      </div>
                      <div className="cta-contact-text">
                        <span className="cta-contact-lbl">{card4Lbl}</span>
                        <span className="cta-contact-val-text">{card4Val}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: ẢNH LỚN FULL ẢNH KHÔNG BO GÓC - HIỆU ỨNG TRƯỢT TỪ PHẢI QUA */}
            <div className="cta-arch-photo-col reveal-item">
              <div className="cta-arch-full-photo-wrap">
                <img
                  src={heroImg}
                  alt="Sustainable Architectural Design"
                  className="cta-arch-full-photo"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSectionByKey = (sectionKey: string) => {
    if (visibleMap[sectionKey] === false) {
      return null;
    }
    switch (sectionKey) {
      case "hero":
        return renderHero();
      case "pain-points":
        return renderPainPoints();
      case "workflow":
        return renderWorkflow();
      case "deliverables":
        return renderDeliverables();
      case "services-bento":
        return renderServicesBento();
      case "clients":
        return null; // Bỏ nội dung Ảnh 1 theo yêu cầu
      case "applications":
        return renderApplications();
      case "partners":
        return renderPartners();
      case "gallery":
        return renderGallery();
      case "cta":
        return renderCta();
      default:
        return null;
    }
  };

  return (
    <div className="landingpage-root">
      <LandingPageInteractive
        locale="ja"
        deliverableCollections={deliverables}
        galleryProjects={galleryData}
      />

      {/* RENDER SECTIONS DYNAMICALLY IN CONFIGURED ORDER */}
      {sectionOrder.map((sectionKey: string) => (
        <React.Fragment key={sectionKey}>
          {renderSectionByKey(sectionKey)}
        </React.Fragment>
      ))}

      {/* Lightbox is managed dynamically by LandingGalleryShowcase with full React state */}
    </div>
  );
}
