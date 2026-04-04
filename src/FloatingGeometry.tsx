import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Shared mouse state (normalised -1 to 1)                           */
/* ------------------------------------------------------------------ */
const pointer = { x: 0, y: 0 };

function JsonMouseTracker() {
  const { viewport } = useThree();

  useFrame(({ pointer: p }) => {
    pointer.x = p.x * viewport.width * 0.5;
    pointer.y = p.y * viewport.height * 0.5;
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  120 white glass bubbles that orbit, scatter & spin on mouse move  */
/* ------------------------------------------------------------------ */

function Bubbles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      home: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12
      ),
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      speed: Math.random() * 0.25 + 0.08,
      phase: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.22 + 0.06,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Natural floating orbit
      const floatX = p.home.x + Math.sin(t * p.speed + p.phase) * 1.2;
      const floatY = p.home.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.8;
      const floatZ = p.home.z + Math.sin(t * p.speed * 0.5 + p.phase * 1.5) * 0.6;

      // Mouse repulsion in 3D
      const dx = floatX - pointer.x;
      const dy = floatY - pointer.y;
      const dist2D = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 5;

      if (dist2D < repelRadius && dist2D > 0.01) {
        const force = (1 - dist2D / repelRadius) * 3;
        p.vel.x += (dx / dist2D) * force * 0.12;
        p.vel.y += (dy / dist2D) * force * 0.12;
        // Push in Z for 3D depth effect on hover
        p.vel.z += (Math.random() - 0.5) * force * 0.08;
      }

      // Damping — spring back
      p.vel.multiplyScalar(0.9);

      p.pos.set(
        floatX + p.vel.x,
        floatY + p.vel.y,
        floatZ + p.vel.z
      );

      dummy.position.copy(p.pos);
      dummy.scale.setScalar(p.scale);
      dummy.rotation.x = t * p.rotSpeed;
      dummy.rotation.y = t * p.rotSpeed * 1.3;
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.15}
        roughness={0.05}
        metalness={0.0}
        transmission={0.4}
        thickness={0.3}
        transparent
        opacity={0.5}
        ior={1.3}
        envMapIntensity={0.2}
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
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight position={[8, 10, 8]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-6, 4, -6]} intensity={0.5} color="#ffffff" />
          <pointLight position={[0, 6, 4]} intensity={0.4} color="#ffffff" distance={25} />

          <JsonMouseTracker />
          <Bubbles />
        </Suspense>
      </Canvas>
    </div>
  );
}
