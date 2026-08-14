"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Football3D({
  className = "",
  netModelPath = "/models/football_net.glb",
  ballModelPath = "/models/football.glb",
  interactive = true,
  scaleMultiplier = 1,
  // Share of the visible frame the goal is allowed to span. Sizing the net
  // against the camera frustum instead of fixed world units is what stops it
  // being cut off on wide-but-short hero slots.
  netFill = 0.5,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isGoalScored, setIsGoalScored] = useState(false);
  const [netCoords, setNetCoords] = useState({ rotX: 0, rotY: -16, zoom: 3.8 });
  const replayShootRef = useRef(null);
  const resetViewRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isDisposed = false;

    // Scene
    const scene = new THREE.Scene();

    // Camera setup. Measured off the rect so the very first frame uses the
    // real box rather than a fallback that would render at the wrong aspect.
    const initialRect = container.getBoundingClientRect();
    const width = Math.round(initialRect.width) || 440;
    const height = Math.round(initialRect.height) || 440;
    const FOV = 45;
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio & Stadium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainStadiumLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainStadiumLight.position.set(5, 7, 5);
    scene.add(mainStadiumLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
    fillLight.position.set(-5, 6, 4);
    scene.add(fillLight);

    // FairPlay Orange Stadium Rim Light
    const orangeRim = new THREE.DirectionalLight(0xff8c00, 3.5);
    orangeRim.position.set(-6, 4, -2);
    scene.add(orangeRim);

    // FairPlay Green Stadium Accent Light
    const greenAccent = new THREE.DirectionalLight(0x00c853, 3.2);
    greenAccent.position.set(6, -3, -1);
    scene.add(greenAccent);

    // Bottom Goal Line Glow
    const goalLineLight = new THREE.PointLight(0x00c853, 1.6, 8);
    goalLineLight.position.set(0, -1.5, -0.4);
    scene.add(goalLineLight);

    // =========================================================================
    // MAIN INTERACTIVE STAGE (DRAGGABLE NET + BALL TOGETHER)
    // =========================================================================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const netGroup = new THREE.Group();
    stageGroup.add(netGroup);

    const ballContainer = new THREE.Group();
    stageGroup.add(ballContainer);

    // Initial default orientation for the custom net model
    const DEFAULT_ROT_X = 0.02;
    const DEFAULT_ROT_Y = -0.28;
    const DEFAULT_ZOOM = 3.8;

    let targetRotX = DEFAULT_ROT_X;
    let targetRotY = DEFAULT_ROT_Y;
    let currentRotX = DEFAULT_ROT_X;
    let currentRotY = DEFAULT_ROT_Y;
    let targetPanX = 0;
    let targetPanY = 0;
    let currentPanX = 0;
    let currentPanY = 0;
    let targetZoom = DEFAULT_ZOOM;

    stageGroup.rotation.x = DEFAULT_ROT_X;
    stageGroup.rotation.y = DEFAULT_ROT_Y;

    // Reset View Function
    resetViewRef.current = () => {
      targetRotX = DEFAULT_ROT_X;
      targetRotY = DEFAULT_ROT_Y;
      targetPanX = 0;
      targetPanY = 0;
      targetZoom = DEFAULT_ZOOM;
    };

    // Celebration Particles
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = -1.0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.2) * 0.1,
        z: (Math.random() - 0.3) * 0.08,
        life: 0,
      });
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00c853,
      size: 0.09,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    stageGroup.add(particleSystem);

    // Shot parameters
    let shotStartTime = null;
    let shotDuration = 1.3;
    let isFlying = false;

    // Positions below are the hand-tuned layout for a goal 4.8 world units
    // wide. Everything is re-derived from that reference by `fit()`, so the
    // whole composition scales as one instead of drifting apart.
    const REFERENCE_NET_WIDTH = 4.8;
    const startPos = new THREE.Vector3(0, -2.8, 3.6);
    const targetPos = new THREE.Vector3(-0.05, -0.05, -0.5);
    const reboundPos = new THREE.Vector3(-0.05, -0.05, -0.25);

    const triggerShotAnimation = () => {
      shotStartTime = performance.now();
      isFlying = true;
      setIsGoalScored(false);
      ballContainer.position.copy(startPos);
      ballContainer.scale.setScalar(0.7);
    };

    replayShootRef.current = triggerShotAnimation;

    // =========================================================================
    // VIEWPORT FIT
    // The goal is sized against what the camera can actually see, so a short
    // wide hero slot gets a smaller net rather than one clipped at the edges.
    // =========================================================================
    let netRoot = null;
    let netModelSize = null;
    let netModelCenter = null;
    let netHull = [];
    let frameOffsetX = 0;
    let frameOffsetY = 0;
    let ballRoot = null;
    let ballModelMaxDim = 1;
    let ballModelCenter = null;

    // Place the goal for a given scale. `k` is how the fitted goal compares to
    // the 4.8-unit layout every other offset was tuned against.
    const netCentreOffset = new THREE.Vector3();
    const placeNet = (scale) => {
      // Longest axis, not x: this model's width runs along its local z.
      const longest = Math.max(netModelSize.x, netModelSize.y, netModelSize.z);
      const k = (longest * scale) / REFERENCE_NET_WIDTH;
      netRoot.scale.setScalar(scale);
      // The centre was measured in the net's local frame, but `position` is in
      // the parent's — and this model's root carries a rotation, so the offset
      // has to be rotated across or the goal ends up skewed out of frame.
      netCentreOffset
        .copy(netModelCenter)
        .multiplyScalar(scale)
        .applyQuaternion(netRoot.quaternion);
      netRoot.position.set(
        -netCentreOffset.x - 0.1 * k,
        -netCentreOffset.y - 0.05 * k,
        -netCentreOffset.z - 0.6 * k
      );
      return k;
    };

    // Screen-space box the goal occupies, in NDC. Measured rather than derived:
    // this model's netting tails 6 units backwards, so its bounding box says
    // nothing useful about how wide it lands on screen.
    const scratch = new THREE.Vector3();
    const projectedBounds = () => {
      stageGroup.updateMatrixWorld(true);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const point of netHull) {
        scratch.copy(point).applyMatrix4(netRoot.matrixWorld).project(camera);
        minX = Math.min(minX, scratch.x);
        maxX = Math.max(maxX, scratch.x);
        minY = Math.min(minY, scratch.y);
        maxY = Math.max(maxY, scratch.y);
      }
      return { minX, maxX, minY, maxY };
    };

    // NDC spans -1..1, so half the delta is the fraction of the frame used.
    const spanOf = (b) => Math.max((b.maxX - b.minX) / 2, (b.maxY - b.minY) / 2);

    const fit = () => {
      if (!netRoot || !netModelSize || !netHull.length) return;

      // Measure at the default angle and with panning zeroed, so the fit frames
      // the resting composition rather than chasing wherever the user dragged it.
      const liveRotX = stageGroup.rotation.x;
      const liveRotY = stageGroup.rotation.y;
      const livePos = stageGroup.position.clone();
      stageGroup.rotation.set(DEFAULT_ROT_X, DEFAULT_ROT_Y, 0);
      stageGroup.position.set(0, 0, 0);

      // Bisection, not proportional stepping: the projected size grows faster
      // than the scale does (the goal is deep, so its near edge swings towards
      // the camera as it grows), and dividing by the overshoot just oscillates.
      const spanAt = (candidate) => {
        placeNet(candidate);
        return spanOf(projectedBounds());
      };

      let low = 0;
      let high =
        netRoot.scale.x ||
        REFERENCE_NET_WIDTH / (Math.max(netModelSize.x, netModelSize.y, netModelSize.z) || 1);
      let guard = 0;
      while (spanAt(high) < netFill && guard++ < 12) {
        low = high;
        high *= 2;
      }
      for (let pass = 0; pass < 18; pass++) {
        const mid = (low + high) / 2;
        if (spanAt(mid) > netFill) high = mid;
        else low = mid;
      }
      const k = placeNet(low);

      // Centre what is actually on screen. The goal's deep netting throws its
      // bounding-box centre well off the visible middle, which is what left it
      // hanging past the right edge.
      const bounds = projectedBounds();
      const centreX = (bounds.minX + bounds.maxX) / 2;
      const centreY = (bounds.minY + bounds.maxY) / 2;
      const PROBE = 0.2;
      stageGroup.position.set(PROBE, PROBE, 0);
      const probed = projectedBounds();
      const slopeX = ((probed.minX + probed.maxX) / 2 - centreX) / PROBE;
      const slopeY = ((probed.minY + probed.maxY) / 2 - centreY) / PROBE;
      // A stage shift moves the content in camera space without changing depth,
      // so the projected centre is linear in it: one step lands it exactly.
      frameOffsetX = slopeX ? -centreX / slopeX : 0;
      frameOffsetY = slopeY ? -centreY / slopeY : 0;

      stageGroup.rotation.set(liveRotX, liveRotY, 0);
      stageGroup.position.copy(livePos);
      stageGroup.updateMatrixWorld(true);

      startPos.set(0, -2.8 * k, 3.6 * k);
      targetPos.set(-0.05 * k, -0.05 * k, -0.5 * k);
      reboundPos.set(-0.05 * k, -0.05 * k, -0.25 * k);

      if (ballRoot) {
        // Ball stays in proportion to the goal at every size.
        const ballScale = ((0.8 * k) / (ballModelMaxDim || 1)) * scaleMultiplier;
        ballRoot.scale.setScalar(ballScale);
        ballRoot.position.set(
          -ballModelCenter.x * ballScale,
          -ballModelCenter.y * ballScale,
          -ballModelCenter.z * ballScale
        );
      }
    };

    // Load Models
    const loader = new GLTFLoader();
    let netLoaded = false;
    let ballLoaded = false;

    const checkBothLoaded = () => {
      if (netLoaded && ballLoaded && !isDisposed) {
        setLoading(false);
        triggerShotAnimation();
      }
    };

    // 1. Load 3D Goal Net Model
    loader.load(
      netModelPath,
      (gltf) => {
        if (isDisposed) return;
        netRoot = gltf.scene;

        // Collect the goal's corner points in the net's own local space. Doing
        // the measuring here — rather than with a Box3 in whatever frame the
        // glTF root happens to carry — keeps sizing and centring honest even
        // though the loader overwrites that root's transform below.
        netRoot.updateMatrixWorld(true);
        const toNetLocal = new THREE.Matrix4().copy(netRoot.matrixWorld).invert();
        const meshSamples = [];

        netRoot.traverse((child) => {
          if (child.isMesh && child.geometry?.attributes?.position) {
            // Sampled vertices, not per-mesh bounding boxes: a box around
            // draped netting is far bigger than the netting, and the fit would
            // shrink the goal to keep empty space on screen.
            const position = child.geometry.attributes.position;
            const stride = Math.max(1, Math.ceil(position.count / 300));
            const points = [];
            for (let i = 0; i < position.count; i += stride) {
              points.push(
                new THREE.Vector3()
                  .fromBufferAttribute(position, i)
                  .applyMatrix4(child.matrixWorld)
                  .applyMatrix4(toNetLocal)
              );
            }
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            meshSamples.push({
              points,
              reach: child.geometry.boundingBox.getSize(new THREE.Vector3()).length(),
            });
          }
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                mat.depthWrite = true;
              });
            } else {
              child.material.side = THREE.DoubleSide;
              child.material.depthWrite = true;
            }
          }
        });

        // Frame on the goal, ignoring parts authored at a wildly different
        // scale. This asset carries a 48-unit cylinder next to ~3-unit goal
        // pieces; it sits near the camera and projects taller than the goal
        // itself, so including it shrinks the goal to frame a stray post.
        const reaches = meshSamples.map((m) => m.reach).sort((a, b) => a - b);
        const medianReach = reaches[Math.floor(reaches.length / 2)] || 0;
        const keep =
          meshSamples.length > 2 && medianReach > 0
            ? meshSamples.filter((m) => m.reach <= medianReach * 4)
            : meshSamples;
        netHull = keep.flatMap((m) => m.points);

        const netBox = new THREE.Box3().setFromPoints(netHull);
        netModelCenter = netBox.getCenter(new THREE.Vector3());
        netModelSize = netBox.getSize(new THREE.Vector3());

        netGroup.add(netRoot);
        fit();
        netLoaded = true;
        checkBothLoaded();
      },
      undefined,
      (err) => {
        console.error("Error loading goal net model:", err);
        netLoaded = true;
        checkBothLoaded();
      }
    );

    // 2. Load 3D Football Model
    loader.load(
      ballModelPath,
      (gltf) => {
        if (isDisposed) return;
        ballRoot = gltf.scene;

        const ballBox = new THREE.Box3().setFromObject(ballRoot);
        const ballSize = ballBox.getSize(new THREE.Vector3());
        ballModelCenter = ballBox.getCenter(new THREE.Vector3());
        ballModelMaxDim = Math.max(ballSize.x, ballSize.y, ballSize.z);

        ballRoot.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.roughness = Math.min(child.material.roughness, 0.65);
              child.material.envMapIntensity = 1.3;
            }
          }
        });

        ballContainer.add(ballRoot);
        fit();
        ballLoaded = true;
        checkBothLoaded();
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
    // INTERACTIVE DRAGGING (ROTATION + PAN + ZOOM ON NET & BALL)
    // =========================================================================
    let isDragging = false;
    let isPanning = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      isPanning = e.button === 2 || e.shiftKey; // Right-click or Shift+drag for pan
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

      if (isPanning) {
        // Pan stage
        targetPanX += deltaX * 0.005;
        targetPanY -= deltaY * 0.005;
      } else {
        // Rotate net & ball in 3D
        velocity = {
          x: deltaY * 0.006,
          y: deltaX * 0.006,
        };

        targetRotX += velocity.x;
        targetRotY += velocity.y;

        // Clamp vertical tilt to avoid flipping upside down
        targetRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotX));
      }

      previousPointerPosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
      isPanning = false;
    };

    // Zoom with scroll wheel
    const handleWheel = (e) => {
      if (!interactive) return;
      e.preventDefault();
      targetZoom += e.deltaY * 0.003;
      targetZoom = Math.max(1.8, Math.min(6.5, targetZoom));
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

    domElement.addEventListener("contextmenu", (e) => e.preventDefault());

    domElement.addEventListener("mousedown", () => {
      domElement.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
      domElement.style.cursor = interactive ? "grab" : "default";
    });

    // Resize Observer. The hero slot settles late (fonts, ScrollSmoother), so
    // the fit is redone on every size change rather than only at load.
    let lastW = width;
    let lastH = height;

    const applySize = (newW, newH) => {
      if (newW <= 0 || newH <= 0) return;
      if (Math.abs(newW - lastW) < 1 && Math.abs(newH - lastH) < 1) return;
      lastW = newW;
      lastH = newH;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      fit();
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        applySize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // Catch a layout that lands after mount but before the observer settles.
    const settleFrame = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      applySize(rect.width, rect.height);
    });

    // =========================================================================
    // ANIMATION & DRAG UPDATE LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    let lastCoordUpdateTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth damping interpolation
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      currentPanX += (targetPanX - currentPanX) * 0.12;
      currentPanY += (targetPanY - currentPanY) * 0.12;
      camera.position.z += (targetZoom - camera.position.z) * 0.1;

      // Apply drag rotation and pan to whole stage (Net + Ball)
      stageGroup.rotation.x = currentRotX;
      stageGroup.rotation.y = currentRotY;
      stageGroup.position.x = frameOffsetX + currentPanX;
      stageGroup.position.y = frameOffsetY + currentPanY;

      // Update UI readout throttled
      if (performance.now() - lastCoordUpdateTime > 200) {
        lastCoordUpdateTime = performance.now();
        setNetCoords({
          rotX: Math.round((currentRotX * 180) / Math.PI),
          rotY: Math.round((currentRotY * 180) / Math.PI),
          zoom: Math.round(camera.position.z * 10) / 10,
        });
      }

      // Shot Animation Progress
      if (isFlying && shotStartTime !== null) {
        const elapsedShot = (performance.now() - shotStartTime) / 1000;
        const progress = Math.min(elapsedShot / shotDuration, 1);

        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentX = THREE.MathUtils.lerp(startPos.x, targetPos.x, ease);
        const currentY = THREE.MathUtils.lerp(startPos.y, targetPos.y, ease) + Math.sin(progress * Math.PI) * 0.45;
        const currentZ = THREE.MathUtils.lerp(startPos.z, targetPos.z, ease);

        ballContainer.position.set(currentX, currentY, currentZ);

        const currentScale = THREE.MathUtils.lerp(0.7, 1.0, ease);
        ballContainer.scale.setScalar(currentScale);

        // Spin ball while flying
        ballContainer.rotation.x += 0.2;
        ballContainer.rotation.y += 0.25;

        if (progress >= 1) {
          isFlying = false;
          setIsGoalScored(true);

          particleMat.opacity = 0.9;
          for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = targetPos.x;
            particlePositions[i * 3 + 1] = targetPos.y;
            particlePositions[i * 3 + 2] = -1.2;
            particleVelocities[i].life = 1.0;
          }
          particleGeom.attributes.position.needsUpdate = true;
        }
      } else if (!isDragging) {
        // Floating inside net
        const idleFloat = Math.sin(elapsedTime * 1.8) * 0.03;
        ballContainer.position.x = reboundPos.x;
        ballContainer.position.y = reboundPos.y + idleFloat;
        ballContainer.position.z = reboundPos.z;

        // Subtle ball rotation
        ballContainer.rotation.y += 0.008;
      }

      // Particles decay
      if (particleMat.opacity > 0.01) {
        particleMat.opacity *= 0.95;
        const positions = particleGeom.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          if (v.life > 0) {
            positions.setX(i, positions.getX(i) + v.x);
            positions.setY(i, positions.getY(i) + v.y);
            positions.setZ(i, positions.getZ(i) + v.z);
            v.life *= 0.95;
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
      cancelAnimationFrame(settleFrame);
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
  }, [netModelPath, ballModelPath, interactive, scaleMultiplier, netFill]);

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
      {/* 3D Canvas */}
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
              borderTopColor: "var(--o-400, #ff8c00)",
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
            Loading 3D Stadium...
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

      {/* Goal Status, Live Orientation & Replay Controls */}
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
                background: isGoalScored ? "var(--g-400, #00c853)" : "var(--o-400, #ff8c00)",
                boxShadow: isGoalScored ? "0 0 10px #00c853" : "0 0 10px #ff8c00",
                transition: "all 0.3s ease",
              }}
            />
            {isGoalScored ? "🖐️ Drag to Rotate Net & Ball in 3D" : "Shooting..."}
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
            onClick={() => replayShootRef.current && replayShootRef.current()}
            style={{
              padding: "5px 12px",
              background: "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(0,200,83,0.25))",
              border: "1px solid rgba(255, 140, 0, 0.4)",
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
              e.currentTarget.style.borderColor = "rgba(255, 140, 0, 0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Shoot Again ⚽
          </button>
        </div>
      )}
    </div>
  );
}
