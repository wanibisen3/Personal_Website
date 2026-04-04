import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.12;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={0.9} position={[-3.5, 1.5, -1]}>
        <torusKnotGeometry args={[0.8, 0.25, 100, 24, 2, 3]} />
        <MeshDistortMaterial
          color="#D97B66"
          roughness={0.35}
          metalness={0.5}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  );
}

function AnimatedRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.3) * 0.15;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={0.7} position={[4, -0.5, -2]}>
        <torusGeometry args={[1, 0.08, 24, 48]} />
        <meshStandardMaterial
          color="#60A5FA"
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function FloatingDots() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const dots = Array.from({ length: 12 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 2,
    ] as [number, number, number],
    scale: Math.random() * 0.06 + 0.03,
  }));

  return (
    <group ref={groupRef}>
      {dots.map((dot, i) => (
        <Float key={i} speed={1 + Math.random()} floatIntensity={0.3}>
          <mesh position={dot.position} scale={dot.scale}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#D97B66" : "#60A5FA"}
              transparent
              opacity={0.2}
              roughness={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function FloatingGeometry() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[-5, -5, -5]} intensity={0.2} color="#FADBD8" />
          <AnimatedTorus />
          <AnimatedRing />
          <FloatingDots />
        </Suspense>
      </Canvas>
    </div>
  );
}
