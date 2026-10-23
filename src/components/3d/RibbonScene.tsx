"use client";

import React, { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import AtelierArtifact3D from "./AtelierArtifact3D";
import Fallback3D from "./Fallback3D";

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Fallback3D />;
    }
    return this.props.children;
  }
}

function subscribeClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

interface RibbonSceneProps {
  mode?: "elixir" | "wave" | "shears";
}

export default function RibbonScene({ mode = "elixir" }: RibbonSceneProps) {
  const isClient = useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getServerSnapshot
  );

  if (!isClient) {
    return <Fallback3D />;
  }

  return (
    <div className="w-full h-full min-h-[360px] sm:min-h-[440px] relative">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          {/* Studio Lighting Setup for Luxury Glass & Metals */}
          <ambientLight intensity={0.8} color="#F5F1E8" />

          {/* Warm Key Light */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={2.8}
            color="#FFF7EE"
            castShadow
          />

          {/* Fill Light for Label & Silhouette */}
          <directionalLight
            position={[-4, -1, 3]}
            intensity={1.2}
            color="#D8CEC2"
          />

          {/* Backlight for Amber Glass Transmission & Rim Glow */}
          <spotLight
            position={[0, 4, -4]}
            intensity={3.8}
            angle={0.65}
            penumbra={0.8}
            color="#FFD685"
          />

          {/* Warm Terracotta Accent Rim Light */}
          <pointLight
            position={[-3, -2, 2]}
            intensity={1.6}
            color="#B96E50"
          />

          <Suspense fallback={null}>
            <AtelierArtifact3D mode={mode} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
