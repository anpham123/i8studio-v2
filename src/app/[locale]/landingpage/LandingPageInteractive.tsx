"use client";

import { useEffect } from "react";

export default function LandingPageInteractive() {
  useEffect(() => {
    // 1. Reveal-on-scroll with IntersectionObserver
    const revealEls = document.querySelectorAll(".reveal-item, .reveal-left-up, .reveal-right-up, .pain-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px" }
    );
    revealEls.forEach((el) => {
      observer.observe(el);
      // If already in viewport or near top, immediately reveal
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add("revealed");
      }
    });

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

    // 4. Domain Tab Switcher (Villa, Shophouse, Penthouse, etc.)
    const domainTabs = document.querySelectorAll<HTMLElement>(".domain-tab-btn");
    const domainPanels = document.querySelectorAll<HTMLElement>(".domain-content-panel");

    const handleDomainClick = (tab: HTMLElement) => {
      const domain = tab.getAttribute("data-domain");
      domainTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      domainPanels.forEach((panel) => {
        panel.classList.remove("active");
      });
      const targetPanel = document.getElementById(`domainPanel-${domain}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    };
    domainTabs.forEach((tab) => tab.addEventListener("click", () => handleDomainClick(tab)));

    // 5. Before / After Comparison Slider
    const baContainer = document.getElementById("baContainer");
    if (baContainer) {
      let isDragging = false;
      const updateSlider = (clientX: number) => {
        const rect = baContainer.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        baContainer.style.setProperty("--clip-pos", `${pct}%`);
      };

      const onMouseDown = () => { isDragging = true; };
      const onMouseUp = () => { isDragging = false; };
      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) updateSlider(e.clientX);
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) updateSlider(e.touches[0].clientX);
      };

      baContainer.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      baContainer.addEventListener("mousemove", onMouseMove);
      baContainer.addEventListener("touchmove", onTouchMove);
    }

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

    return () => {
      observer.disconnect();
      if (slideInterval) clearInterval(slideInterval);
      floatToggleBtn?.removeEventListener("click", handleFloatToggle);
      floatCloseBtn?.removeEventListener("click", handleFloatClose);
      modalCloseBtn?.removeEventListener("click", closeModal);
      modalBackdrop?.removeEventListener("click", closeModal);
      exhibitCards.forEach((c) => c.removeEventListener("click", handleCardClick));
      faqItems.forEach((item) => item.removeEventListener("click", handleFaqClick));
    };
  }, []);

  return null;
}
