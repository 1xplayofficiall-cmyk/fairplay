"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Standard European Roulette Wheel Numbers in exact wheel order
const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

function getNumberInfo(num) {
  if (num === 0) return { num: 0, color: "green", label: "0 GREEN" };
  if (RED_NUMBERS.has(num)) return { num, color: "red", label: `${num} RED` };
  return { num, color: "black", label: `${num} BLACK` };
}

// Procedural high-res casino chip edge & face texture
function createChipTexture(baseColor, stripeColor, text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Outer ring
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  // Edge stripes (casino chip edge markings)
  ctx.fillStyle = stripeColor;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.save();
    ctx.translate(128, 128);
    ctx.rotate(angle);
    ctx.fillRect(96, -14, 28, 28);
    ctx.restore();
  }

  // Inner ring
  ctx.fillStyle = "#121517";
  ctx.beginPath();
  ctx.arc(128, 128, 86, 0, Math.PI * 2);
  ctx.fill();

  // Gold inlay border
  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Value text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function Casino3D({
  className = "",
  modelPath = "/models/roulette_table.glb",
  interactive = true,
  scaleMultiplier = 1,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState(getNumberInfo(7));
  const [recentResults, setRecentResults] = useState([
    getNumberInfo(7),
    getNumberInfo(22),
    getNumberInfo(0),
  ]);

  const replaySpinRef = useRef(null);
  const resetViewRef = useRef(null);
  const rotorGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isDisposed = false;

    // Scene
    const scene = new THREE.Scene();

    // Camera setup
    const initialRect = container.getBoundingClientRect();
    const width = Math.round(initialRect.width) || 480;
    const height = Math.round(initialRect.height) || 480;
    const FOV = 45;
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    // Elevated angle looking down on the roulette wheel
    camera.position.set(0, 2.4, 3.8);

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

    // Studio & Casino Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Overhead casino chandelier spot
    const chandelierLight = new THREE.DirectionalLight(0xfff4e0, 2.8);
    chandelierLight.position.set(3, 8, 4);
    scene.add(chandelierLight);

    // Warm casino fill light
    const fillLight = new THREE.DirectionalLight(0xffd180, 1.6);
    fillLight.position.set(-4, 5, 3);
    scene.add(fillLight);

    // FairPlay Orange Stadium Rim Light
    const orangeRim = new THREE.DirectionalLight(0xff8c00, 3.6);
    orangeRim.position.set(-6, 4, -2);
    scene.add(orangeRim);

    // FairPlay Green Turf Accent Light
    const greenAccent = new THREE.DirectionalLight(0x00c853, 3.0);
    greenAccent.position.set(6, -2, -1);
    scene.add(greenAccent);

    // Center Gold Turret Point Light
    const turretLight = new THREE.PointLight(0xffd700, 2.2, 6);
    turretLight.position.set(0, 1.2, 0);
    scene.add(turretLight);

    // Emerald Casino Felt Glow
    const feltGlowLight = new THREE.PointLight(0x00e676, 1.2, 8);
    feltGlowLight.position.set(0, -1.0, 0);
    scene.add(feltGlowLight);

    // =========================================================================
    // MAIN INTERACTIVE STAGE (DRAGGABLE ROULETTE + BALL + CHIPS)
    // =========================================================================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Default Orientation (Isometric tilt looking at roulette table)
    const DEFAULT_ROT_X = 0.38;
    const DEFAULT_ROT_Y = -0.22;
    const DEFAULT_ZOOM = 3.8;

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

    // Casino Felt Grid Base
    const feltGeom = new THREE.PlaneGeometry(6.4, 6.4, 16, 16);
    const feltMat = new THREE.MeshBasicMaterial({
      color: 0x072814,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const feltMesh = new THREE.Mesh(feltGeom, feltMat);
    feltMesh.rotation.x = -Math.PI / 2;
    feltMesh.position.set(0, -0.65, 0);
    stageGroup.add(feltMesh);

    // Subtle Gold Floor Ring
    const floorRingGeom = new THREE.RingGeometry(2.1, 2.15, 64);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const floorRingMesh = new THREE.Mesh(floorRingGeom, floorRingMat);
    floorRingMesh.rotation.x = -Math.PI / 2;
    floorRingMesh.position.set(0, -0.64, 0);
    stageGroup.add(floorRingMesh);

    // =========================================================================
    // CASINO BETTING CHIPS (3D Procedural Stacks)
    // =========================================================================
    const chipsGroup = new THREE.Group();
    stageGroup.add(chipsGroup);

    const chipTexOrange = createChipTexture("#e65100", "#ffffff", "500");
    const chipTexGreen = createChipTexture("#00c853", "#ffffff", "1K");
    const chipTexGold = createChipTexture("#ffd700", "#111111", "5K");
    const chipTexBlack = createChipTexture("#212121", "#ff8c00", "10K");

    function createChipStack(x, z, count, textures) {
      const stack = new THREE.Group();
      stack.position.set(x, -0.62, z);

      for (let i = 0; i < count; i++) {
        const tex = textures[i % textures.length];
        const chipGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.055, 32);
        const materials = [
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 }), // side
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.2 }), // top
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.2 }), // bottom
        ];
        const chipMesh = new THREE.Mesh(chipGeom, materials);
        chipMesh.position.y = i * 0.058;
        // Slight natural rotation jitter
        chipMesh.rotation.y = (i * 0.45) + Math.random() * 0.1;
        stack.add(chipMesh);
      }
      return stack;
    }

    const stack1 = createChipStack(-2.25, 0.6, 5, [chipTexOrange, chipTexGold]);
    const stack2 = createChipStack(-1.95, 1.35, 4, [chipTexGreen, chipTexBlack]);
    const stack3 = createChipStack(2.25, 0.6, 6, [chipTexGold, chipTexGreen, chipTexOrange]);
    chipsGroup.add(stack1, stack2, stack3);

    // =========================================================================
    // 3D IVORY ROULETTE BALL
    // =========================================================================
    const ballGeom = new THREE.SphereGeometry(0.065, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xfffff5,
      roughness: 0.15,
      metalness: 0.05,
    });
    const ballMesh = new THREE.Mesh(ballGeom, ballMat);

    // Subtle Ball Glow Light
    const ballLight = new THREE.PointLight(0xffffff, 1.2, 0.8);
    ballMesh.add(ballLight);

    // =========================================================================
    // WINNING CELEBRATION PARTICLES (GOLD & EMERALD SPARKLES)
    // =========================================================================
    const particleCount = 60;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    const goldColor = new THREE.Color(0xffd700);
    const greenColor = new THREE.Color(0x00c853);
    const orangeColor = new THREE.Color(0xff8c00);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;

      const pickColor = i % 3 === 0 ? goldColor : i % 3 === 1 ? greenColor : orangeColor;
      particleColors[i * 3] = pickColor.r;
      particleColors[i * 3 + 1] = pickColor.g;
      particleColors[i * 3 + 2] = pickColor.b;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.16,
        y: Math.random() * 0.14 + 0.04,
        z: (Math.random() - 0.5) * 0.16,
        life: 0,
      });
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);

    // =========================================================================
    // MODEL & ROTOR GROUPS
    // =========================================================================
    const tableGroup = new THREE.Group();
    stageGroup.add(tableGroup);

    const rotorGroup = new THREE.Group();
    tableGroup.add(rotorGroup);

    let rotorAngle = 0;
    let rotorSpeed = 0.008; // Idle spin speed

    // Ball Animation State Variables
    let ballAngle = 0;
    let ballSpeed = 0;
    let ballRadius = 1.36;
    let ballHeight = -0.06;
    let ballSpinning = false;
    let spinStartTime = 0;
    let spinDuration = 3.6; // seconds
    let targetNumber = 7;
    let bouncePhase = 0;

    const startSpin = () => {
      if (ballSpinning) return;

      // Pick a winning number
      const randIdx = Math.floor(Math.random() * ROULETTE_ORDER.length);
      const chosenNum = ROULETTE_ORDER[randIdx];
      targetNumber = chosenNum;

      ballSpinning = true;
      setIsSpinning(true);
      spinStartTime = performance.now();
      ballAngle = Math.random() * Math.PI * 2;
      ballSpeed = 0.22; // Initial fast ball speed
      ballRadius = 1.76; // Upper track rim in local wheel space
      ballHeight = 0.19;
      rotorSpeed = -0.06; // Rotor spins opposite to ball
      bouncePhase = 0;

      // Reset celebration particles
      particleMat.opacity = 0;
      for (let i = 0; i < particleCount; i++) {
        particleVelocities[i].life = 0;
      }
    };

    replaySpinRef.current = startSpin;

    // Load 3D Roulette Table GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                mat.envMapIntensity = 1.2;
              });
            } else if (child.material) {
              child.material.side = THREE.DoubleSide;
              child.material.envMapIntensity = 1.2;
            }
          }
        });

        // Compute Bounding Box and Center
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.z);

        // Normalize Scale & Position
        const targetScale = (3.7 / (maxDim || 1)) * scaleMultiplier;
        root.scale.setScalar(targetScale);

        // Center on X and Z, place bowl nicely on the stage
        root.position.x = -center.x * targetScale;
        root.position.y = -center.y * targetScale - 0.15;
        root.position.z = -center.z * targetScale;

        // Separate rotating parts (Pockets, Frets, Gold Turret) into a dedicated wheel rotor
        let wheelRotor = new THREE.Group();
        wheelRotor.name = "WheelRotorGroup";
        let circleNode = root;

        root.traverse((child) => {
          if (child.name === "Circle_0") {
            circleNode = child;
            const spinningMeshes = [];
            child.children.forEach((meshChild) => {
              if (meshChild.name !== "Object_8") {
                spinningMeshes.push(meshChild);
              }
            });
            spinningMeshes.forEach((meshChild) => {
              wheelRotor.add(meshChild);
            });
            child.add(wheelRotor);
          }
        });

        // Attach ball and particles directly to circleNode so they reside in the exact wheel coordinate frame
        circleNode.add(ballMesh);
        circleNode.add(particleSystem);

        rotorGroupRef.current = wheelRotor;
        tableGroup.add(root);

        // Position ball at initial pocket spot
        const initialInfo = getNumberInfo(7);
        setCurrentResult(initialInfo);
        ballMesh.position.set(Math.cos(0.4) * 1.36, -0.06, Math.sin(0.4) * 1.36);

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading roulette 3D model:", err);
        setError(true);
        setLoading(false);
      }
    );

    // =========================================================================
    // INTERACTION CONTROLS (MOUSE & TOUCH DRAG + ZOOM)
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

      // Clamp X rotation so model doesn't flip upside down
      targetRotX = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotX));

      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    domElement.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width) || 480;
      const h = Math.round(rect.height) || 480;
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
      camera.lookAt(0, -0.1, 0);

      // Idle Floating Motion when not dragging
      if (!isDragging && !userInteracted) {
        idleFloatTime += dt;
        stageGroup.position.y = Math.sin(idleFloatTime * 1.4) * 0.03;
      }

      // -----------------------------------------------------------------------
      // ROULETTE WHEEL ROTOR ANIMATION
      // -----------------------------------------------------------------------
      if (ballSpinning) {
        // Active spin deceleration curve
        const elapsed = (currentTime - spinStartTime) / 1000;
        const progress = Math.min(elapsed / spinDuration, 1.0);

        // Ease-out deceleration
        const speedFactor = Math.pow(1 - progress, 2);
        rotorSpeed = -0.015 - 0.05 * speedFactor;
        rotorAngle += rotorSpeed;
        if (rotorGroupRef.current) {
          rotorGroupRef.current.rotation.y = rotorAngle;
        } else {
          rotorGroup.rotation.y = rotorAngle;
        }

        // Ball Motion (orbits in opposite direction)
        ballSpeed = 0.02 + 0.20 * Math.pow(1 - progress, 1.8);
        ballAngle += ballSpeed;

        // Ball track drop from upper rim (1.76) down to pocket frets (1.36)
        if (progress < 0.6) {
          ballRadius = 1.76;
          ballHeight = 0.19;
        } else if (progress < 0.85) {
          const dropProgress = (progress - 0.6) / 0.25;
          ballRadius = 1.76 - dropProgress * 0.4;
          ballHeight = 0.19 - dropProgress * 0.25;
        } else {
          // Bounce in pocket
          bouncePhase += dt * 18;
          const bounceDecay = 1 - (progress - 0.85) / 0.15;
          ballRadius = 1.36;
          ballHeight = -0.06 + Math.abs(Math.sin(bouncePhase)) * 0.04 * bounceDecay;
        }

        ballMesh.position.x = Math.cos(ballAngle) * ballRadius;
        ballMesh.position.z = Math.sin(ballAngle) * ballRadius;
        ballMesh.position.y = ballHeight;

        // Spin Complete
        if (progress >= 1.0) {
          ballSpinning = false;
          setIsSpinning(false);

          const resultInfo = getNumberInfo(targetNumber);
          setCurrentResult(resultInfo);
          setRecentResults((prev) => [resultInfo, ...prev.slice(0, 4)]);

          // Trigger Sparkle Particle Burst
          particleMat.opacity = 1;
          for (let i = 0; i < particleCount; i++) {
            const pos = particleGeom.attributes.position.array;
            pos[i * 3] = ballMesh.position.x;
            pos[i * 3 + 1] = ballMesh.position.y;
            pos[i * 3 + 2] = ballMesh.position.z;
            particleVelocities[i].life = 1.0;
          }
          particleGeom.attributes.position.needsUpdate = true;
        }
      } else {
        // Continuous smooth idle rotor spin
        rotorAngle += rotorSpeed;
        if (rotorGroupRef.current) {
          rotorGroupRef.current.rotation.y = rotorAngle;
        } else {
          rotorGroup.rotation.y = rotorAngle;
        }

        // Lock ball into rotating pocket
        if (!loading && !error) {
          const ballIdleAngle = ballAngle + rotorSpeed;
          ballAngle = ballIdleAngle;
          ballMesh.position.x = Math.cos(ballAngle) * 1.36;
          ballMesh.position.z = Math.sin(ballAngle) * 1.36;
          ballMesh.position.y = -0.06;
        }
      }

      // -----------------------------------------------------------------------
      // CELEBRATION PARTICLES UPDATE
      // -----------------------------------------------------------------------
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
        particleMat.opacity = Math.max(0, particleMat.opacity - dt * 0.7);
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

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      // Dispose Three.js objects
      renderer.dispose();
      scene.clear();
      feltGeom.dispose();
      feltMat.dispose();
      floorRingGeom.dispose();
      floorRingMat.dispose();
      ballGeom.dispose();
      ballMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      chipTexOrange.dispose();
      chipTexGreen.dispose();
      chipTexGold.dispose();
      chipTexBlack.dispose();
    };
  }, [modelPath, interactive, scaleMultiplier]);

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
          cursor: isSpinning ? "wait" : "grab",
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
              color: "var(--fg-4, rgba(255,255,255,0.6))",
            }}
          >
            Loading 3D Casino Floor...
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
          3D casino preview unavailable
        </div>
      )}

      {/* Interactive Controls & Live Outcome HUD */}
      {!loading && !error && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 5,
            width: "95%",
            maxWidth: "460px",
          }}
        >
          {/* Main Action Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
          >
            {/* Winning Number / Status Badge */}
            <div
              style={{
                padding: "6px 14px",
                background: "rgba(13, 16, 17, 0.88)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                backdropFilter: "blur(12px)",
                borderRadius: "999px",
                fontSize: "0.75rem",
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
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background:
                    currentResult.color === "green"
                      ? "var(--g-400, #00c853)"
                      : currentResult.color === "red"
                      ? "#e53935"
                      : "#424242",
                  boxShadow:
                    currentResult.color === "green"
                      ? "0 0 10px #00c853"
                      : currentResult.color === "red"
                      ? "0 0 10px #e53935"
                      : "0 0 8px #ffffff",
                  transition: "all 0.3s ease",
                }}
              />
              <span style={{ fontWeight: "600" }}>
                {isSpinning ? "🎲 Rolling Wheel..." : currentResult.label}
              </span>
              <span style={{ opacity: 0.5, fontSize: "0.68rem" }}>· Drag 3D</span>
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

            {/* Spin Wheel Button */}
            <button
              type="button"
              disabled={isSpinning}
              onClick={() => replaySpinRef.current && replaySpinRef.current()}
              style={{
                padding: "6px 14px",
                background: isSpinning
                  ? "rgba(255,140,0,0.2)"
                  : "linear-gradient(135deg, rgba(255,140,0,0.35), rgba(255,215,0,0.35))",
                border: "1px solid rgba(255, 140, 0, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "999px",
                fontSize: "0.74rem",
                fontWeight: "600",
                color: isSpinning ? "rgba(255,255,255,0.5)" : "var(--fg, #ffffff)",
                cursor: isSpinning ? "not-allowed" : "pointer",
                letterSpacing: "0.03em",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
                boxShadow: isSpinning ? "none" : "0 0 14px rgba(255,140,0,0.25)",
              }}
              onMouseEnter={(e) => {
                if (!isSpinning) {
                  e.currentTarget.style.borderColor = "var(--o-400, #ff8c00)";
                  e.currentTarget.style.transform = "scale(1.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSpinning) {
                  e.currentTarget.style.borderColor = "rgba(255, 140, 0, 0.6)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <span>Spin Wheel</span>
              <span>🎲</span>
            </button>
          </div>

          {/* Recent Numbers History Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.68rem",
              color: "var(--fg-4, rgba(255,255,255,0.5))",
            }}
          >
            <span>History:</span>
            {recentResults.map((res, i) => (
              <span
                key={`${res.num}-${i}`}
                style={{
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "0.68rem",
                  background:
                    res.color === "green"
                      ? "rgba(0,200,83,0.2)"
                      : res.color === "red"
                      ? "rgba(229,57,53,0.25)"
                      : "rgba(255,255,255,0.08)",
                  border: `1px solid ${
                    res.color === "green"
                      ? "rgba(0,200,83,0.5)"
                      : res.color === "red"
                      ? "rgba(229,57,53,0.5)"
                      : "rgba(255,255,255,0.2)"
                  }`,
                  color:
                    res.color === "green"
                      ? "#00e676"
                      : res.color === "red"
                      ? "#ff5252"
                      : "#e0e0e0",
                }}
              >
                {res.num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
