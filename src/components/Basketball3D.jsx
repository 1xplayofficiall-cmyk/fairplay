"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Procedural high-res pebbled NBA basketball leather texture
function createBasketballTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Rich NBA burnt-orange base
  ctx.fillStyle = "#d85c18";
  ctx.fillRect(0, 0, 512, 256);

  // Pebble leather texture noise
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 6000; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 256;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  // Black rib channels / seams
  ctx.strokeStyle = "#1a1614";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  // Horizontal equator seam
  ctx.beginPath();
  ctx.moveTo(0, 128);
  ctx.lineTo(512, 128);
  ctx.stroke();

  // Vertical meridian seams
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.moveTo(384, 0);
  ctx.lineTo(384, 256);
  ctx.stroke();

  // Curved side ribs
  ctx.beginPath();
  ctx.ellipse(256, 128, 90, 120, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 128, 90, 120, 0, 0, Math.PI * 2);
  ctx.ellipse(512, 128, 90, 120, 0, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Basketball3D({
  className = "",
  hoopModelPath = "/models/basketball_hoop.glb",
  interactive = true,
  scaleMultiplier = 1,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSwishScored, setIsSwishScored] = useState(false);
  const replayShotRef = useRef(null);
  const resetViewRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isDisposed = false;

    // Scene
    const scene = new THREE.Scene();

    // Camera setup
    const initialRect = container.getBoundingClientRect();
    const width = Math.round(initialRect.width) || 440;
    const height = Math.round(initialRect.height) || 440;
    const FOV = 45;
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio & Arena Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const arenaSpot = new THREE.DirectionalLight(0xffffff, 2.6);
    arenaSpot.position.set(5, 8, 5);
    scene.add(arenaSpot);

    const fillLight = new THREE.DirectionalLight(0xffb870, 1.6);
    fillLight.position.set(-5, 5, 4);
    scene.add(fillLight);

    // FairPlay Orange Arena Rim Light
    const orangeRim = new THREE.DirectionalLight(0xff8c00, 3.5);
    orangeRim.position.set(-6, 5, -2);
    scene.add(orangeRim);

    // FairPlay Green Turf Accent Light
    const greenAccent = new THREE.DirectionalLight(0x00c853, 2.8);
    greenAccent.position.set(6, -3, -1);
    scene.add(greenAccent);

    // Rim Glow Light
    const rimPointLight = new THREE.PointLight(0xff8c00, 1.8, 8);
    rimPointLight.position.set(0, 0.6, 0);
    scene.add(rimPointLight);

    // =========================================================================
    // MAIN INTERACTIVE STAGE (DRAGGABLE HOOP + BASKETBALL)
    // =========================================================================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const hoopGroup = new THREE.Group();
    stageGroup.add(hoopGroup);

    const ballContainer = new THREE.Group();
    stageGroup.add(ballContainer);

    // Default Orientation
    const DEFAULT_ROT_X = 0.05;
    const DEFAULT_ROT_Y = -0.15;
    const DEFAULT_ZOOM = 4.2;

    let targetRotX = DEFAULT_ROT_X;
    let targetRotY = DEFAULT_ROT_Y;
    let currentRotX = DEFAULT_ROT_X;
    let currentRotY = DEFAULT_ROT_Y;
    let targetZoom = DEFAULT_ZOOM;

    stageGroup.rotation.x = DEFAULT_ROT_X;
    stageGroup.rotation.y = DEFAULT_ROT_Y;

    resetViewRef.current = () => {
      targetRotX = DEFAULT_ROT_X;
      targetRotY = DEFAULT_ROT_Y;
      targetZoom = DEFAULT_ZOOM;
    };

    // Court Hardwood Baseline Grid
    const courtGeom = new THREE.PlaneGeometry(6, 4.5, 12, 12);
    const courtMat = new THREE.MeshBasicMaterial({
      color: 0x1a120b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const courtMesh = new THREE.Mesh(courtGeom, courtMat);
    courtMesh.rotation.x = -Math.PI / 2;
    courtMesh.position.set(0, -1.5, 0);
    stageGroup.add(courtMesh);

    // =========================================================================
    // SWISH CELEBRATION PARTICLES
    // =========================================================================
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0.2;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.12,
        y: (Math.random() - 0.2) * 0.12,
        z: (Math.random() - 0.5) * 0.12,
        life: 0,
      });
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff8c00,
      size: 0.09,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    stageGroup.add(particleSystem);

    // Entrance & Levitation Animation
    let entranceStartTime = null;
    let entranceDuration = 1.2; // seconds
    let isEntering = true;

    const triggerEntranceAnimation = () => {
      entranceStartTime = performance.now();
      isEntering = true;
      setIsSwishScored(false);
      hoopGroup.scale.setScalar(0.01);
    };

    replayShotRef.current = triggerEntranceAnimation;

    // Load 3D Basketball Hoop GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      hoopModelPath,
      (gltf) => {
        if (isDisposed) return;
        const hoopRoot = gltf.scene;

        hoopRoot.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.side = THREE.DoubleSide;
              });
            } else if (child.material) {
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(hoopRoot);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetScale = 3.6 / (maxDim || 1);
        hoopRoot.scale.setScalar(targetScale);
        hoopRoot.position.set(
          -center.x * targetScale,
          -center.y * targetScale + 0.1,
          -center.z * targetScale - 0.4
        );

        hoopGroup.add(hoopRoot);
        setLoading(false);
        triggerEntranceAnimation();
      },
      undefined,
      (err) => {
        console.error("Error loading basketball hoop model:", err);
        if (!isDisposed) {
          setLoading(false);
          triggerEntranceAnimation();
        }
      }
    );

    // =========================================================================
    // INTERACTIVE MOUSE / TOUCH DRAG & ZOOM
    // =========================================================================
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      previousPointerPosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !interactive) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      const deltaX = clientX - previousPointerPosition.x;
      const deltaY = clientY - previousPointerPosition.y;

      velocity = {
        x: deltaY * 0.006,
        y: deltaX * 0.006,
      };

      targetRotX += velocity.x;
      targetRotY += velocity.y;

      targetRotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotX));
      previousPointerPosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      if (!interactive) return;
      e.preventDefault();
      targetZoom += e.deltaY * 0.003;
      targetZoom = Math.max(2.2, Math.min(6.5, targetZoom));
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = "none";
    domElement.style.cursor = interactive ? "grab" : "default";

    domElement.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    domElement.addEventListener("wheel", handleWheel, { passive: false });

    domElement.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    domElement.addEventListener("mousedown", () => {
      domElement.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
      domElement.style.cursor = interactive ? "grab" : "default";
    });

    // Resize Observer
    const applySize = (newW, newH) => {
      if (newW <= 0 || newH <= 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        applySize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // =========================================================================
    // MAIN RENDER & PHYSICS LOOP
    // =========================================================================
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera & drag damping
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      camera.position.z += (targetZoom - camera.position.z) * 0.1;

      stageGroup.rotation.x = currentRotX;
      stageGroup.rotation.y = currentRotY;

      // Entrance Animation
      if (isEntering && entranceStartTime !== null) {
        const elapsed = (performance.now() - entranceStartTime) / 1000;
        const progress = Math.min(elapsed / entranceDuration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        hoopGroup.scale.setScalar(ease);

        if (progress >= 1) {
          isEntering = false;
          setIsSwishScored(true);
        }
      } else if (!isDragging) {
        // Gentle resting levitation
        const idleFloat = Math.sin(elapsedTime * 1.6) * 0.03;
        hoopGroup.position.y = idleFloat;
      }

      // Spark particles decay
      if (particleMat.opacity > 0.01) {
        particleMat.opacity *= 0.94;
        const positions = particleGeom.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          if (v.life > 0) {
            positions.setX(i, positions.getX(i) + v.x);
            positions.setY(i, positions.getY(i) + v.y);
            positions.setZ(i, positions.getZ(i) + v.z);
            v.life *= 0.94;
          }
        }
        positions.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElement.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      domElement.removeEventListener("wheel", handleWheel);

      domElement.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      renderer.dispose();
      scene.clear();
    };
  }, [hoopModelPath, interactive, scaleMultiplier]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "360px",
        position: "relative",
      }}
    >
      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 140, 0, 0.3)",
              borderTopColor: "#ff8c00",
              animation: "spin 1s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-4, rgba(255,255,255,0.5))",
            }}
          >
            Loading 3D Basketball Arena...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--fg-4)",
            fontSize: "0.85rem",
          }}
        >
          3D preview unavailable
        </div>
      )}

      {/* Swish Status, Reset & Replay Controls */}
      {!loading && !error && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            zIndex: 5,
            width: "95%",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              padding: "5px 12px",
              background: "rgba(13, 16, 17, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              fontSize: "0.72rem",
              color: "var(--fg-2, #ffffff)",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: isSwishScored ? "var(--o-400, #ff8c00)" : "var(--g-400, #00c853)",
                boxShadow: isSwishScored ? "0 0 10px #ff8c00" : "0 0 10px #00c853",
                transition: "all 0.3s ease",
              }}
            />
            {isSwishScored ? "🏀 SWISH! Drag Arena in 3D" : "Shooting Swish..."}
          </div>

          {/* Reset Angle Button */}
          <button
            type="button"
            onClick={() => resetViewRef.current && resetViewRef.current()}
            title="Reset to default angle"
            style={{
              padding: "5px 10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              fontSize: "0.7rem",
              color: "var(--fg-3, rgba(255,255,255,0.7))",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg-3, rgba(255,255,255,0.7))";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            Reset Angle ↺
          </button>

          {/* Shoot Again Button */}
          <button
            type="button"
            onClick={() => replayShotRef.current && replayShotRef.current()}
            style={{
              padding: "5px 12px",
              background: "linear-gradient(135deg, rgba(255,140,0,0.3), rgba(255,190,0,0.3))",
              border: "1px solid rgba(255, 140, 0, 0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: "600",
              color: "var(--fg, #ffffff)",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--o-400, #ff8c00)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 140, 0, 0.5)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Slam Dunk 🏀
          </button>
        </div>
      )}
    </div>
  );
}
