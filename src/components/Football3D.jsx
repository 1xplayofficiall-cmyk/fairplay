"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Football3D({
  className = "",
  ballModelPath = "/models/football.glb",
  interactive = true,
  scaleMultiplier = 1,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isShotScored, setIsShotScored] = useState(false);
  const replayShootRef = useRef(null);
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

    // Studio & Stadium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainStadiumLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainStadiumLight.position.set(5, 8, 5);
    scene.add(mainStadiumLight);

    const fillLight = new THREE.DirectionalLight(0xccffdd, 1.6);
    fillLight.position.set(-5, 5, 4);
    scene.add(fillLight);

    // FairPlay Orange Stadium Rim Light
    const orangeRim = new THREE.DirectionalLight(0xff8c00, 3.6);
    orangeRim.position.set(-6, 5, -2);
    scene.add(orangeRim);

    // FairPlay Green Stadium Accent Light
    const greenAccent = new THREE.DirectionalLight(0x00c853, 3.2);
    greenAccent.position.set(6, -2, -1);
    scene.add(greenAccent);

    // Bottom Pitch Glow
    const pitchGlowLight = new THREE.PointLight(0x00c853, 1.8, 8);
    pitchGlowLight.position.set(0, -1.2, 0);
    scene.add(pitchGlowLight);

    // =========================================================================
    // MAIN INTERACTIVE STAGE (DRAGGABLE 3D FOOTBALL + PITCH)
    // =========================================================================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const ballContainer = new THREE.Group();
    stageGroup.add(ballContainer);

    // Pitch Ground Grid (Football Grass Geometry)
    const pitchGeom = new THREE.PlaneGeometry(5.8, 4.4, 14, 14);
    const pitchMat = new THREE.MeshBasicMaterial({
      color: 0x082613,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const pitchMesh = new THREE.Mesh(pitchGeom, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.position.set(0, -1.3, 0);
    stageGroup.add(pitchMesh);

    // Center Circle / Penalty Spot Glow Ring
    const spotRingGeom = new THREE.RingGeometry(1.6, 1.65, 48);
    const spotRingMat = new THREE.MeshBasicMaterial({
      color: 0x00c853,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const spotRingMesh = new THREE.Mesh(spotRingGeom, spotRingMat);
    spotRingMesh.rotation.x = -Math.PI / 2;
    spotRingMesh.position.set(0, -1.29, 0);
    stageGroup.add(spotRingMesh);

    // Center Spot
    const centerSpotGeom = new THREE.CircleGeometry(0.12, 32);
    const centerSpotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const centerSpotMesh = new THREE.Mesh(centerSpotGeom, centerSpotMat);
    centerSpotMesh.rotation.x = -Math.PI / 2;
    centerSpotMesh.position.set(0, -1.28, 0);
    stageGroup.add(centerSpotMesh);

    // Default Orientation
    const DEFAULT_ROT_X = 0.08;
    const DEFAULT_ROT_Y = -0.22;
    const DEFAULT_ZOOM = 4.0;

    let targetRotX = DEFAULT_ROT_X;
    let targetRotY = DEFAULT_ROT_Y;
    let currentRotX = DEFAULT_ROT_X;
    let currentRotY = DEFAULT_ROT_Y;
    let targetZoom = DEFAULT_ZOOM;

    stageGroup.rotation.x = DEFAULT_ROT_X;
    stageGroup.rotation.y = DEFAULT_ROT_Y;

    // Reset View Function
    resetViewRef.current = () => {
      targetRotX = DEFAULT_ROT_X;
      targetRotY = DEFAULT_ROT_Y;
      targetZoom = DEFAULT_ZOOM;
    };

    // =========================================================================
    // TURF / SHOT CELEBRATION PARTICLES
    // =========================================================================
    const particleCount = 50;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    const greenCol = new THREE.Color(0x00c853);
    const orangeCol = new THREE.Color(0xff8c00);
    const whiteCol = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;

      const c = i % 3 === 0 ? greenCol : i % 3 === 1 ? orangeCol : whiteCol;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.14,
        y: Math.random() * 0.16 + 0.04,
        z: (Math.random() - 0.5) * 0.14,
        life: 0,
      });
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    stageGroup.add(particleSystem);

    // =========================================================================
    // STRIKE / SHOT ANIMATION
    // =========================================================================
    let shotStartTime = null;
    let shotDuration = 2.2; // seconds
    let isShooting = false;

    const triggerShotAnimation = () => {
      shotStartTime = performance.now();
      isShooting = true;
      setIsShotScored(false);

      // Trigger turf burst
      particleMat.opacity = 1;
      for (let i = 0; i < particleCount; i++) {
        const pos = particleGeom.attributes.position.array;
        pos[i * 3] = ballContainer.position.x;
        pos[i * 3 + 1] = ballContainer.position.y - 0.8;
        pos[i * 3 + 2] = ballContainer.position.z;
        particleVelocities[i].life = 1.0;
      }
      particleGeom.attributes.position.needsUpdate = true;
    };

    replayShootRef.current = triggerShotAnimation;

    // Load 3D Football Model
    const loader = new GLTFLoader();
    loader.load(
      ballModelPath,
      (gltf) => {
        if (isDisposed) return;
        const ballRoot = gltf.scene;

        const ballBox = new THREE.Box3().setFromObject(ballRoot);
        const ballSize = ballBox.getSize(new THREE.Vector3());
        const center = ballBox.getCenter(new THREE.Vector3());
        const maxDim = Math.max(ballSize.x, ballSize.y, ballSize.z);

        // Center ball around its origin
        ballRoot.position.x = -center.x;
        ballRoot.position.y = -center.y;
        ballRoot.position.z = -center.z;

        // Scale ball to prominent hero size
        const targetScale = (2.4 / (maxDim || 1)) * scaleMultiplier;
        ballContainer.scale.setScalar(targetScale);

        ballRoot.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.roughness = Math.min(child.material.roughness, 0.55);
              child.material.envMapIntensity = 1.3;
            }
          }
        });

        ballContainer.add(ballRoot);
        setLoading(false);

        // Initial entrance strike
        setTimeout(() => {
          if (!isDisposed) {
            triggerShotAnimation();
          }
        }, 300);
      },
      undefined,
      (err) => {
        console.error("Error loading football model:", err);
        if (!isDisposed) {
          setError(true);
          setLoading(false);
        }
      }
    );

    // =========================================================================
    // INTERACTION DRAGGING (MOUSE & TOUCH)
    // =========================================================================
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let userInteracted = false;
    let idleFloatTime = 0;

    const handlePointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      userInteracted = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !interactive) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;

      // Clamp vertical tilt
      targetRotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotX));

      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Zoom with scroll wheel
    const handleWheel = (e) => {
      if (!interactive) return;
      e.preventDefault();
      targetZoom += e.deltaY * 0.003;
      targetZoom = Math.max(2.2, Math.min(5.5, targetZoom));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    domElement.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);
    domElement.addEventListener("wheel", handleWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width) || 440;
      const h = Math.round(rect.height) || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // =========================================================================
    // RENDER ANIMATION LOOP
    // =========================================================================
    let lastTime = performance.now();

    const animate = (currentTime) => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth Stage Rotation Damping
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      stageGroup.rotation.x = currentRotX;
      stageGroup.rotation.y = currentRotY;

      // Camera distance damping
      camera.position.z += (targetZoom - camera.position.z) * 0.08;
      camera.lookAt(0, 0.1, 0);

      // Idle Floating Motion when not dragging
      if (!isDragging && !userInteracted && !isShooting) {
        idleFloatTime += dt;
        ballContainer.position.y = Math.sin(idleFloatTime * 1.5) * 0.08;
        ballContainer.rotation.y += 0.006;
        ballContainer.rotation.x = Math.sin(idleFloatTime * 0.8) * 0.05;
      }

      // Dynamic Strike / Curve Shot Trajectory
      if (isShooting && shotStartTime) {
        const elapsed = (currentTime - shotStartTime) / 1000;
        const progress = Math.min(elapsed / shotDuration, 1.0);

        if (progress < 1.0) {
          // Powerful curved kick arc
          const t = progress;
          // Arc up, out, curve, and return
          const curveX = Math.sin(t * Math.PI) * 0.8;
          const curveY = Math.sin(t * Math.PI) * 0.7 - Math.pow(t, 2) * 0.1;
          const curveZ = -Math.sin(t * Math.PI) * 1.2;

          ballContainer.position.set(curveX, curveY, curveZ);

          // Fast topspin & sidespin
          ballContainer.rotation.x += dt * 14 * (1 - t * 0.5);
          ballContainer.rotation.y += dt * 18 * (1 - t * 0.5);
        } else {
          isShooting = false;
          setIsShotScored(true);
          ballContainer.position.set(0, 0, 0);
        }
      }

      // Update Particles
      if (particleMat.opacity > 0) {
        const positions = particleGeom.attributes.position.array;
        let anyAlive = false;

        for (let i = 0; i < particleCount; i++) {
          if (particleVelocities[i].life > 0) {
            anyAlive = true;
            particleVelocities[i].life -= dt * 1.2;
            positions[i * 3] += particleVelocities[i].x;
            positions[i * 3 + 1] += particleVelocities[i].y;
            positions[i * 3 + 2] += particleVelocities[i].z;
            particleVelocities[i].y -= dt * 0.12; // Gravity
          }
        }

        particleGeom.attributes.position.needsUpdate = true;
        particleMat.opacity = Math.max(0, particleMat.opacity - dt * 0.8);
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", handleResize);

      domElement.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);

      domElement.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      domElement.removeEventListener("wheel", handleWheel);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      renderer.dispose();
      scene.clear();
      pitchGeom.dispose();
      pitchMat.dispose();
      spotRingGeom.dispose();
      spotRingMat.dispose();
      centerSpotGeom.dispose();
      centerSpotMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, [ballModelPath, interactive, scaleMultiplier]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "420px",
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
          cursor: "grab",
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
            gap: "0.75rem",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid rgba(0, 200, 83, 0.3)",
              borderTopColor: "#00c853",
              animation: "spin 1s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-4, rgba(255,255,255,0.6))",
            }}
          >
            Loading 3D Football Stadium...
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
          3D football preview unavailable
        </div>
      )}

      {/* Interactive Controls & HUD */}
      {!loading && !error && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            zIndex: 5,
            width: "95%",
            maxWidth: "460px",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              padding: "6px 14px",
              background: "rgba(13, 16, 17, 0.88)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(12px)",
              borderRadius: "999px",
              fontSize: "0.74rem",
              color: "var(--fg-2, #ffffff)",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isShotScored ? "var(--g-400, #00c853)" : "var(--o-400, #ff8c00)",
                boxShadow: isShotScored ? "0 0 10px #00c853" : "0 0 10px #ff8c00",
                transition: "all 0.3s ease",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              {isShotScored ? "⚽ TOP BINS! Drag Ball in 3D" : "⚽ Striking Football..."}
            </span>
          </div>

          {/* Reset Angle Button */}
          <button
            type="button"
            onClick={() => resetViewRef.current && resetViewRef.current()}
            title="Reset to default angle"
            style={{
              padding: "6px 12px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              fontSize: "0.72rem",
              color: "var(--fg-3, rgba(255,255,255,0.75))",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg-3, rgba(255,255,255,0.75))";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            Reset ↺
          </button>

          {/* Strike Ball Button */}
          <button
            type="button"
            onClick={() => replayShootRef.current && replayShootRef.current()}
            style={{
              padding: "6px 14px",
              background: "linear-gradient(135deg, rgba(0,200,83,0.35), rgba(255,140,0,0.35))",
              border: "1px solid rgba(0, 200, 83, 0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              fontSize: "0.74rem",
              fontWeight: "600",
              color: "var(--fg, #ffffff)",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              whiteSpace: "nowrap",
              boxShadow: "0 0 14px rgba(0,200,83,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--g-400, #00c853)";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 200, 83, 0.6)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span>Strike Ball</span>
            <span>⚽</span>
          </button>
        </div>
      )}
    </div>
  );
}
