import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={2.2}>
        <torusKnotGeometry args={[1, 0.35, 128, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#D97B66"
          roughness={0.3}
          metalness={0.6}
          distort={0.2}
          speed={2}
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.4} position={[3, -1.5, -2]}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#60A5FA"
          roughness={0.4}
          metalness={0.5}
          distort={0.3}
          speed={3}
          transparent
          opacity={0.18}
          wireframe
        />
      </mesh>
    </Float>
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
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#FADBD8" />
          <AnimatedTorus />
          <AnimatedSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
