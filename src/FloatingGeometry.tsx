import { useRef, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Full-viewport flowing 3D wave that ripples under the pointer      */
/* ------------------------------------------------------------------ */

const GRID = 100;         // vertex resolution
const SEG  = GRID - 1;
const SPREAD = 28;        // covers the full viewport width

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Normalised mouse in world coords
  const mouse = useRef(new THREE.Vector2(0, 0));

  const handlePointerMove = useCallback(
    (e: any) => {
      if (e.point) mouse.current.set(e.point.x, e.point.y);
    },
    []
  );

  // Store base vertex positions
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

      // Layered organic waves — gentle and flowing
      let z = 0;
      z += Math.sin(bx * 0.35 + t * 0.3) * 0.3;
      z += Math.sin(by * 0.45 + t * 0.25) * 0.25;
      z += Math.cos((bx + by) * 0.25 + t * 0.35) * 0.2;
      z += Math.sin(bx * 0.7 - t * 0.4) * 0.1;
      z += Math.cos(by * 0.6 + t * 0.2) * 0.12;

      // Mouse ripple — radial wave from pointer
      const dx = bx - mouse.current.x;
      const dy = by - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ripple = Math.sin(dist * 1.4 - t * 2.5) * Math.exp(-dist * 0.18) * 0.5;
      z += ripple;

      pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.3, 0, 0]}
      position={[0, -2.5, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[SPREAD, SPREAD, SEG, SEG]} />
      <meshPhysicalMaterial
        color="#f5d5cc"
        roughness={0.6}
        metalness={0.05}
        transmission={0.08}
        thickness={0.5}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiny floating peach-tinted glass orbs                             */
/* ------------------------------------------------------------------ */

function FloatingOrbs({ count = 14 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 5 + 1.5,
        (Math.random() - 0.5) * 6
      ),
      speed: Math.random() * 0.25 + 0.1,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.08 + 0.03,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.6,
        p.position.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.4,
        p.position.z + Math.sin(t * p.speed * 0.5 + p.offset * 2) * 0.3
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhysicalMaterial
        color="#f0c4b8"
        roughness={0.25}
        metalness={0.1}
        transmission={0.5}
        thickness={0.4}
        transparent
        opacity={0.2}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export — full-screen fixed 3D canvas                         */
/* ------------------------------------------------------------------ */

export default function FloatingGeometry() {
  return (
    <div
      className="fixed inset-0 z-[1]"
      aria-hidden="true"
      style={{ pointerEvents: "auto" }}
    >
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", pointerEvents: "auto" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          {/* Warm peach ambient + soft directional for gentle shading */}
          <ambientLight intensity={0.5} color="#fff5ee" />
          <directionalLight position={[6, 10, 5]} intensity={0.6} color="#ffe8df" />
          <directionalLight position={[-5, 4, -4]} intensity={0.2} color="#e8d5f0" />
          <pointLight position={[0, 6, 0]} intensity={0.3} color="#FADBD8" distance={25} />

          <WaveMesh />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
