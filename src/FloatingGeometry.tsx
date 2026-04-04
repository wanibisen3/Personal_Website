import { useRef, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Flowing 3D wave-mesh that ripples under the user's pointer        */
/* ------------------------------------------------------------------ */

const GRID = 80;          // vertex resolution
const SEG  = GRID - 1;
const SPREAD = 14;        // world-unit width of the plane

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Normalised mouse in world coords, updated every frame
  const mouse = useRef(new THREE.Vector2(0, 0));

  const handlePointerMove = useCallback(
    (e: THREE.Event & { point: THREE.Vector3 }) => {
      mouse.current.set(e.point.x, e.point.y);
    },
    []
  );

  // Base positions stored once
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

      // Organic base wave (multiple frequencies for richness)
      let z = 0;
      z += Math.sin(bx * 0.6 + t * 0.4) * 0.25;
      z += Math.sin(by * 0.8 + t * 0.3) * 0.2;
      z += Math.cos((bx + by) * 0.4 + t * 0.5) * 0.15;
      z += Math.sin(bx * 1.2 - t * 0.6) * 0.08;

      // Mouse ripple — radial wave emanating from pointer
      const dx = bx - mouse.current.x;
      const dy = by - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ripple = Math.sin(dist * 1.8 - t * 3) * Math.exp(-dist * 0.25) * 0.6;
      z += ripple;

      pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.6, 0, 0]}
      position={[0, -1.5, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[SPREAD, SPREAD, SEG, SEG]} />
      <meshPhysicalMaterial
        color="#e8d0c9"
        roughness={0.55}
        metalness={0.15}
        transmission={0.15}
        thickness={0.8}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        wireframe={false}
        flatShading
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiny floating glass-like spheres that drift with gentle physics    */
/* ------------------------------------------------------------------ */

function FloatingOrbs({ count = 18 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6 + 1,
        (Math.random() - 0.5) * 6
      ),
      speed: Math.random() * 0.3 + 0.15,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.12 + 0.04,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.5,
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
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#D97B66"
        roughness={0.2}
        metalness={0.3}
        transmission={0.6}
        thickness={0.5}
        transparent
        opacity={0.25}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Invisible plane to capture mouse events across entire viewport    */
/* ------------------------------------------------------------------ */

function JsonPointerPlane({ onMove }: { onMove: (e: any) => void }) {
  const { viewport } = useThree();
  return (
    <mesh
      position={[0, -1.5, 0.5]}
      rotation={[-Math.PI / 2.6, 0, 0]}
      onPointerMove={onMove}
      visible={false}
    >
      <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
      <meshBasicMaterial />
    </mesh>
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
        camera={{ position: [0, 4, 9], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", pointerEvents: "auto" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          {/* Lighting: warm + cool for depth */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={0.7} color="#fff5ee" />
          <directionalLight position={[-4, 3, -3]} intensity={0.3} color="#bfdbfe" />
          <pointLight position={[0, 5, 0]} intensity={0.4} color="#FADBD8" distance={20} />

          <WaveMesh />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
