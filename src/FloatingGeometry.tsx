import { useRef, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Full-viewport flowing 3D wave that ripples under the pointer      */
/* ------------------------------------------------------------------ */

const GRID = 120;
const SEG  = GRID - 1;
const SPREAD = 40;

// Shared mouse state for both wave and orbs
const globalMouse = new THREE.Vector3(0, 0, 0);

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerMove = useCallback((e: any) => {
    if (e.point) globalMouse.set(e.point.x, e.point.y, e.point.z);
  }, []);

  const basePositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SPREAD, SPREAD, SEG, SEG);
    return Float32Array.from(geo.attributes.position.array);
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    const t = clock.getElapsedTime();

    for (let i = 0; i < pos.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];

      let z = 0;
      z += Math.sin(bx * 0.3 + t * 0.28) * 0.35;
      z += Math.sin(by * 0.4 + t * 0.22) * 0.28;
      z += Math.cos((bx + by) * 0.22 + t * 0.3) * 0.22;
      z += Math.sin(bx * 0.6 - t * 0.35) * 0.12;
      z += Math.cos(by * 0.5 + t * 0.18) * 0.14;

      // Mouse ripple
      const dx = bx - globalMouse.x;
      const dy = by - globalMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ripple = Math.sin(dist * 1.2 - t * 2.2) * Math.exp(-dist * 0.14) * 0.55;
      z += ripple;

      pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.2, 0, 0]}
      position={[0, -3, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[SPREAD, SPREAD, SEG, SEG]} />
      <meshPhysicalMaterial
        color="#f2c4b5"
        roughness={0.55}
        metalness={0.08}
        transmission={0.06}
        thickness={0.4}
        transparent
        opacity={0.38}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Mouse-reactive floating orbs that scatter away from cursor        */
/* ------------------------------------------------------------------ */

function FloatingOrbs({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      base: new THREE.Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 10 + 2,
        (Math.random() - 0.5) * 10
      ),
      current: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      speed: Math.random() * 0.2 + 0.08,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.1 + 0.03,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Natural drift position
      const driftX = p.base.x + Math.sin(t * p.speed + p.offset) * 0.8;
      const driftY = p.base.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.5;
      const driftZ = p.base.z + Math.sin(t * p.speed * 0.4 + p.offset * 2) * 0.4;

      // Mouse repulsion — orbs scatter away from cursor
      const dx = driftX - globalMouse.x;
      const dy = driftY - globalMouse.y;
      const dz = driftZ - (globalMouse.z || 0);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const repelRadius = 4;
      const repelStrength = 2.5;

      if (dist < repelRadius && dist > 0.01) {
        const force = (1 - dist / repelRadius) * repelStrength;
        p.velocity.x += (dx / dist) * force * 0.08;
        p.velocity.y += (dy / dist) * force * 0.08;
        p.velocity.z += (dz / dist) * force * 0.05;
      }

      // Apply velocity with damping (spring back)
      p.velocity.multiplyScalar(0.92);
      p.current.set(
        driftX + p.velocity.x,
        driftY + p.velocity.y,
        driftZ + p.velocity.z
      );

      dummy.position.copy(p.current);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshPhysicalMaterial
        color="#edb5a6"
        roughness={0.2}
        metalness={0.1}
        transmission={0.45}
        thickness={0.3}
        transparent
        opacity={0.25}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                       */
/* ------------------------------------------------------------------ */

export default function FloatingGeometry() {
  return (
    <div
      className="fixed inset-0 z-[1]"
      aria-hidden="true"
      style={{ pointerEvents: "auto" }}
    >
      <Canvas
        camera={{ position: [0, 6, 14], fov: 55 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", pointerEvents: "auto" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight position={[8, 12, 6]} intensity={0.65} color="#ffe8df" />
          <directionalLight position={[-6, 5, -5]} intensity={0.2} color="#f0d5e8" />
          <pointLight position={[0, 8, 0]} intensity={0.3} color="#FADBD8" distance={30} />

          <WaveMesh />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
