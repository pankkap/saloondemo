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

// Fixed deterministic motes
const MOTE_COUNT = 30;
const MOTE_POSITIONS = new Float32Array(MOTE_COUNT * 3);
for (let i = 0; i < MOTE_COUNT; i++) {
  MOTE_POSITIONS[i * 3] = ((i * 13) % 40 - 20) * 0.08;
  MOTE_POSITIONS[i * 3 + 1] = ((i * 19) % 50 - 25) * 0.08;
  MOTE_POSITIONS[i * 3 + 2] = ((i * 29) % 30 - 15) * 0.08;
}

interface ShearsAndHair3DProps {
  mode?: "shears" | "ribbon";
}

export default function ShearsAndHair3D({ mode = "shears" }: ShearsAndHair3DProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const upperBladeRef = useRef<THREE.Group>(null);
  const lowerBladeRef = useRef<THREE.Group>(null);
  const hairGroupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // 1. Procedural Scissor Blade Geometry (Sharp, tapered, hollow-ground beveled cutting blade)
  const bladeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    // Outer blade spine
    shape.quadraticCurveTo(0.06, 0.9, 0.015, 1.8);
    // Tip
    shape.lineTo(-0.015, 1.8);
    // Beveled cutting edge
    shape.quadraticCurveTo(-0.045, 0.9, -0.05, 0);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
  }, []);

  // 2. Procedural Scissor Handles & Shanks
  const upperShankGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.06, -0.4, 0.12, -0.85);
    shape.lineTo(0.18, -0.85);
    shape.quadraticCurveTo(0.1, -0.4, 0.04, 0);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.024,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
  }, []);

  const lowerShankGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(-0.06, -0.4, -0.12, -0.85);
    shape.lineTo(-0.18, -0.85);
    shape.quadraticCurveTo(-0.1, -0.4, -0.04, 0);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.024,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
  }, []);

  // 3. Flowing Hair Ribbons (Fine, silky bezier spline curves around the shears)
  const hairRibbonGeometries = useMemo(() => {
    // Strand 1: Golden honey flowing wave
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, -1.2, -0.3),
      new THREE.Vector3(-0.7, -0.4, 0.2),
      new THREE.Vector3(0.1, 0.3, 0.35),
      new THREE.Vector3(0.8, 1.1, 0.1),
      new THREE.Vector3(1.3, 1.8, -0.2),
    ]);

    // Strand 2: Terracotta bronze ribbon
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.2, -1.4, 0.2),
      new THREE.Vector3(0.5, -0.6, -0.2),
      new THREE.Vector3(-0.3, 0.2, 0.25),
      new THREE.Vector3(-0.8, 1.0, -0.1),
      new THREE.Vector3(-1.1, 1.7, 0.15),
    ]);

    // Strand 3: Delicate fine highlight strand
    const curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, -1.5, 0.1),
      new THREE.Vector3(0.6, -0.2, -0.15),
      new THREE.Vector3(0.2, 0.8, 0.3),
      new THREE.Vector3(-0.3, 1.5, -0.1),
    ]);

    return [
      new THREE.TubeGeometry(curve1, 80, 0.022, 12, false),
      new THREE.TubeGeometry(curve2, 80, 0.02, 12, false),
      new THREE.TubeGeometry(curve3, 64, 0.015, 12, false),
    ];
  }, []);

  // Dedicated pure ribbon sculpture geometry for "ribbon" mode
  const pureRibbonGeometry = useMemo(() => {
    // Elegant Mobius-like flowing hair wave
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, -0.8, 0),
      new THREE.Vector3(-0.5, 0.8, 0.5),
      new THREE.Vector3(0.6, 1.1, -0.2),
      new THREE.Vector3(1.2, 0.2, 0.4),
      new THREE.Vector3(0.4, -1.0, -0.3),
      new THREE.Vector3(-0.6, -0.4, 0.3),
      new THREE.Vector3(-1.2, -0.8, 0),
    ]);
    return new THREE.TubeGeometry(curve, 100, 0.045, 16, true);
  }, []);

  useFrame((state) => {
    if (!rootGroupRef.current) return;

    if (prefersReducedMotion) {
      rootGroupRef.current.rotation.y = 0.2;
      rootGroupRef.current.rotation.x = -0.1;
      return;
    }

    const t = state.clock.getElapsedTime();

    // Responsive parallax with gentle inertia
    const targetRotY = pointer.x * 0.45 + Math.sin(t * 0.3) * 0.12;
    const targetRotX = -pointer.y * 0.35 - 0.15 + Math.cos(t * 0.4) * 0.08;
    const targetPosY = Math.sin(t * 0.8) * 0.06;

    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      targetRotY,
      0.05
    );
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      targetRotX,
      0.05
    );
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(
      rootGroupRef.current.position.y,
      targetPosY,
      0.05
    );

    // Subtle hypnotic scissor scissor breathing (open & close 6° - 14°)
    if (upperBladeRef.current && lowerBladeRef.current) {
      const scissorAngle = Math.sin(t * 1.6) * 0.06 + 0.14;
      upperBladeRef.current.rotation.z = scissorAngle;
      lowerBladeRef.current.rotation.z = -scissorAngle;
    }

    // Hair strands organic wave breathing
    if (hairGroupRef.current) {
      hairGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.08;
      hairGroupRef.current.position.z = Math.cos(t * 0.6) * 0.05;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {mode === "shears" ? (
        <>
          {/* ============ SALON ARTISAN SHEARS ============ */}
          <group position={[0, -0.1, 0]}>
            {/* UPPER BLADE & FINGER RING ASSEMBLY */}
            <group ref={upperBladeRef} position={[0, 0, 0.02]}>
              {/* Blade */}
              <mesh geometry={bladeGeometry} castShadow receiveShadow>
                <meshPhysicalMaterial
                  color="#F5F2EC"
                  emissive="#1E1916"
                  emissiveIntensity={0.05}
                  roughness={0.12}
                  metalness={0.96}
                  clearcoat={0.9}
                  clearcoatRoughness={0.08}
                  reflectivity={0.98}
                />
              </mesh>

              {/* Shank */}
              <mesh geometry={upperShankGeometry} castShadow receiveShadow>
                <meshPhysicalMaterial
                  color="#EBE5DC"
                  roughness={0.18}
                  metalness={0.92}
                  clearcoat={0.7}
                />
              </mesh>

              {/* Upper Finger Ring */}
              <group position={[0.24, -1.05, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.2, 0.032, 16, 48]} />
                  <meshPhysicalMaterial
                    color="#EBE5DC"
                    roughness={0.18}
                    metalness={0.92}
                    clearcoat={0.7}
                  />
                </mesh>

                {/* Finger Rest Tang */}
                <mesh
                  position={[0.2, -0.18, 0]}
                  rotation={[0, 0, -Math.PI / 3]}
                >
                  <coneGeometry args={[0.035, 0.32, 16]} />
                  <meshPhysicalMaterial
                    color="#D4AF37"
                    roughness={0.2}
                    metalness={0.9}
                    clearcoat={0.6}
                  />
                </mesh>
              </group>
            </group>

            {/* LOWER BLADE & THUMB RING ASSEMBLY */}
            <group ref={lowerBladeRef} position={[0, 0, -0.02]}>
              {/* Blade */}
              <mesh
                geometry={bladeGeometry}
                rotation={[0, Math.PI, 0]}
                castShadow
                receiveShadow
              >
                <meshPhysicalMaterial
                  color="#F5F2EC"
                  emissive="#1E1916"
                  emissiveIntensity={0.05}
                  roughness={0.12}
                  metalness={0.96}
                  clearcoat={0.9}
                  clearcoatRoughness={0.08}
                  reflectivity={0.98}
                />
              </mesh>

              {/* Shank */}
              <mesh geometry={lowerShankGeometry} castShadow receiveShadow>
                <meshPhysicalMaterial
                  color="#EBE5DC"
                  roughness={0.18}
                  metalness={0.92}
                  clearcoat={0.7}
                />
              </mesh>

              {/* Thumb Ring */}
              <group position={[-0.24, -1.05, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.2, 0.032, 16, 48]} />
                  <meshPhysicalMaterial
                    color="#EBE5DC"
                    roughness={0.18}
                    metalness={0.92}
                    clearcoat={0.7}
                  />
                </mesh>
              </group>
            </group>

            {/* PIVOT DIAL (Champagne Gold Adjustment Dial) */}
            <group position={[0, 0, 0.025]}>
              {/* Outer dial ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.07, 32]} />
                <meshPhysicalMaterial
                  color="#D4AF37"
                  emissive="#3A2800"
                  emissiveIntensity={0.15}
                  roughness={0.18}
                  metalness={0.94}
                  clearcoat={0.8}
                />
              </mesh>
              {/* Center screw jewel */}
              <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
                <meshPhysicalMaterial
                  color="#B96E50"
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
            </group>

            {/* Bumper Silencer Stop */}
            <mesh position={[0, -0.95, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#211B18" roughness={0.8} />
            </mesh>
          </group>

          {/* ============ FLOWING SILK HAIR RIBBONS ============ */}
          <group ref={hairGroupRef}>
            {/* Strand 1: Luminous Honey Blonde / Champagne Silk */}
            <mesh geometry={hairRibbonGeometries[0]} castShadow>
              <meshPhysicalMaterial
                color="#E5CA98"
                emissive="#3D2B12"
                emissiveIntensity={0.12}
                roughness={0.25}
                metalness={0.65}
                clearcoat={0.7}
                clearcoatRoughness={0.2}
              />
            </mesh>

            {/* Strand 2: Rich Terracotta / Auburn Strand */}
            <mesh geometry={hairRibbonGeometries[1]}>
              <meshPhysicalMaterial
                color="#B96E50"
                emissive="#2A150D"
                emissiveIntensity={0.15}
                roughness={0.3}
                metalness={0.6}
                clearcoat={0.5}
              />
            </mesh>

            {/* Strand 3: Luminous Platinum Highlight Strand */}
            <mesh geometry={hairRibbonGeometries[2]}>
              <meshPhysicalMaterial
                color="#F5F1E8"
                roughness={0.2}
                metalness={0.75}
                clearcoat={0.9}
              />
            </mesh>
          </group>
        </>
      ) : (
        /* PURE FLOWING HAIR WAVE MODE */
        <group ref={hairGroupRef}>
          <mesh geometry={pureRibbonGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#D6B892"
              emissive="#2E2014"
              emissiveIntensity={0.1}
              roughness={0.22}
              metalness={0.75}
              clearcoat={0.85}
              clearcoatRoughness={0.12}
              reflectivity={0.9}
            />
          </mesh>
          <mesh geometry={hairRibbonGeometries[0]}>
            <meshPhysicalMaterial
              color="#B96E50"
              roughness={0.3}
              metalness={0.65}
              clearcoat={0.6}
            />
          </mesh>
        </group>
      )}

      {/* Floating Gold Motes (Micro-glints in the light) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[MOTE_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#D4AF37"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
