"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox, Sphere, Environment, PresentationControls, ContactShadows } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingGeometries() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Central Glowing 3D Trophy Gem */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0, 0.2, 0]} rotation={[0.4, 0.5, 0]}>
          <octahedronGeometry args={[1.1, 0]} />
          <MeshDistortMaterial
            color="#1cb0f6"
            roughness={0.1}
            metalness={0.8}
            distort={0.25}
            speed={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      {/* Floating 3D Subject Ring (Duolingo Blue / Purple Glow) */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[-1.8, 1.1, -0.5]} rotation={[1.2, 0.2, 0]}>
          <torusGeometry args={[0.55, 0.18, 16, 32]} />
          <meshStandardMaterial
            color="#af52de"
            roughness={0.15}
            metalness={0.9}
            emissive="#af52de"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Floating 3D Target Cube (Emerald Green / Coğrafya) */}
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.1}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.15} smoothness={4} position={[1.8, -0.6, -0.2]} rotation={[0.5, 0.8, 0.2]}>
          <meshStandardMaterial
            color="#10B981"
            roughness={0.2}
            metalness={0.8}
            emissive="#10B981"
            emissiveIntensity={0.25}
          />
        </RoundedBox>
      </Float>

      {/* Floating Coral Pink Sphere (Türkçe) */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1.8}>
        <Sphere args={[0.45, 32, 32]} position={[-1.6, -1.1, 0.3]}>
          <meshStandardMaterial
            color="#F43F5E"
            roughness={0.1}
            metalness={0.85}
            emissive="#F43F5E"
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      {/* Floating Orange Diamond (Tarih) */}
      <Float speed={2.2} rotationIntensity={1} floatIntensity={1.3}>
        <mesh position={[1.5, 1.2, -0.6]} rotation={[0.8, 0.4, 0.6]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#ff9500"
            roughness={0.15}
            metalness={0.85}
            emissive="#ff9500"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-[360px] sm:h-[420px] relative rounded-[2.5rem] overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#1cb0f6" />
        <pointLight position={[0, 2, 2]} intensity={2} color="#58cc02" />

        <PresentationControls
          global
          speed={1.5}
          snap={true}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <FloatingGeometries />
        </PresentationControls>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.4}
          scale={7}
          blur={2.5}
          far={4}
          color="#0f172a"
        />
        <Environment preset="city" />
      </Canvas>

      {/* 3D Interaction Hint Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm text-[11px] font-black text-slate-600 dark:text-slate-300 flex items-center gap-2 pointer-events-none select-none">
        <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-pulse" />
        <span>3D Sahneyi Çevirmek İçin Sürükleyin 🖱️</span>
      </div>
    </div>
  );
}
