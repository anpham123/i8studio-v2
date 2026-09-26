import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface Model3DConfig {
  mode?: "preset" | "custom";
  presetId?: string; // "tropical-villa" | "cubic-modern" | "glass-pavilion"
  customModelUrl?: string;
  modelName?: string;
  rotationSpeed?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientParticles?: boolean;
  initialScale?: number;
  positionX?: number; // Vị trí X (qua phải/trái)
  positionY?: number; // Vị trí Y (nâng lên/hạ xuống)
}

export function createArchitecturalMaterials(wireframeColorHex: string = "#f59e0b", showWireframe: boolean = true) {
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
    color: 0x242730,
    roughness: 0.4,
    metalness: 0.35,
  });

  const travertineStoneMat = new THREE.MeshStandardMaterial({
    color: 0x2c2d35,
    roughness: 0.5,
    metalness: 0.25,
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

  const wireColorInt = parseInt(wireframeColorHex.replace("#", "0x"), 16) || 0xf59e0b;
  const wireframeMat = new THREE.LineBasicMaterial({
    color: wireColorInt,
    transparent: true,
    opacity: showWireframe ? 0.4 : 0,
  });

  const cyanWireMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: showWireframe ? 0.35 : 0,
  });

  return {
    darkConcreteMat,
    woodSlatMat,
    whiteStuccoMat,
    travertineStoneMat,
    poolWaterMat,
    glassMat,
    interiorGlowMat,
    wireframeMat,
    cyanWireMat,
  };
}

export function buildTropicalVilla(group: THREE.Group, mats: ReturnType<typeof createArchitecturalMaterials>) {
  const addBox = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
    wireMat: THREE.LineBasicMaterial = mats.wireframeMat
  ) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + h / 2, z);
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const wire = new THREE.LineSegments(edges, wireMat);
    wire.position.copy(mesh.position);
    group.add(wire);
    return mesh;
  };

  // Ground Foundation Platform
  addBox(14, 0.4, 11, 0, 0, 0, mats.darkConcreteMat);

  // Swimming Pool & Sun Deck
  addBox(7.5, 0.25, 3.2, 2.5, 0.2, 3.2, mats.poolWaterMat, mats.cyanWireMat);
  addBox(13.8, 0.1, 10.8, 0, 0.38, 0, mats.whiteStuccoMat);

  // Ground Floor Main Living Box
  addBox(7, 3, 5.5, -2.5, 0.4, -0.5, mats.darkConcreteMat);
  addBox(6.8, 2.8, 0.1, -2.5, 0.4, 2.3, mats.glassMat);

  // Interior Warm Light Core
  const intPointLight = new THREE.PointLight(0xfbbf24, 3.5, 9);
  intPointLight.position.set(-2.5, 1.8, 0.5);
  group.add(intPointLight);

  const intCore = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 1.5), mats.interiorGlowMat);
  intCore.position.set(-2.5, 1.4, 0.5);
  group.add(intCore);

  // Wooden Feature Wall
  addBox(1.2, 3.1, 5.7, 1.2, 0.4, -0.5, mats.woodSlatMat);

  // Upper Floor Cantilevered Master Suite
  addBox(8.5, 2.6, 5.2, 0.5, 3.5, 0.8, mats.whiteStuccoMat);
  addBox(8.2, 2.4, 0.1, 0.5, 3.6, 3.45, mats.glassMat);

  // Upper Interior Light
  const upperPointLight = new THREE.PointLight(0xf59e0b, 2.5, 7);
  upperPointLight.position.set(0.5, 4.8, 1.2);
  group.add(upperPointLight);

  // Roof Floating Canopy
  addBox(9.8, 0.3, 6.4, 0.5, 6.1, 0.8, mats.darkConcreteMat);
  addBox(0.2, 1.4, 5.8, -3.8, 6.2, 0.8, mats.woodSlatMat);
  addBox(0.2, 1.4, 5.8, 4.8, 6.2, 0.8, mats.woodSlatMat);

  // Outdoor Lounge Table
  addBox(1.6, 0.45, 1.2, -2.5, 0.4, 3.2, mats.darkConcreteMat);

  // Landscape Stepping Stones
  for (let i = 0; i < 4; i++) {
    addBox(1.2, 0.15, 0.7, -5.5, 0.4, 2.5 - i * 1.4, mats.darkConcreteMat, mats.cyanWireMat);
  }
}

