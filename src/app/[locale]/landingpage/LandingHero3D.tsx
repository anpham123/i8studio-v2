"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function LandingHero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const initialVillaX = width < 1024 ? 0 : 3.8;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(16 + initialVillaX * 0.4, 11, 20);
    camera.lookAt(initialVillaX, 0.5, 0);

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

    // 3. Materials
    const darkConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x14151a,
      roughness: 0.35,
      metalness: 0.65,
    });

    const woodSlatMat = new THREE.MeshStandardMaterial({
      color: 0x9a6538,
      roughness: 0.6,
      metalness: 0.1,
    });

    const whiteStuccoMat = new THREE.MeshStandardMaterial({
      color: 0x22242b,
      roughness: 0.4,
      metalness: 0.4,
    });

    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      transmission: 0.8,
      ior: 1.5,
    });

    const interiorGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85,
    });

    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
    });

    const cyanWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });

    // 4. Construct Modern Architectural Villa
    const villaGroup = new THREE.Group();
    scene.add(villaGroup);

    const addBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material,
      wireMat: THREE.LineBasicMaterial = wireframeMat
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y + h / 2, z);
      villaGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const wire = new THREE.LineSegments(edges, wireMat);
      wire.position.copy(mesh.position);
      villaGroup.add(wire);

      return mesh;
    };

    // --- Ground Foundation Platform ---
    addBox(14, 0.4, 11, 0, 0, 0, darkConcreteMat);

    // --- Swimming Pool & Sun Deck ---
    addBox(7.5, 0.25, 3.2, 2.5, 0.2, 3.2, poolWaterMat, cyanWireMat);
    addBox(13.8, 0.1, 10.8, 0, 0.38, 0, whiteStuccoMat);

    // --- Ground Floor Main Living Box ---
    addBox(7, 3, 5.5, -2.5, 0.4, -0.5, darkConcreteMat);

    // Ground Floor Glass Facade (Living room looking at pool)
    addBox(6.8, 2.8, 0.1, -2.5, 0.4, 2.3, glassMat);

    // Interior Warm Light Core
    const intPointLight = new THREE.PointLight(0xfbbf24, 3.5, 9);
    intPointLight.position.set(-2.5, 1.8, 0.5);
    villaGroup.add(intPointLight);

    const intCore = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 1.5), interiorGlowMat);
    intCore.position.set(-2.5, 1.4, 0.5);
    villaGroup.add(intCore);

    // --- Wooden Feature Wall / Vertical Louvers Accent ---
    addBox(1.2, 3.1, 5.7, 1.2, 0.4, -0.5, woodSlatMat);

    // --- Upper Floor Cantilevered Master Suite ---
    addBox(8.5, 2.6, 5.2, 0.5, 3.5, 0.8, whiteStuccoMat);

    // Upper Floor Panoramic Glass Balcony
    addBox(8.2, 2.4, 0.1, 0.5, 3.6, 3.45, glassMat);

    // Upper Interior Amber Light Core
    const upperPointLight = new THREE.PointLight(0xf59e0b, 2.5, 7);
    upperPointLight.position.set(0.5, 4.8, 1.2);
    villaGroup.add(upperPointLight);

    // Roof Floating Canopy / Overhang (Pergola)
    addBox(9.8, 0.3, 6.4, 0.5, 6.1, 0.8, darkConcreteMat);

    // Roof Slanted Solar / Architectural Fin
    addBox(0.2, 1.4, 5.8, -3.8, 6.2, 0.8, woodSlatMat);
    addBox(0.2, 1.4, 5.8, 4.8, 6.2, 0.8, woodSlatMat);

    // Outdoor Lounge Table on Deck
    addBox(1.6, 0.45, 1.2, -2.5, 0.4, 3.2, darkConcreteMat);

    // Subtle Landscape Stepping Stones
    for (let i = 0; i < 4; i++) {
      addBox(1.2, 0.15, 0.7, -5.5, 0.4, 2.5 - i * 1.4, darkConcreteMat, cyanWireMat);
    }

    // --- Atmospheric 3D Particle Cloud / Light Embers ---
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
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Position Villa: Shift to right on desktop so big left text has full clear space
    villaGroup.position.set(initialVillaX, -1.8, 0);

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
      const newX = w < 1024 ? 0 : 3.8;
      villaGroup.position.x = newX;
      camera.position.x = 16 + newX * 0.4;
      camera.lookAt(newX, 0.5, 0);
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle auto-spin
      if (!isDragging) {
        rotationVelocityY += 0.0012;
      }

      // Apply drag rotation with damping
      villaGroup.rotation.y += rotationVelocityY;
      villaGroup.rotation.x += rotationVelocityX;

      rotationVelocityY *= 0.92;
      rotationVelocityX *= 0.92;

      // Clamp X rotation
      villaGroup.rotation.x = Math.max(-0.45, Math.min(0.35, villaGroup.rotation.x));

      // Gentle floating oscillation
      villaGroup.position.y = -1.8 + Math.sin(elapsedTime * 1.2) * 0.22;

      // Subtle camera parallax
      const targetLookX = container.clientWidth < 1024 ? 0 : 3.8;
      camera.position.x += (16 + targetLookX * 0.4 + mouseTargetX * 4 - camera.position.x) * 0.04;
      camera.position.y += (11 + mouseTargetY * 3 - camera.position.y) * 0.04;
      camera.lookAt(targetLookX, 0.5, 0);

      // Rotate particle dust
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

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
  }, []);

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
        <motion.div
          initial={{ opacity: 0, scale: 0.68 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex items-center justify-center"
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </motion.div>

        {/* Center Drag & Orbit Helper Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-white/70">
              KÉO ĐỂ XOAY 3D · DIỄN HỌA THỜI GIAN THỰC
            </span>
          </div>
        </motion.div>
      </div>

      {/* Top Bar / Content Wrapper (Flush to the left margin, prominent and large) */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-8 lg:pt-14 pointer-events-none">
        {/* =========================================================================
            TOP-LEFT CORNER: Entrances from Top-Left (-80px, -50px -> 0, 0)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -80, y: -50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[560px] lg:max-w-[620px] text-left pointer-events-auto"
        >
          {/* Studio Eyebrow Tag */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="text-[#f59e0b] font-mono text-xs sm:text-[13px] font-bold tracking-[0.28em] uppercase drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
              // KONTUR ATELIER · 3D ARCHITECTURE
            </span>
          </div>

          {/* Large Bold Headline (Prominent, High Impact) */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[4.1rem] xl:text-[4.6rem] font-black tracking-tight text-white leading-[1.03] uppercase drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]"
            style={{ fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
          >
            HIỆN THỰC HÓA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/70">
              NGÔI NHÀ
            </span>{" "}
            <span className="text-[#f59e0b] drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">MƠ ƯỚC.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-5 text-sm sm:text-base lg:text-[1.05rem] text-white/85 font-normal leading-relaxed max-w-[490px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Giải pháp thiết kế kiến trúc chuẩn kỹ thuật và diễn họa 3D không gian sống chân thực 100%. Giúp bạn hình dung trọn vẹn từng
            góc nhìn, kiểm soát chi phí và tránh sai sót thi công.
          </p>

          {/* Action CTA Button */}
          <div className="mt-7 flex items-center gap-4">
            <a
              href="#nhan-tu-van"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-sm sm:text-[15px] tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-105"
            >
              <span>LIÊN HỆ DỰ ÁN</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-black text-base">→</span>
            </a>

            <a
              href="#du-an"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white hover:text-white border border-white/20 text-sm font-semibold tracking-wide transition-all duration-200 backdrop-blur-md shadow-lg hover:border-white/40"
            >
              <span>XEM BỘ SƯU TẬP</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar / Content Wrapper */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pb-16 lg:pb-24 flex items-end justify-between pointer-events-none">
        {/* Bottom Left: Micro Tagline / Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden md:flex items-center gap-3 pointer-events-auto"
        >
          <div className="w-9 h-[1.5px] bg-[#f59e0b]/60" />
          <span className="text-[11px] font-mono tracking-widest text-white/60 uppercase">
            CUỘN ĐỂ KHÁM PHÁ CHI TIẾT
          </span>
        </motion.div>

        {/* =========================================================================
            BOTTOM-RIGHT CORNER: Pushed further right and lifted upwards
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 80, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.95, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[340px] text-right flex flex-col items-end pointer-events-auto ml-auto"
        >
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
              EST. 2026 · KONTUR ATELIER
            </span>
          </div>

          {/* Micro Information */}
          <h3 className="text-xs md:text-sm font-semibold text-white tracking-wide mb-1">
            KIẾN TRÚC & DIỄN HỌA 3D CHUẨN XÁC
          </h3>
          <p className="text-[10px] md:text-[11px] text-white/60 font-light leading-relaxed max-w-[290px]">
            Hơn 250+ gia chủ &amp; chủ đầu tư tin chọn giải pháp kiểm soát 100% chi phí và thông số trước khi thi công.
          </p>

          <div className="mt-2.5 flex items-center gap-2 text-[9px] font-mono text-[#f59e0b]/90 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span>SẴN SÀNG TIẾP NHẬN DỰ ÁN MỚI</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
