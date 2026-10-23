"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Deterministic particle generation outside component for React 19 purity compliance
const PARTICLE_COUNT = 45;
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Deterministic spread using trigonometric distribution
  PARTICLE_POSITIONS[i * 3] = ((i * 17) % 60 - 30) * 0.1;
  PARTICLE_POSITIONS[i * 3 + 1] = ((i * 23) % 50 - 25) * 0.1;
  PARTICLE_POSITIONS[i * 3 + 2] = ((i * 31) % 40 - 20) * 0.1;
}

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

export default function Sculpture3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    if (prefersReducedMotion) {
      meshRef.current.rotation.y = 0.5;
      meshRef.current.rotation.x = 0.2;
      return;
    }

    const t = state.clock.getElapsedTime();

    // Gentle organic floating & undulating movement inspired by silk strands and hair flow
    const targetRotX = Math.sin(t * 0.35) * 0.25 + pointer.y * 0.25;
    const targetRotY = t * 0.2 + pointer.x * 0.45;
    const targetPosY = Math.sin(t * 0.8) * 0.12;

    // Smooth damping (lerp)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotX,
      0.04
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotY,
      0.04
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetPosY,
      0.05
    );

    // Subtle drift for particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Abstract sculptural hair / ribbon form */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.2, 0.36, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#E6DDD2"
          emissive="#2A221E"
          emissiveIntensity={0.08}
          roughness={0.25}
          metalness={0.85}
          clearcoat={0.65}
          clearcoatRoughness={0.15}
          reflectivity={0.9}
        />
      </mesh>

      {/* Floating subtle ambient motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[PARTICLE_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#C5A880"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
