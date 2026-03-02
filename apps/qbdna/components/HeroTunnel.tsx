"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

/* ── Tunnel Rings ─────────────── */
function TunnelRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      z: -i * 3,
      scale: 1 + i * 0.15,
      opacity: 1 - i * 0.04,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]}>
          <torusGeometry args={[ring.scale * 2.5, 0.02, 8, 64]} />
          <meshBasicMaterial
            color="#00C2FF"
            transparent
            opacity={ring.opacity * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Light Beams ──────────────── */
function LightBeams() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map(
        (angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 4, Math.sin(angle) * 4, -10]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.03, 30]} />
            <meshBasicMaterial
              color="#00C2FF"
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      )}
    </group>
  );
}

/* ── Floating Particles ───────── */
function Particles() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00C2FF"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Main HeroTunnel ──────────── */
export default function HeroTunnel() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#0A0A0A" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <pointLight position={[0, 0, -20]} color="#00C2FF" intensity={2} distance={60} />
          <pointLight position={[5, 5, 5]} color="#FFFFFF" intensity={0.3} />

          <Stars
            radius={80}
            depth={60}
            count={3000}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />

          <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <TunnelRings />
          </Float>

          <LightBeams />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
