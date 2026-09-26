"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getLandingContent } from "./landingI18n";
import {
  createArchitecturalMaterials,
  buildTropicalVilla,
  buildCubicResidence,
  buildGlassPavilion,
  loadCustomModel,
} from "./hero3dArchitectures";

export default function LandingHero3D({
  locale = "ja",
  heroContent,
}: {
  locale?: string;
  heroContent?: any;
}) {
  const defaultHero = getLandingContent(locale).hero;
  const t = heroContent || defaultHero;
  const contactHref = `/${locale}/contact`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const modelCfg = t.model3d || {};
    const mode = modelCfg.mode || "preset";
    const presetId = modelCfg.presetId || "tropical-villa";
    const customModelUrl = modelCfg.customModelUrl || "";
    const rotationSpeed = typeof modelCfg.rotationSpeed === "number" ? modelCfg.rotationSpeed : 1;
    const showWireframe = modelCfg.showWireframe !== false;
    const wireframeColor = modelCfg.wireframeColor || "#f59e0b";
    const ambientParticles = modelCfg.ambientParticles !== false;
    const initialScale = modelCfg.initialScale || 1;
    const defaultX = typeof modelCfg.positionX === "number" ? modelCfg.positionX : 5.0;
    const defaultY = typeof modelCfg.positionY === "number" ? modelCfg.positionY : 0.6;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const initialVillaX = width < 1024 ? 0 : defaultX;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(16 + initialVillaX * 0.35, 12 + defaultY * 0.4, 21);
    camera.lookAt(initialVillaX, defaultY + 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x1a1e28, 1.2);
    scene.add(ambientLight);

    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.5);
    sunLight.position.set(22, 30, 15);
    scene.add(sunLight);

    // Amber Rim Light (From back/side)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
    rimLight.position.set(-18, -6, -18);
    scene.add(rimLight);

    // Blue fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-15, 15, 15);
    scene.add(fillLight);

    // Create materials with dynamic wireframe styling
    const mats = createArchitecturalMaterials(wireframeColor, showWireframe);

    // 4. Construct Architectural Model Group
    const villaGroup = new THREE.Group();
    scene.add(villaGroup);

    if (mode === "custom" && customModelUrl) {
      loadCustomModel(
        customModelUrl,
        villaGroup,
        modelCfg,
        mats,
        () => {
          try {
            renderer.render(scene, camera);
          } catch (e) {}
          setIsReady(true);
        },
        () => {
          // Fallback on load error
          buildTropicalVilla(villaGroup, mats);
          try {
            renderer.render(scene, camera);
          } catch (e) {}
          setIsReady(true);
        }
      );
    } else {
      if (presetId === "cubic-modern") {
        buildCubicResidence(villaGroup, mats);
      } else if (presetId === "glass-pavilion") {
        buildGlassPavilion(villaGroup, mats);
      } else {
        buildTropicalVilla(villaGroup, mats);
      }
      try {
        renderer.render(scene, camera);
      } catch (e) {}
      setIsReady(true);
    }

    if (initialScale !== 1) {
      villaGroup.scale.set(initialScale, initialScale, initialScale);
    }

    // --- Atmospheric 3D Particle Cloud / Light Embers ---
    let particleSystem: THREE.Points | null = null;
    if (ambientParticles) {
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 36;
        particlePos[i + 1] = Math.random() * 18 - 2;
        particlePos[i + 2] = (Math.random() - 0.5) * 36;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xf59e0b,
        size: 0.18,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);
    }

    // Position Villa: Shift to right and elevate above bottom margin so ground never clips
    villaGroup.position.set(initialVillaX, defaultY, 0);

    // 5. Mouse Interaction & Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetX = normX * 0.35;
      mouseTargetY = normY * 0.2;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        rotationVelocityY += deltaX * 0.004;
        rotationVelocityX += deltaY * 0.003;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handlePointerDown);
    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const newX = w < 1024 ? 0 : defaultX;
      villaGroup.position.x = newX;
      camera.position.x = 16 + newX * 0.35;
      camera.position.y = 12 + defaultY * 0.4;
      camera.lookAt(newX, defaultY + 1.2, 0);
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle auto-spin with speed control
      if (!isDragging) {
        rotationVelocityY += 0.0012 * rotationSpeed;
      }

      // Apply drag rotation with damping
      villaGroup.rotation.y += rotationVelocityY;
      villaGroup.rotation.x += rotationVelocityX;

      rotationVelocityY *= 0.92;
      rotationVelocityX *= 0.92;

      // Clamp X rotation
      villaGroup.rotation.x = Math.max(-0.45, Math.min(0.35, villaGroup.rotation.x));

      // Gentle floating oscillation elevated nicely
      villaGroup.position.y = defaultY + Math.sin(elapsedTime * 1.2) * 0.18;

      // Subtle camera parallax
      const targetLookX = container.clientWidth < 1024 ? 0 : defaultX;
      camera.position.x += (14.5 + targetLookX * 0.35 + mouseTargetX * 3.5 - camera.position.x) * 0.04;
      camera.position.y += (11 + defaultY * 0.4 + mouseTargetY * 2.5 - camera.position.y) * 0.04;
      camera.lookAt(targetLookX, defaultY + 1.8, 0);

      // Rotate particle dust if enabled
      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handlePointerDown);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);

      renderer.dispose();
      ambientLight.dispose();
      sunLight.dispose();
      rimLight.dispose();
      fillLight.dispose();
    };
  }, [JSON.stringify(t.model3d)]);

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#07080a] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* Subtle Architectural Grid Lines & Dark Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_60%_45%,rgba(217,119,6,0.09)_0%,rgba(7,8,10,0.95)_75%)] z-0" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* 3D Canvas in the Center / Right */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div
          className={`w-full h-full flex items-center justify-center transition-opacity duration-700 ease-out ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Center Drag & Orbit Helper Badge */}
        <div
          className={`absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center gap-1.5 transition-all duration-700 ease-out ${
            isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-white/70">
              KÉO ĐỂ XOAY 3D · DIỄN HỌA THỜI GIAN THỰC
            </span>
          </div>
        </div>
      </div>

      {/* Top Bar / Content Wrapper (Flush to the left margin, prominent and large) */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-8 lg:pt-14 pointer-events-none">
        {/* =========================================================================
            TOP-LEFT CORNER: Smooth GPU hardware-accelerated entrance (Zero Jitter)
            ========================================================================= */}
        <div className="hero-corner-top-left max-w-[560px] lg:max-w-[620px] text-left pointer-events-auto">
          {/* Studio Eyebrow Tag */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="text-[#f59e0b] font-mono text-xs sm:text-[13px] font-bold tracking-[0.28em] uppercase drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
              {t.eyebrow}
            </span>
          </div>

          {/* Large Bold Headline (Prominent, High Impact) */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] font-black tracking-tight text-white leading-[1.08] uppercase drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]"
            style={{ fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
          >
            {t.headlinePre} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/70">
              {t.headlineHighlight1}
            </span>{" "}
            <span className="text-[#f59e0b] drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">{t.headlineHighlight2}</span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-5 text-sm sm:text-base lg:text-[1.05rem] text-white/85 font-normal leading-relaxed max-w-[490px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t.desc}
          </p>

          {/* Action CTA Button */}
          <div className="mt-7 flex items-center gap-4">
            <a
              href={contactHref}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-sm sm:text-[15px] tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-105"
            >
              <span>{t.ctaContact}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-black text-base">→</span>
            </a>

            <a
              href="#du-an"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white hover:text-white border border-white/20 text-sm font-semibold tracking-wide transition-all duration-200 backdrop-blur-md shadow-lg hover:border-white/40"
            >
              <span>{t.ctaCollection}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive 3D Model Tag & Rotate Hint */}
      <div className="hero-corner-top-right absolute top-24 right-6 sm:right-10 lg:right-16 z-20 pointer-events-none hidden sm:flex flex-col items-end">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-white/15 backdrop-blur-md text-[11px] font-mono text-white/90 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
          <span className="text-[#f59e0b] font-bold">3D ARCHITECTURE:</span>
          <span className="tracking-wide">
            {t.model3d?.modelName || (t.model3d?.presetId === "cubic-modern" ? "THE MINIMALIST CUBIC RESIDENCE" : t.model3d?.presetId === "glass-pavilion" ? "THE GLASS SKY PAVILION" : "THE TROPICAL COURTYARD VILLA")}
          </span>
        </div>
        <span className="text-[9px] text-white/40 font-mono mt-1 tracking-widest uppercase">
          KÉO ĐỂ XOAY 360° · DRAG TO ROTATE
        </span>
      </div>

      {/* Bottom Bar / Content Wrapper */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pb-16 lg:pb-24 flex items-end justify-between pointer-events-none">
        {/* Bottom Left: Micro Tagline / Scroll */}
        <div className="hero-corner-bottom-left hidden md:flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-[1.5px] bg-[#f59e0b]/60" />
          <span className="text-[11px] font-mono tracking-widest text-white/60 uppercase">
            {t.scrollHint || "CUỘN ĐỂ KHÁM PHÁ CHI TIẾT"}
          </span>
        </div>

        {/* =========================================================================
            BOTTOM-RIGHT CORNER: Smooth GPU hardware-accelerated entrance (Zero Jitter)
            ========================================================================= */}
        <div className="hero-corner-bottom-right max-w-[340px] text-right flex flex-col items-end pointer-events-auto ml-auto">
          {/* Studio Badge with Globe */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 backdrop-blur-md mb-2.5">
            <svg
              className="w-3.5 h-3.5 text-[#f59e0b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-[10px] font-mono font-semibold tracking-wider text-white/80">
              {t.badgeEst || "EST. 2026 · KONTUR ATELIER"}
            </span>
          </div>

          {/* Micro Information */}
          <h3 className="text-xs md:text-sm font-semibold text-white tracking-wide mb-1">
            {t.badgeTitle || "KIẾN TRÚC & DIỄN HỌA 3D CHUẨN XÁC"}
          </h3>
          <p className="text-[10px] md:text-[11px] text-white/60 font-light leading-relaxed max-w-[290px]">
            {t.badgeDesc || "Hơn 250+ gia chủ & chủ đầu tư tin chọn giải pháp kiểm soát 100% chi phí và thông số trước khi thi công."}
          </p>

          <div className="mt-2.5 flex items-center gap-2 text-[9px] font-mono text-[#f59e0b]/90 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span>{t.badgeStatus || "SẴN SÀNG TIẾP NHẬN DỰ ÁN MỚI"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
