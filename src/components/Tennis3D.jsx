"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Tennis3D({
  className = "",
  modelPath = "/models/tennis_ball.glb",
  interactive = true,
  scaleMultiplier = 1,
  ballFill = 0.55,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAceServed, setIsAceServed] = useState(false);
  const replayServeRef = useRef(null);
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
    camera.position.set(0, 0.2, 4.0);

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

    // Lighting (Wimbledon Grand Slam Court & FairPlay Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunKey = new THREE.DirectionalLight(0xffffff, 2.6);
    sunKey.position.set(5, 8, 5);
    scene.add(sunKey);

    const fillLight = new THREE.DirectionalLight(0xd4ff80, 1.5);
    fillLight.position.set(-5, 4, 4);
    scene.add(fillLight);

    // FairPlay Orange Stadium Rim Light
    const orangeRim = new THREE.DirectionalLight(0xff8c00, 3.2);
    orangeRim.position.set(-6, 5, -2);
    scene.add(orangeRim);

    // FairPlay Emerald Tennis Turf Glow
    const greenAccent = new THREE.DirectionalLight(0x00c853, 2.8);
    greenAccent.position.set(6, -3, -1);
    scene.add(greenAccent);

    // Court Line Glow
    const courtLight = new THREE.PointLight(0xccff00, 1.6, 8);
    courtLight.position.set(0, -1.2, 0);
    scene.add(courtLight);

    // =========================================================================
    // 3D TENNIS COURT ELEMENTS (TURF BASELINE + NET CORD)
    // =========================================================================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const courtGroup = new THREE.Group();
    stageGroup.add(courtGroup);

    // 1. Tennis Court Ground Grid
    const courtWidth = 5.6;
    const courtDepth = 4.2;
    const courtGeom = new THREE.PlaneGeometry(courtWidth, courtDepth, 14, 14);
    const courtMat = new THREE.MeshBasicMaterial({
      color: 0x092b15,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const courtMesh = new THREE.Mesh(courtGeom, courtMat);
    courtMesh.rotation.x = -Math.PI / 2;
    courtMesh.position.set(0, -1.3, 0);
    courtGroup.add(courtMesh);

    // 2. Tennis Court White Baseline
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const baselineGeom = new THREE.PlaneGeometry(courtWidth * 0.9, 0.06);
    const baseline = new THREE.Mesh(baselineGeom, lineMat);
    baseline.rotation.x = -Math.PI / 2;
    baseline.position.set(0, -1.29, 0.8);
    courtGroup.add(baseline);

    const serviceLine = new THREE.Mesh(baselineGeom, lineMat);
    serviceLine.rotation.x = -Math.PI / 2;
    serviceLine.position.set(0, -1.29, -0.8);
    courtGroup.add(serviceLine);

    // 3. Subtle Tennis Net in Background
    const netBarGeom = new THREE.CylinderGeometry(0.02, 0.02, courtWidth * 0.95, 16);
    const netBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8,
    });
    const netTopBar = new THREE.Mesh(netBarGeom, netBarMat);
    netTopBar.rotation.z = Math.PI / 2;
    netTopBar.position.set(0, -0.7, -1.5);
    courtGroup.add(netTopBar);

    // =========================================================================
    // ACE IMPACT PARTICLES & MOTION TRAIL
    // =========================================================================
    const particleCount = 40;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.12,
        y: (Math.random() - 0.1) * 0.12,
        z: (Math.random() - 0.5) * 0.12,
        life: 0,
      });
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xccff00,
      size: 0.09,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    stageGroup.add(particleSystem);

    // =========================================================================
    // 3D TENNIS BALL MODEL & SERVE TRAJECTORY
    // =========================================================================
    const ballContainer = new THREE.Group();
    stageGroup.add(ballContainer);

    let ballRoot = null;
    let ballModelCenter = null;
    let ballModelMaxDim = 1;

    // Default Orientation & Drag Controls
    const DEFAULT_ROT_X = 0.08;
    const DEFAULT_ROT_Y = 0;
    const DEFAULT_ZOOM = 4.0;

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

    // Serve animation parameters
    let serveStartTime = null;
    let serveDuration = 1.25; // seconds
    let isServing = false;

    const startPos = new THREE.Vector3(2.6, 3.2, -2.5); // High serve toss starting point
    const bouncePos = new THREE.Vector3(0, -1.2, 0.4); // Court bounce contact point
    const restPos = new THREE.Vector3(0, 0, 0); // Settled floating center

    const triggerServeAnimation = () => {
      serveStartTime = performance.now();
      isServing = true;
      setIsAceServed(false);
      ballContainer.position.copy(startPos);
      ballContainer.scale.setScalar(0.7);
    };

    replayServeRef.current = triggerServeAnimation;

    // Load 3D Tennis Ball GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (isDisposed) return;
        ballRoot = gltf.scene;

        const box = new THREE.Box3().setFromObject(ballRoot);
        ballModelCenter = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        ballModelMaxDim = Math.max(size.x, size.y, size.z);

        // Auto-scale tennis ball to clean, prominent size
        const targetScale = (1.75 / (ballModelMaxDim || 1)) * scaleMultiplier;
        ballRoot.scale.setScalar(targetScale);
        ballRoot.position.set(
          -ballModelCenter.x * targetScale,
          -ballModelCenter.y * targetScale,
          -ballModelCenter.z * targetScale
        );

        ballRoot.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.roughness = Math.min(child.material.roughness, 0.7);
              child.material.envMapIntensity = 1.3;
            }
          }
        });

        ballContainer.add(ballRoot);
        setLoading(false);

        // Start serve animation on load!
        triggerServeAnimation();
      },
      undefined,
      (err) => {
        console.error("Error loading tennis ball 3D model:", err);
        if (!isDisposed) {
          setError(true);
          setLoading(false);
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
      targetZoom = Math.max(2.0, Math.min(6.5, targetZoom));
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
    // MAIN RENDER & SERVE PHYSICS LOOP
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

      // Serve Animation Flight
      if (isServing && serveStartTime !== null) {
        const elapsed = (performance.now() - serveStartTime) / 1000;
        const progress = Math.min(elapsed / serveDuration, 1);

        if (progress < 0.5) {
          // Phase 1: Downward smash from high toss onto court baseline
          const t1 = progress / 0.5;
          const ease1 = t1 * t1;
          const currentX = THREE.MathUtils.lerp(startPos.x, bouncePos.x, ease1);
          const currentY = THREE.MathUtils.lerp(startPos.y, bouncePos.y, ease1);
          const currentZ = THREE.MathUtils.lerp(startPos.z, bouncePos.z, ease1);
          ballContainer.position.set(currentX, currentY, currentZ);

          // Fast topspin
          ballContainer.rotation.x += 0.4;
          ballContainer.rotation.y += 0.2;
        } else {
          // Phase 2: Upward bounce from baseline into resting center float
          const t2 = (progress - 0.5) / 0.5;
          const ease2 = 1 - Math.pow(1 - t2, 3);
          const currentX = THREE.MathUtils.lerp(bouncePos.x, restPos.x, ease2);
          const currentY = THREE.MathUtils.lerp(bouncePos.y, restPos.y, ease2) + Math.sin(t2 * Math.PI) * 0.35;
          const currentZ = THREE.MathUtils.lerp(bouncePos.z, restPos.z, ease2);
          ballContainer.position.set(currentX, currentY, currentZ);

          ballContainer.rotation.x += 0.2 * (1 - t2 * 0.6);
          ballContainer.rotation.y += 0.15 * (1 - t2 * 0.6);

          // Trigger bounce court sparks once
          if (t2 < 0.1 && particleMat.opacity === 0) {
            particleMat.opacity = 0.9;
            for (let i = 0; i < particleCount; i++) {
              particlePositions[i * 3] = bouncePos.x;
              particlePositions[i * 3 + 1] = bouncePos.y;
              particlePositions[i * 3 + 2] = bouncePos.z;
              particleVelocities[i].life = 1.0;
            }
            particleGeom.attributes.position.needsUpdate = true;
          }
        }

        const currentScale = THREE.MathUtils.lerp(0.7, 1.0, progress);
        ballContainer.scale.setScalar(currentScale);

        if (progress >= 1) {
          isServing = false;
          setIsAceServed(true);
        }
      } else if (!isDragging) {
        // Idle gentle levitation
        const idleFloat = Math.sin(elapsedTime * 1.6) * 0.04;
        ballContainer.position.set(restPos.x, restPos.y + idleFloat, restPos.z);

        // Slow ambient topspin
        ballContainer.rotation.y += 0.008;
        ballContainer.rotation.x += Math.sin(elapsedTime * 0.8) * 0.002;
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
  }, [modelPath, interactive, scaleMultiplier, ballFill]);

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
              border: "2px solid rgba(204, 255, 0, 0.3)",
              borderTopColor: "#ccff00",
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
            Loading 3D Tennis Court...
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

      {/* Serve Status, Reset & Replay Controls */}
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
                background: isAceServed ? "#ccff00" : "var(--o-400, #ff8c00)",
                boxShadow: isAceServed ? "0 0 10px #ccff00" : "0 0 10px #ff8c00",
                transition: "all 0.3s ease",
              }}
            />
            {isAceServed ? "🎾 ACE! Drag Ball in 3D" : "Serving Ace..."}
          </div>

          {/* Reset View Button */}
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

          {/* Serve Again Button */}
          <button
            type="button"
            onClick={() => replayServeRef.current && replayServeRef.current()}
            style={{
              padding: "5px 12px",
              background: "linear-gradient(135deg, rgba(204,255,0,0.25), rgba(0,200,83,0.25))",
              border: "1px solid rgba(204, 255, 0, 0.4)",
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
              e.currentTarget.style.borderColor = "#ccff00";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(204, 255, 0, 0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Serve Again 🎾
          </button>
        </div>
      )}
    </div>
  );
}