export function buildCubicResidence(group: THREE.Group, mats: ReturnType<typeof createArchitecturalMaterials>) {
  const addBox = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
    wireMat: THREE.LineBasicMaterial = mats.wireframeMat
  ) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + h / 2, z);
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const wire = new THREE.LineSegments(edges, wireMat);
    wire.position.copy(mesh.position);
    group.add(wire);
    return mesh;
  };

  // Base Podium
  addBox(13, 0.5, 10, 0, 0, 0, mats.darkConcreteMat);

  // Central Double Height Glass Cube
  addBox(6, 6.2, 5, -1, 0.5, 0, mats.glassMat);

  // Ground Floor Solid Wing (Left)
  addBox(4.5, 3.2, 6, -3.5, 0.5, -0.5, mats.travertineStoneMat);

  // Ground Floor Entrance Porch (Right)
  addBox(3.8, 3.2, 5, 3.5, 0.5, 0.5, mats.whiteStuccoMat);

  // Upper Floor Interlocking Cube (Cantilever Right)
  addBox(6.5, 3.0, 5.5, 2.5, 3.7, 0, mats.darkConcreteMat);

  // Ribbon Window on Upper Cube
  addBox(6.6, 1.2, 0.2, 2.5, 4.4, 2.8, mats.glassMat);

  // Vertical Architectural Timber Slats
  for (let i = 0; i < 6; i++) {
    addBox(0.15, 6.2, 0.3, -3.8 + i * 0.7, 0.5, 2.6, mats.woodSlatMat);
  }

  // Interior Core Lighting
  const light1 = new THREE.PointLight(0xf59e0b, 3.5, 10);
  light1.position.set(-1, 3.2, 0);
  group.add(light1);

  const glowBox = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), mats.interiorGlowMat);
  glowBox.position.set(-1, 3, 0);
  group.add(glowBox);

  // Roof Garden Terrace Slab
  addBox(7.2, 0.35, 6.2, 2.5, 6.7, 0, mats.travertineStoneMat);

  // Water Feature / Perimeter Mirror Pool
  addBox(11, 0.2, 2.5, 0, 0.3, 3.6, mats.poolWaterMat, mats.cyanWireMat);
}

export function buildGlassPavilion(group: THREE.Group, mats: ReturnType<typeof createArchitecturalMaterials>) {
  const addBox = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
    wireMat: THREE.LineBasicMaterial = mats.wireframeMat
  ) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + h / 2, z);
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const wire = new THREE.LineSegments(edges, wireMat);
    wire.position.copy(mesh.position);
    group.add(wire);
    return mesh;
  };

  // Elevated Base Plinth
  addBox(14, 0.6, 12, 0, 0, 0, mats.darkConcreteMat);

  // Large Reflecting Water Pool around front & side
  addBox(13.2, 0.25, 4.5, 0, 0.4, 3.2, mats.poolWaterMat, mats.cyanWireMat);

  // Main Transparent Glass Pavilion Volume
  addBox(10, 3.8, 6.5, 0, 0.6, -1.2, mats.glassMat);

  // Rear Private Stone Core
  addBox(4.5, 3.8, 3.5, -2.5, 0.6, -2.5, mats.travertineStoneMat);
  addBox(4, 3.8, 2.5, 2.5, 0.6, -2.8, mats.woodSlatMat);

  // Slender Steel Column Posts
  const colMat = mats.darkConcreteMat;
  const colPositions = [
    [-4.8, -4.3],
    [-4.8, 1.8],
    [4.8, -4.3],
    [4.8, 1.8],
    [0, 1.8],
    [0, -4.3],
  ];

  colPositions.forEach(([cx, cz]) => {
    addBox(0.25, 4.4, 0.25, cx, 0.6, cz, colMat, mats.cyanWireMat);
  });

  // Massive Thin Floating Canopy Roof
  addBox(12.5, 0.35, 9, 0, 4.6, -1.2, mats.darkConcreteMat);

  // Warm Pavilion Chandelier Lighting
  const lightCore = new THREE.PointLight(0xfef08a, 4.2, 12);
  lightCore.position.set(0, 2.5, -1);
  group.add(lightCore);

  const glowCore = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 2), mats.interiorGlowMat);
  glowCore.position.set(0, 3.5, -1);
  group.add(glowCore);

  // Water Stepping Stones across Reflection Pond
  for (let i = 0; i < 5; i++) {
    addBox(1.1, 0.15, 0.9, -4.5 + i * 2.2, 0.55, 3.2, mats.whiteStuccoMat);
  }
}

export function resolveModelUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // Direct match for Sample_AR_House or NHA_32
  if (trimmed.includes("Sample_AR_House") || trimmed.includes("NHA_32.glb")) {
    return "/models/NHA_32.glb";
  }

  // If it's a web URL (external or contains .html / /360/)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return `/api/proxy-model?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

export function loadCustomModel(
  url: string,
  group: THREE.Group,
  cfg: Model3DConfig,
  mats: ReturnType<typeof createArchitecturalMaterials>,
  onSuccess: () => void,
  onError: (err: any) => void
) {
  const finalUrl = resolveModelUrl(url);
  const loader = new GLTFLoader();
  loader.load(
    finalUrl,
    (gltf) => {
      const model = gltf.scene;

      // Calculate bounding box and center
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const baseDimension = 16.5;
      const targetScale = (baseDimension / maxDim) * (cfg.initialScale || 1);

      model.scale.set(targetScale, targetScale, targetScale);
      // Anchor base of model to ground (y = 0) so bottom never sinks down or cuts off
      model.position.set(-center.x * targetScale, -box.min.y * targetScale, -center.z * targetScale);

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                m.side = THREE.DoubleSide;
              });
            } else {
              mesh.material.side = THREE.DoubleSide;
            }
          }

          if (cfg.showWireframe !== false) {
            try {
              const vertCount = mesh.geometry?.attributes?.position?.count || 0;
              // Skip calculation on giant meshes (>6000 vertices) to prevent freezing main thread
              if (vertCount > 0 && vertCount < 6000) {
                const edges = new THREE.EdgesGeometry(mesh.geometry, 38);
                const wire = new THREE.LineSegments(edges, mats.wireframeMat);
                mesh.add(wire);
              }
            } catch (e) {
              // ignore meshes with incompatible geometries
            }
          }
        }
      });

      group.add(model);
      onSuccess();
    },
    undefined,
    (error) => {
      console.error("Failed to load GLTF 3D model from:", finalUrl, error);
      onError(error);
    }
  );
}

