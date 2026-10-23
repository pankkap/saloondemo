"use client";

import React, { useRef, useMemo, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Generate canvas texture for luxury bottle label
function createBottleLabelTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Warm ivory paper background
  ctx.fillStyle = "#F5F1E8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border line
  ctx.strokeStyle = "#C8BCAF";
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.strokeStyle = "#B96E50";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

  // Typography
  ctx.fillStyle = "#777B62";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  ctx.fillText("EST. NOIDA", canvas.width / 2, 90);

  ctx.fillStyle = "#211B18";
  ctx.font = "bold 44px serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("MAISON", canvas.width / 2, 170);

  ctx.fillStyle = "#777B62";
  ctx.font = "16px sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("HAIR ATELIER", canvas.width / 2, 210);

  // Divider
  ctx.strokeStyle = "#B96E50";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 50, 240);
  ctx.lineTo(canvas.width / 2 + 50, 240);
  ctx.stroke();

  ctx.fillStyle = "#211B18";
  ctx.font = "italic 26px serif";
  ctx.fillText("No. 01 Botanical Elixir", canvas.width / 2, 290);

  ctx.fillStyle = "#777B62";
  ctx.font = "14px sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("ROSEMARY · CAMELLIA · SQUALANE", canvas.width / 2, 340);

  ctx.fillStyle = "#B96E50";
  ctx.font = "bold 16px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("RESTORE & SHINE", canvas.width / 2, 410);

  ctx.fillStyle = "#777B62";
  ctx.font = "13px sans-serif";
  ctx.fillText("50ml e / 1.7 fl. oz.", canvas.width / 2, 455);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Fixed deterministic motes
const MOTE_COUNT = 32;
const MOTE_POSITIONS = new Float32Array(MOTE_COUNT * 3);
for (let i = 0; i < MOTE_COUNT; i++) {
  MOTE_POSITIONS[i * 3] = ((i * 17) % 50 - 25) * 0.08;
  MOTE_POSITIONS[i * 3 + 1] = ((i * 23) % 60 - 30) * 0.08;
  MOTE_POSITIONS[i * 3 + 2] = ((i * 31) % 40 - 20) * 0.08;
}

interface AtelierArtifact3DProps {
  mode?: "elixir" | "wave" | "shears";
}

