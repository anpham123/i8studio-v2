"use client";

import { useEffect } from "react";
import { getGalleryProjectsData, getDeliverableCollections } from "./landingI18n";

export default function LandingPageInteractive({
  locale = "ja",
  deliverableCollections,
  galleryProjects,
}: {
  locale?: string;
  deliverableCollections?: any[];
  galleryProjects?: Record<string, any>;
}) {
  useEffect(() => {
    // 1. Reveal-on-scroll: CHỈ XUẤT HIỆN KHI CUỘN ĐẾN GIỮA PHẦN NỘI DUNG (rootMargin: -38%)
    const generalRevealEls = document.querySelectorAll(".reveal-item, .reveal-left-up, .reveal-right-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
    );
    generalRevealEls.forEach((el) => {
      if (
        el.classList.contains("pain-card") ||
        el.classList.contains("bento-card") ||
        el.closest("#du-an") ||
        el.closest("#bao-gia")
      ) return;
      observer.observe(el);
    });

    // 1b. Dedicated Pain Cards Observer - Kích hoạt khi cuộn đến GIỮA phần Nỗi đau
    const painCards = document.querySelectorAll(".pain-card");
    const painSection = document.getElementById("noi-dau-khach-hang") || document.querySelector(".pain-points-section");
    if (painSection) {
      const painObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              painCards.forEach((card) => card.classList.add("revealed"));
              painObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      painObserver.observe(painSection);
    }

    // 1c. Dedicated Alternating Timeline Observer - Kích hoạt khi cuộn đến GIỮA quy trình
    const timelineEl = document.getElementById("alternatingTimeline");
    const timelineSection = document.getElementById("quy-trinh-thuc-hien");
    const targetToObserve = timelineSection || timelineEl;
    if (timelineEl && targetToObserve) {
      const timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timelineEl.classList.add("timeline-activated");
              timelineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      timelineObserver.observe(targetToObserve);
    }

    // 1d. Dedicated Observer for BỘ SƯU TẬP - Kích hoạt khi cuộn đến GIỮA phần bộ sưu tập
    const boSuuTapSection = document.getElementById("bo-suu-tap");
    if (boSuuTapSection) {
      const showcaseObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = boSuuTapSection.querySelectorAll(".collection-card-item, .collection-showcase-viewer");
              items.forEach((item) => item.classList.add("revealed"));
              showcaseObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      showcaseObserver.observe(boSuuTapSection);
    }

    // 1e. Dedicated Observer for HỆ THỐNG TRỤ CỘT BENTO - Kích hoạt khi cuộn đến GIỮA phần dịch vụ
    const dichVuSection = document.getElementById("dich-vu");
    if (dichVuSection) {
      const bentoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bentoCards = dichVuSection.querySelectorAll(".bento-card");
              bentoCards.forEach((card) => card.classList.add("revealed"));
              bentoObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      bentoObserver.observe(dichVuSection);
    }

    
    // 1f. Dedicated Observer for ẢNH 1 (Trust Dark Section - 4 trust cards)
    const trustSection = document.querySelector(".trust-dark-section");
    if (trustSection) {
      const trustObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cards = trustSection.querySelectorAll(".trust-card");
              cards.forEach((c) => c.classList.add("revealed"));
              trustObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      trustObserver.observe(trustSection);
    }

    // 1g. Dedicated Observer for ẢNH 2 (Applications Section - usecase cards)
    const appSection = document.getElementById("ung-dung-thuc-te");
    if (appSection) {
      const appObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const usecards = appSection.querySelectorAll(".usecase-card");
              usecards.forEach((c) => c.classList.add("revealed"));
              appObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      appObserver.observe(appSection);
    }

    // 1h. Dedicated Observer for ẢNH 3 (Clients Section - 4 cards + Marquee container)
    const clientsSection = document.getElementById("khach-hang");
    if (clientsSection) {
      const clientsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const indCards = clientsSection.querySelectorAll(".client-ind-card");
              indCards.forEach((c) => c.classList.add("revealed"));
              const marquees = document.querySelectorAll(".infinite-marquee-container");
              marquees.forEach((m) => m.classList.add("revealed"));
              clientsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -38% 0px" }
      );
      clientsObserver.observe(clientsSection);
    }

    // 1i. Dedicated Observer for Section 7: Gallery Showcase (Spotlight & Curated cards)
    const galleryHeader = document.querySelector("#du-an .gallery-header-block");
    if (galleryHeader) {
      const gHeaderObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              gHeaderObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -50px 0px" }
      );
      gHeaderObs.observe(galleryHeader);
    }

    const galleryLayout = document.querySelector("#du-an .gallery-showcase-split-layout");
    if (galleryLayout) {
      const gLayoutObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const spotlight = galleryLayout.querySelector(".gallery-hero-spotlight");
              if (spotlight) spotlight.classList.add("revealed");

              const cards = galleryLayout.querySelectorAll(".project-gallery-card");
              cards.forEach((c) => c.classList.add("revealed"));

              gLayoutObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -70px 0px" }
      );
      gLayoutObs.observe(galleryLayout);
    }

    // 1j. Dedicated Observer for Section 8: Pricing (Header & 3 Tier cards)
    const pricingHeader = document.querySelector("#bao-gia .pricing-header-block");
    if (pricingHeader) {
      const pHeaderObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              pHeaderObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -50px 0px" }
      );
      pHeaderObs.observe(pricingHeader);
    }

    const pricingGrid = document.querySelector("#bao-gia .pricing-tiers-grid");
    if (pricingGrid) {
      const pGridObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const tierCards = pricingGrid.querySelectorAll<HTMLElement>(".pricing-tier-card");
              // Card 1 trượt từ dưới lên (0.65s)
              if (tierCards[0]) {
                setTimeout(() => tierCards[0].classList.add("revealed"), 100);
              }
              // Card 2 trượt từ dưới lên
              if (tierCards[1]) {
                setTimeout(() => tierCards[1].classList.add("revealed"), 380);
              }
              // Card 3 trượt từ dưới lên
              if (tierCards[2]) {
                setTimeout(() => tierCards[2].classList.add("revealed"), 660);
              }
              pGridObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -80px 0px" }
      );
      pGridObs.observe(pricingGrid);
    }

    // 2. Hero Slideshow Auto Rotation
    const slides = document.querySelectorAll<HTMLElement>("#heroSlideshow .hero-slide");
    const counterEl = document.querySelector<HTMLElement>(".hero-slide-counter .slide-active");
    let currentSlide = 0;
    let slideInterval: NodeJS.Timeout | null = null;

    if (slides.length > 1) {
      slideInterval = setInterval(() => {
        slides[currentSlide]?.classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide]?.classList.add("active");
        if (counterEl) {
          counterEl.textContent = String(currentSlide + 1).padStart(2, "0");
        }
      }, 5000);
    }

    // 3. Workflow Steps Tabs (Stage 1 to 5)
    const stepBtns = document.querySelectorAll<HTMLElement>(".workflow-step-btn");
    const stagePanels = document.querySelectorAll<HTMLElement>(".workflow-stage-panel");

    const handleStepClick = (btn: HTMLElement) => {
      const stage = btn.getAttribute("data-stage");
      stepBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      stagePanels.forEach((panel) => {
        panel.classList.remove("active");
      });
      const targetPanel = document.getElementById(`stagePanel-${stage}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    };
    stepBtns.forEach((btn) => btn.addEventListener("click", () => handleStepClick(btn)));

    // 4. Compact Domain Dropdown & Bento Grid Dynamic Switcher
    const bentoDropdownWidget = document.getElementById("bentoDomainDropdown");
    const bentoDropdownBtn = document.getElementById("bentoDropdownBtn");
    const bentoDropdownMenu = document.getElementById("bentoDropdownMenu");
    const bentoCurrentDomainLabel = document.getElementById("bentoCurrentDomainLabel");
    const bentoScopeName = document.getElementById("bentoScopeName");
    const bentoOptions = document.querySelectorAll<HTMLElement>(".bento-option-item");

    // Domain data mapping for Bento Grid images and contextual copy
    const BENTO_DOMAIN_DATA: Record<string, {
      scope: string;
      label: string;
      img1: string; desc1: string;
      img2: string; desc2: string;
      img3: string; desc3: string;
      img4: string; desc4: string;
    }> = {
      all: {
        scope: "TẤT CẢ LĨNH VỰC",
        label: "Tất Cả Lĩnh Vực",
        img1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        desc1: "Tối ưu hóa công năng sống, đón sáng và luồng gió vi khí hậu tự nhiên.",
        img2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
        desc2: "Render 8K quang học sắc nét, mô phỏng ánh sáng vật lý PBR chuẩn xác 100%.",
        img3: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
        desc3: "May đo không gian sống cao cấp, hoàn thiện gỗ óc chó và đá Marble tự nhiên.",
        img4: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
        desc4: "Bóc tách khối lượng chi tiết từng viên gạch, cam kết bảo vệ ngân sách gia chủ.",
      },
      villa: {
        scope: "BIỆT THỰ & NHÀ PHỐ",
        label: "Biệt Thự & Nhà Phố",
        img1: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        desc1: "Thiết kế kiến trúc biệt thự đẳng cấp, hòa quyện sân vườn và hồ bơi xanh mát.",
        img2: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
        desc2: "Diễn họa phối cảnh ngoại thất villa góc hoàng hôn chân thực như ảnh chụp thực tế.",
        img3: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
        desc3: "Phòng khách thông tầng tráng lệ, vật liệu gỗ tự nhiên ấm cúng và sang trọng.",
        img4: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=85",
        desc4: "Dự toán kết cấu dầm sàn móng và hồ bơi biệt thự, khớp 100% bản vẽ thi công.",
      },
      apartment: {
        scope: "CĂN HỘ & PENTHOUSE",
        label: "Căn Hộ & Penthouse",
        img1: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85",
        desc1: "Tối ưu hóa diện tích mặt bằng căn hộ, mở rộng tầm nhìn panorama đắt giá.",
        img2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
        desc2: "Diễn họa 3D ánh sáng ban ngày & ban đêm penthouse view trọn đường chân trời.",
        img3: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
        desc3: "Nội thất may đo âm tường thông minh, tối ưu công năng từng mét vuông sinh hoạt.",
        img4: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
        desc4: "Hồ sơ kỹ thuật đạt chuẩn ban quản lý chung cư cao cấp, thi công đúng tiến độ.",
      },
      hospitality: {
        scope: "RESORT & KHÁCH SẠN",
        label: "Resort & Khách Sạn",
        img1: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
        desc1: "Quy hoạch không gian nghỉ dưỡng sinh thái, tạo trải nghiệm độc bản cho du khách.",
        img2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
        desc2: "Phim 3D flycam 4K và phối cảnh toàn cảnh khu resort bên bờ biển hùng vĩ.",
        img3: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        desc3: "Nội thất phòng Tổng thống chuẩn 5 sao quốc tế, vật liệu bản địa bền vững.",
        img4: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
        desc4: "Bóc tách khối lượng dự án resort quy mô lớn, tối ưu hóa suất đầu tư cho CĐT.",
      },
      commercial: {
        scope: "SHOWROOM & F&B",
        label: "Showroom & F&B",
        img1: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        desc1: "Không gian thương mại định vị thương hiệu, tối ưu hành trình trải nghiệm khách hàng.",
        img2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        desc2: "Mô phỏng 3D hiệu ứng ánh sáng rực rỡ thu hút khách hàng ngay từ mặt tiền.",
        img3: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
        desc3: "Vật liệu hoàn thiện thương mại chống mài mòn, thi công nhanh gọn tiết kiệm chi phí.",
        img4: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
        desc4: "Dự toán chi tiết tiến độ theo ca đêm, bàn giao đúng ngày khai trương.",
      },
      masterplan: {
        scope: "QUY HOẠCH & CẢNH QUAN",
        label: "Quy Hoạch & Cảnh Quan",
        img1: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
        desc1: "Phân vùng chức năng tổng thể đô thị và thiết kế cảnh quan sinh thái bền vững.",
        img2: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
        desc2: "Phim 3D quy hoạch hạ tầng vi mô và toàn cảnh đô thị tỷ lệ chính xác 100%.",
        img3: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
        desc3: "Không gian công cộng, clubhouse và sảnh đón tiếp tầm nhìn quy mô lớn.",
        img4: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
        desc4: "Bảng khái toán hạ tầng kỹ thuật và giải pháp phân kỳ đầu tư hiệu quả.",
      },
    };

    // Toggle Dropdown
    bentoDropdownBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      bentoDropdownWidget?.classList.toggle("open");
      const isOpen = bentoDropdownWidget?.classList.contains("open") || false;
      bentoDropdownBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close Dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (bentoDropdownWidget && !bentoDropdownWidget.contains(e.target as Node)) {
        bentoDropdownWidget.classList.remove("open");
        bentoDropdownBtn?.setAttribute("aria-expanded", "false");
      }
    });

    // Handle Option Selection
    bentoOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const domain = option.getAttribute("data-domain") || "all";
        const data = BENTO_DOMAIN_DATA[domain] || BENTO_DOMAIN_DATA.all;

        // Update active class on options
        bentoOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Update Button Label and Scope Header
        if (bentoCurrentDomainLabel) {
          bentoCurrentDomainLabel.textContent = data.label;
        }
        if (bentoScopeName) {
          bentoScopeName.textContent = data.scope;
        }

        // Close dropdown
        bentoDropdownWidget?.classList.remove("open");
        bentoDropdownBtn?.setAttribute("aria-expanded", "false");

        // Smooth transition for Bento Grid
        const bentoImg1 = document.getElementById("bentoImg1") as HTMLImageElement | null;
        const bentoImg2 = document.getElementById("bentoImg2") as HTMLImageElement | null;
        const bentoImg3 = document.getElementById("bentoImg3") as HTMLImageElement | null;
        const bentoImg4 = document.getElementById("bentoImg4") as HTMLImageElement | null;

        const bentoDesc1 = document.getElementById("bentoDesc1");
        const bentoDesc2 = document.getElementById("bentoDesc2");
        const bentoDesc3 = document.getElementById("bentoDesc3");
        const bentoDesc4 = document.getElementById("bentoDesc4");

        const allImgs = [bentoImg1, bentoImg2, bentoImg3, bentoImg4];
        allImgs.forEach((img) => img?.classList.add("fading"));

        setTimeout(() => {
          if (bentoImg1) bentoImg1.src = data.img1;
          if (bentoImg2) bentoImg2.src = data.img2;
          if (bentoImg3) bentoImg3.src = data.img3;
          if (bentoImg4) bentoImg4.src = data.img4;

          if (bentoDesc1) bentoDesc1.textContent = data.desc1;
          if (bentoDesc2) bentoDesc2.textContent = data.desc2;
          if (bentoDesc3) bentoDesc3.textContent = data.desc3;
          if (bentoDesc4) bentoDesc4.textContent = data.desc4;

          allImgs.forEach((img) => img?.classList.remove("fading"));
        }, 180);
      });
    });

    // 5. Deliverables Collections Rotating Showcase
    const DELIVERABLE_COLLECTIONS: any[] =
      Array.isArray(deliverableCollections) && deliverableCollections.length > 0
        ? deliverableCollections
        : getDeliverableCollections(locale);

    let currentDeliverableColIdx = 0;
    let currentDeliverablePhotoIdx = 0;
    let deliverableTimer: NodeJS.Timeout | null = null;
    let isDeliverableHovered = false;

    const colCards = document.querySelectorAll<HTMLElement>(".collection-card-item");
    const showcaseImg = document.getElementById("showcaseMainImg") as HTMLImageElement | null;
    const showcaseColName = document.getElementById("showcaseCollectionName");
    const showcaseCounter = document.getElementById("showcaseCounter");
    const showcaseTag = document.getElementById("showcasePhotoTag");
    const showcaseTitle = document.getElementById("showcasePhotoTitle");
    const showcaseDotsWrap = document.getElementById("showcaseDots");
    const showcaseTimerFill = document.getElementById("showcaseTimerFill");
    const showcaseStage = document.getElementById("showcaseStage");

    const syncDots = (photoCount: number, activeIdx: number) => {
      if (!showcaseDotsWrap) return;
      const currentDots = showcaseDotsWrap.querySelectorAll<HTMLButtonElement>(".showcase-dot");
      if (currentDots.length !== photoCount) {
        showcaseDotsWrap.innerHTML = "";
        for (let i = 0; i < photoCount; i++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `showcase-dot ${i === activeIdx ? "active" : ""}`;
          btn.setAttribute("data-p-idx", i.toString());
          btn.setAttribute("aria-label", `Photo ${i + 1}`);
          btn.addEventListener("click", () => {
            currentDeliverablePhotoIdx = i;
            renderShowcase(true);
            startDeliverablesTimer();
          });
          showcaseDotsWrap.appendChild(btn);
        }
      } else {
        currentDots.forEach((btn, idx) => {
          if (idx === activeIdx) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }
    };

    const renderShowcase = (instant: boolean = false) => {
      if (!DELIVERABLE_COLLECTIONS || DELIVERABLE_COLLECTIONS.length === 0) return;
      if (currentDeliverableColIdx >= DELIVERABLE_COLLECTIONS.length) {
        currentDeliverableColIdx = 0;
      }
      const col = DELIVERABLE_COLLECTIONS[currentDeliverableColIdx];
      if (!col || !Array.isArray(col.photos) || col.photos.length === 0) return;

      if (currentDeliverablePhotoIdx >= col.photos.length) {
        currentDeliverablePhotoIdx = 0;
      }
      const photo = col.photos[currentDeliverablePhotoIdx];
      if (!photo) return;

      // Update collection cards on left
      colCards.forEach((c) => {
        const idx = Number(c.getAttribute("data-col-idx"));
        if (idx === currentDeliverableColIdx) {
          c.classList.add("active");
        } else {
          c.classList.remove("active");
        }
      });

      // Update large image on right with smooth crossfade
      if (showcaseImg) {
        const targetSrc = photo.url || "";
        const targetAlt = photo.title || photo.tag || "Showcase Preview";
        if (!instant && showcaseImg.src !== targetSrc) {
          showcaseImg.classList.add("fading");
          setTimeout(() => {
            if (targetSrc) showcaseImg.src = targetSrc;
            showcaseImg.alt = targetAlt;
            showcaseImg.classList.remove("fading");
          }, 180);
        } else {
          if (targetSrc) showcaseImg.src = targetSrc;
          showcaseImg.alt = targetAlt;
        }
      }

      // Update text & counters
      if (showcaseColName) {
        showcaseColName.textContent = col.name || "";
      }
      if (showcaseCounter) {
        const countLabel = locale === "ja" ? "PHOTO" : locale === "en" ? "PHOTO" : "ẢNH";
        const curNum = String(currentDeliverablePhotoIdx + 1).padStart(2, "0");
        const totalNum = String(col.photos.length).padStart(2, "0");
        showcaseCounter.textContent = `${countLabel} ${curNum} / ${totalNum}`;
      }
      if (showcaseTag) {
        showcaseTag.textContent = photo.tag || "";
      }
      if (showcaseTitle) {
        showcaseTitle.textContent = photo.title || "";
      }

      // Update dots dynamically
      syncDots(col.photos.length, currentDeliverablePhotoIdx);

      // Reset timer bar animation
      if (showcaseTimerFill) {
        showcaseTimerFill.style.transition = "none";
        showcaseTimerFill.style.width = "0%";
        setTimeout(() => {
          if (showcaseTimerFill) {
            showcaseTimerFill.style.transition = "width 2s linear";
            showcaseTimerFill.style.width = "100%";
          }
        }, 30);
      }
    };

    const advanceShowcase = () => {
      if (isDeliverableHovered) return;
      if (!DELIVERABLE_COLLECTIONS || DELIVERABLE_COLLECTIONS.length === 0) return;
      const col = DELIVERABLE_COLLECTIONS[currentDeliverableColIdx];
      if (!col || !Array.isArray(col.photos) || col.photos.length === 0) {
        currentDeliverableColIdx = (currentDeliverableColIdx + 1) % DELIVERABLE_COLLECTIONS.length;
        currentDeliverablePhotoIdx = 0;
        renderShowcase();
        return;
      }

      currentDeliverablePhotoIdx++;
      // Khi chạy hết ảnh của bộ sưu tập này thì sẽ sang bộ sưu tập tiếp theo
      if (currentDeliverablePhotoIdx >= col.photos.length) {
        currentDeliverablePhotoIdx = 0;
        currentDeliverableColIdx = (currentDeliverableColIdx + 1) % DELIVERABLE_COLLECTIONS.length;
      }
      renderShowcase();
    };

    const startDeliverablesTimer = () => {
      if (deliverableTimer) clearInterval(deliverableTimer);
      // Tự động sau 2s sẽ chạy 1 ảnh của bộ sưu tập
      deliverableTimer = setInterval(advanceShowcase, 2000);
    };

    // User click collection card on left
    colCards.forEach((c) => {
      c.addEventListener("click", () => {
        const idx = Number(c.getAttribute("data-col-idx"));
        if (!isNaN(idx) && DELIVERABLE_COLLECTIONS[idx]) {
          currentDeliverableColIdx = idx;
          currentDeliverablePhotoIdx = 0;
          renderShowcase(true);
          startDeliverablesTimer();
        }
      });
    });

    // Hover stage pauses timer for inspection
    if (showcaseStage) {
      showcaseStage.addEventListener("mouseenter", () => {
        isDeliverableHovered = true;
      });
      showcaseStage.addEventListener("mouseleave", () => {
        isDeliverableHovered = false;
      });
    }

    // Start initially
    renderShowcase(true);
    startDeliverablesTimer();

    // 6. Floating Lead Widget Toggle
    const floatToggleBtn = document.getElementById("floatingLeadToggleBtn");
    const floatCloseBtn = document.getElementById("floatingLeadCloseBtn");
    const floatPanel = document.getElementById("floatingLeadPanel");

    const handleFloatToggle = () => {
      floatPanel?.classList.toggle("active");
    };
    const handleFloatClose = () => {
      floatPanel?.classList.remove("active");
    };

    floatToggleBtn?.addEventListener("click", handleFloatToggle);
    floatCloseBtn?.addEventListener("click", handleFloatClose);

    // 7. Modal / Lightbox
    const modal = document.getElementById("projectModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalBackdrop = document.getElementById("modalBackdrop");

    const closeModal = () => {
      if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    };

    modalCloseBtn?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", closeModal);

    const exhibitCards = document.querySelectorAll(".exhibit-card, .project-card");
    const handleCardClick = () => {
      if (modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    };
    exhibitCards.forEach((c) => c.addEventListener("click", handleCardClick));

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-accordion-item, .faq-item");
    const handleFaqClick = function (this: HTMLElement) {
      this.classList.toggle("active");
    };
    faqItems.forEach((item) => item.addEventListener("click", handleFaqClick));

    // 9. Portfolio Filter Tabs
    const filterTabs = document.querySelectorAll<HTMLElement>(".filter-tab-btn, .portfolio-tab");
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const category = tab.getAttribute("data-filter") || tab.getAttribute("aria-controls");
        const cards = document.querySelectorAll<HTMLElement>(".exhibit-card, .portfolio-item");
        cards.forEach((card) => {
          if (!category || category === "all" || category === "panel-all" || card.classList.contains(category)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // 9b. Usecase Filter Tabs (Ứng dụng thực tế)
    const usecaseTabs = document.querySelectorAll<HTMLElement>(".usecase-tab-btn");
    usecaseTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        usecaseTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const filterVal = tab.getAttribute("data-filter") || "all";
        const cards = document.querySelectorAll<HTMLElement>(".usecase-card");
        cards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          if (filterVal === "all" || cardCat === filterVal) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // 10. Architectural Showcase & Gallery (Bộ Sưu Tập Công Trình & Mẫu Thiết Kế)
    const baseGalleryData = getGalleryProjectsData(locale);
    const GALLERY_PROJECTS_DATA = galleryProjects && Object.keys(galleryProjects).length > 0
      ? { ...baseGalleryData, ...galleryProjects }
      : baseGalleryData;

    let currentSpotlightId = "p-lakeside";

    const loadProjectToSpotlight = (projId: string) => {
      const data = GALLERY_PROJECTS_DATA[projId];
      if (!data) return;
      currentSpotlightId = projId;

      const spotlightEl = document.getElementById("galleryHeroSpotlight");
      const mainImg = document.getElementById("spotlightMainImg") as HTMLImageElement | null;
      const catTag = document.getElementById("spotlightCatTag");
      const title = document.getElementById("spotlightTitle");
      const loc = document.getElementById("spotlightLoc");
      const narrativeEl = document.getElementById("spotlightNarrative");
      const solutionEl = document.getElementById("spotlightDesignSolution");
      const materialsEl = document.getElementById("spotlightMaterials");
      const deliverablesEl = document.getElementById("spotlightDeliverables");
      const specsGrid = document.getElementById("spotlightSpecsGrid");

      if (spotlightEl) {
        spotlightEl.setAttribute("data-project-id", projId);
        spotlightEl.classList.remove("fade-in-refresh");
        void spotlightEl.offsetWidth; // trigger reflow
        spotlightEl.classList.add("fade-in-refresh");
      }

      if (mainImg) {
        mainImg.src = data.img;
        mainImg.alt = "Dự án tiêu điểm " + data.title;
      }
      if (catTag) catTag.textContent = data.catTag;
      if (title) title.textContent = data.title;
      if (loc) loc.textContent = data.loc;
      if (narrativeEl && data.narrative) narrativeEl.textContent = data.narrative;
      if (solutionEl && data.solution) solutionEl.textContent = data.solution;
      if (materialsEl && data.materials) materialsEl.textContent = data.materials;

      if (deliverablesEl && data.deliverables) {
        deliverablesEl.innerHTML = (data.deliverables as any[])
          .map(
            (item: any) =>
              '<span class="deliverable-pill">' +
              '<span class="pill-check">✓</span>' +
              '<span>' + item + '</span>' +
              '</span>'
          )
          .join("");
      }

      if (specsGrid && data.keyHighlights) {
        specsGrid.innerHTML = (data.keyHighlights as any[])
          .map(
            (s: any) =>
              '<div class="spec-cell">' +
              '<span class="spec-k">' + s.label + '</span>' +
              '<span class="spec-v highlight-green">' + s.value + '</span>' +
              '</div>'
          )
          .join("");
      }

      // Highlight active card in right column
      const allCards = document.querySelectorAll(".project-gallery-card");
      allCards.forEach((c) => {
        if (c.getAttribute("data-project-id") === projId) {
          c.classList.add("active-selected-card");
        } else {
          c.classList.remove("active-selected-card");
        }
      });
    };

    // Lightbox Modal for 8K Image & Specs
    const galleryModal = document.getElementById("galleryModal");
    const zoomHintBtn = document.getElementById("spotlightZoomHint");
    const spotlightVisualFrame = document.getElementById("spotlightVisualFrame");
    const galleryModalCloseBtn = document.getElementById("modalCloseBtn");
    const modalMainImg = document.getElementById("modalMainImg") as HTMLImageElement | null;
    const modalImgCaption = document.getElementById("modalImgCaption");
    const modalCatTag = document.getElementById("modalCatTag");
    const modalProjTitle = document.getElementById("modalProjTitle");
    const modalProjLoc = document.getElementById("modalProjLoc");
    const modalProjDesc = document.getElementById("modalProjDesc");
    const modalSpecsList = document.getElementById("modalSpecsList");

    const openGalleryModal = (projId: string) => {
      const data = GALLERY_PROJECTS_DATA[projId] || GALLERY_PROJECTS_DATA[currentSpotlightId];
      if (!data || !galleryModal) return;

      if (modalMainImg) {
        modalMainImg.src = data.img;
        modalMainImg.alt = data.title;
      }
      if (modalProjTitle) modalProjTitle.textContent = data.title;
      if (modalProjLoc) modalProjLoc.textContent = data.loc;

      galleryModal.classList.add("open");
      galleryModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeGalleryModal = () => {
      if (!galleryModal) return;
      galleryModal.classList.remove("open");
      galleryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const handleZoomClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      openGalleryModal(currentSpotlightId);
    };

    zoomHintBtn?.addEventListener("click", handleZoomClick);
    spotlightVisualFrame?.addEventListener("click", handleZoomClick);
    galleryModalCloseBtn?.addEventListener("click", closeGalleryModal);

    const handleGalleryModalBackdrop = (e: MouseEvent) => {
      const contentWrap = document.getElementById("lightboxContentWrap");
      if (e.target === galleryModal || (contentWrap && !contentWrap.contains(e.target as Node))) {
        closeGalleryModal();
      }
    };
    galleryModal?.addEventListener("click", handleGalleryModalBackdrop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && galleryModal?.classList.contains("open")) {
        closeGalleryModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Click on Project Card (Right Column)
    const galleryCards = document.querySelectorAll<HTMLElement>(".gallery-project-item");
    const handleGalleryCardClick = function (this: HTMLElement, e: MouseEvent) {
      const projId = this.getAttribute("data-project-id");
      if (!projId) return;

      loadProjectToSpotlight(projId);

      // If user clicked the "Xem chi tiết ↗" button directly, also open modal
      const target = e.target as HTMLElement;
      if (target && target.closest(".card-view-btn")) {
        e.stopPropagation();
        openGalleryModal(projId);
      }
    };

    galleryCards.forEach((card) => {
      card.addEventListener("click", handleGalleryCardClick);
    });

    // Also attach direct click handlers on .card-view-btn
    const cardViewBtns = document.querySelectorAll<HTMLElement>(".card-view-btn");
    const handleCardViewBtnClick = function (this: HTMLElement, e: MouseEvent) {
      e.stopPropagation();
      const parentCard = this.closest(".project-gallery-card");
      const projId = parentCard?.getAttribute("data-project-id");
      if (projId) {
        loadProjectToSpotlight(projId);
        openGalleryModal(projId);
      }
    };
    cardViewBtns.forEach((btn) => {
      btn.addEventListener("click", handleCardViewBtnClick);
    });

    // Category Filter Buttons
    const galleryTabs = document.querySelectorAll<HTMLElement>(".gallery-tab-btn");
    const handleGalleryTabClick = (tab: HTMLElement) => {
      galleryTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const filterVal = tab.getAttribute("data-gallery-filter") || "all";
      let firstMatchingId: string | null = null;

      const currentCards = document.querySelectorAll<HTMLElement>(".gallery-project-item");
      currentCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const cardId = card.getAttribute("data-project-id");
        if (filterVal === "all" || cardCat === filterVal) {
          card.style.display = "";
          if (!firstMatchingId && cardId) firstMatchingId = cardId;
        } else {
          card.style.display = "none";
        }
      });

      // If active spotlight doesn't match filter, load first matching project
      const currentData = GALLERY_PROJECTS_DATA[currentSpotlightId];
      if (filterVal !== "all" && currentData && currentData.category !== filterVal) {
        if (firstMatchingId) {
          loadProjectToSpotlight(firstMatchingId);
        } else if (filterVal === "villa") {
          loadProjectToSpotlight("p-lakeside");
        }
      }
    };

    galleryTabs.forEach((tab) => {
      tab.addEventListener("click", () => handleGalleryTabClick(tab));
    });

    return () => {
      observer.disconnect();
      if (slideInterval) clearInterval(slideInterval);
      if (deliverableTimer) clearInterval(deliverableTimer);
      zoomHintBtn?.removeEventListener("click", handleZoomClick);
      spotlightVisualFrame?.removeEventListener("click", handleZoomClick);
      galleryModalCloseBtn?.removeEventListener("click", closeGalleryModal);
      galleryModal?.removeEventListener("click", handleGalleryModalBackdrop);
      document.removeEventListener("keydown", handleKeyDown);
      galleryCards.forEach((c) => c.removeEventListener("click", handleGalleryCardClick));
      cardViewBtns.forEach((btn) => btn.removeEventListener("click", handleCardViewBtnClick));
    };
  }, [locale, deliverableCollections]);

  return null;
}