export default function AtelierArtifact3D({ mode = "elixir" }: AtelierArtifact3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Group>(null);
  const ribbonsRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const labelTexture = useMemo(() => createBottleLabelTexture(), []);

  // Lathe geometry for seamless apothecary bottle with curved shoulders
  const bottleGlassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Base center
    points.push(new THREE.Vector2(0, -1.0));
    points.push(new THREE.Vector2(0.55, -1.0));
    // Straight body
    points.push(new THREE.Vector2(0.55, 0.4));
    // Curved shoulder
    points.push(new THREE.Vector2(0.52, 0.6));
    points.push(new THREE.Vector2(0.42, 0.75));
    points.push(new THREE.Vector2(0.24, 0.9));
    // Neck
    points.push(new THREE.Vector2(0.24, 1.25));
    points.push(new THREE.Vector2(0.27, 1.28)); // lip
    points.push(new THREE.Vector2(0.2, 1.28)); // inner lip
    points.push(new THREE.Vector2(0.2, 0.9)); // inner neck
    points.push(new THREE.Vector2(0.46, 0.4)); // inner shoulder
    points.push(new THREE.Vector2(0.48, -0.92)); // inner body
    points.push(new THREE.Vector2(0, -0.92)); // inner base

    return new THREE.LatheGeometry(points, 48);
  }, []);

  // Liquid core inside the bottle
  const liquidGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, -0.9));
    points.push(new THREE.Vector2(0.47, -0.9));
    points.push(new THREE.Vector2(0.47, 0.35));
    points.push(new THREE.Vector2(0.43, 0.55));
    points.push(new THREE.Vector2(0.35, 0.68));
    points.push(new THREE.Vector2(0, 0.68)); // meniscus surface
    return new THREE.LatheGeometry(points, 36);
  }, []);

  // Curved Label geometry (wrapped on front face)
  const labelGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.558, 0.558, 0.95, 36, 1, true, -Math.PI * 0.42, Math.PI * 0.84);
  }, []);

  // Flowing silk hair wave ribbons
  const silkCurves = useMemo(() => {
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, -1.2, -0.2),
      new THREE.Vector3(-0.6, -0.3, 0.4),
      new THREE.Vector3(0.3, 0.4, 0.5),
      new THREE.Vector3(0.9, 1.2, 0.1),
      new THREE.Vector3(1.4, 1.8, -0.3),
    ]);

    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, -1.3, 0.3),
      new THREE.Vector3(0.5, -0.4, -0.3),
      new THREE.Vector3(-0.4, 0.3, 0.3),
      new THREE.Vector3(-0.9, 1.1, -0.2),
      new THREE.Vector3(-1.2, 1.7, 0.2),
    ]);

    return [
      new THREE.TubeGeometry(curve1, 80, 0.024, 12, false),
      new THREE.TubeGeometry(curve2, 80, 0.018, 12, false),
    ];
  }, []);

  // Fluid pure silk wave loop for 'wave' mode
  const pureWaveGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, -0.6, 0.1),
      new THREE.Vector3(-0.4, 0.7, 0.4),
      new THREE.Vector3(0.6, 1.0, -0.3),
      new THREE.Vector3(1.1, 0.2, 0.3),
      new THREE.Vector3(0.4, -0.9, -0.2),
      new THREE.Vector3(-0.5, -0.5, 0.2),
      new THREE.Vector3(-1.1, -0.6, 0.1),
    ]);
    return new THREE.TubeGeometry(curve, 100, 0.05, 16, true);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      groupRef.current.rotation.y = 0.3;
      groupRef.current.rotation.x = 0.1;
      return;
    }

    const t = state.clock.getElapsedTime();

    // Responsive, silky smooth mouse parallax
    const targetRotY = pointer.x * 0.5 + Math.sin(t * 0.3) * 0.15;
    const targetRotX = -pointer.y * 0.4 + Math.cos(t * 0.4) * 0.08;
    const targetPosY = Math.sin(t * 0.8) * 0.05;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      0.05
    );

    // Subtle breathing for silk ribbons
    if (ribbonsRef.current) {
      ribbonsRef.current.rotation.y = t * 0.15;
    }

    // Gentle rotation for bottle in elixir mode
    if (bottleRef.current) {
      bottleRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {mode === "elixir" ? (
        /* ============ BOTANICAL HAIR ELIXIR ARTIFACT ============ */
        <group ref={bottleRef} position={[0, -0.15, 0]} scale={[1.15, 1.15, 1.15]}>
          {/* 1. Amber Glass Apothecary Bottle */}
          <mesh geometry={bottleGlassGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#3B1C0B"
              emissive="#1E0C04"
              emissiveIntensity={0.2}
              roughness={0.06}
              metalness={0.15}
              transmission={0.82}
              ior={1.54}
              thickness={0.8}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              reflectivity={0.9}
            />
          </mesh>

          {/* 2. Golden Honey Liquid Core */}
          <mesh geometry={liquidGeometry}>
            <meshPhysicalMaterial
              color="#DDA032"
              emissive="#523103"
              emissiveIntensity={0.35}
              roughness={0.12}
              metalness={0.1}
              transmission={0.65}
              ior={1.38}
            />
          </mesh>

          {/* 3. Paper Label Wrap */}
          {labelTexture && (
            <mesh geometry={labelGeometry} position={[0, -0.28, 0]}>
              <meshStandardMaterial
                map={labelTexture}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>
          )}

          {/* 4. Brushed Champagne Gold Dropper Collar */}
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.32, 36]} />
            <meshPhysicalMaterial
              color="#CBB18B"
              emissive="#382914"
              emissiveIntensity={0.15}
              roughness={0.22}
              metalness={0.94}
              clearcoat={0.7}
              clearcoatRoughness={0.15}
            />
          </mesh>

          {/* 5. Matte Obsidian Dropper Squeeze Bulb */}
          <mesh position={[0, 1.62, 0]} castShadow scale={[1, 1.25, 1]}>
            <sphereGeometry args={[0.22, 32, 24]} />
            <meshStandardMaterial
              color="#15110F"
              roughness={0.75}
              metalness={0.1}
            />
          </mesh>

          {/* 6. Gold Dropper Collar Accent Ring */}
          <mesh position={[0, 1.2, 0]}>
            <torusGeometry args={[0.26, 0.02, 16, 36]} />
            <meshPhysicalMaterial
              color="#B96E50"
              roughness={0.25}
              metalness={0.9}
            />
          </mesh>

          {/* 7. Suspended Golden Hair Elixir Droplet */}
          <mesh position={[0, -1.35, 0]} scale={[1, 1.4, 1]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshPhysicalMaterial
              color="#F0B542"
              emissive="#4A2F02"
              emissiveIntensity={0.4}
              roughness={0.05}
              metalness={0.1}
              transmission={0.85}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      ) : (
        /* ============ PURE SILK HAIR WAVE MODE ============ */
        <group>
          <mesh geometry={pureWaveGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#D6B892"
              emissive="#302114"
              emissiveIntensity={0.15}
              roughness={0.2}
              metalness={0.82}
              clearcoat={0.9}
              clearcoatRoughness={0.1}
              reflectivity={0.95}
            />
          </mesh>
          <mesh geometry={silkCurves[0]}>
            <meshPhysicalMaterial
              color="#B96E50"
              emissive="#2A1208"
              emissiveIntensity={0.2}
              roughness={0.28}
              metalness={0.7}
              clearcoat={0.6}
            />
          </mesh>
        </group>
      )}

      {/* Surrounding Silk Hair Ribbons */}
      <group ref={ribbonsRef}>
        <mesh geometry={silkCurves[0]}>
          <meshPhysicalMaterial
            color="#E4C897"
            emissive="#38250A"
            emissiveIntensity={0.15}
            roughness={0.25}
            metalness={0.75}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>
        <mesh geometry={silkCurves[1]}>
          <meshPhysicalMaterial
            color="#B96E50"
            roughness={0.3}
            metalness={0.65}
            clearcoat={0.6}
          />
        </mesh>
      </group>

      {/* Floating Golden Micro-Motes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[MOTE_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color="#D4AF37"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
