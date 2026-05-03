
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PatternParameters } from '../../lib/store';

interface Props { params: PatternParameters }

export function ParametricPattern({ params }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { complexity, scale, symmetry, colorPalette, seed, customParams } = params;

  // Rose curve in 3D lifted into a helix
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const k = 2 + (seed % 5);          // rose petals
    const turns = 3 + Math.floor(complexity * 5);
    const steps = Math.floor(500 + complexity * 1500);
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * turns;
      const r = Math.cos(k * t) * scale;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      const z = Math.sin(t * symmetry * 0.5) * scale * 0.3 * complexity;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [scale, complexity, symmetry, seed]);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'chordal');
    return new THREE.TubeGeometry(curve, Math.min(points.length, 1000), scale * 0.02, 8, false);
  }, [points, scale]);

  // Lissajous orbiting spheres
  const orbits = useMemo(() => {
    return Array.from({ length: Math.floor(symmetry) }, (_, i) => {
      const phase = (i / symmetry) * Math.PI * 2;
      return { phase, color: i % 2 === 0 ? colorPalette.secondary : colorPalette.accent };
    });
  }, [symmetry, colorPalette]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * customParams.speed * 0.15;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, (params.rotation * Math.PI) / 180]}>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={colorPalette.primary}
          roughness={customParams.roughness}
          metalness={customParams.metalness}
          wireframe={customParams.wireframe}
          emissive={colorPalette.primary}
          emissiveIntensity={customParams.emissiveIntensity * 0.5}
        />
      </mesh>
      {orbits.map((o, i) => (
        <OrbitingSphere key={i} phase={o.phase} color={o.color} scale={scale} speed={customParams.speed} />
      ))}
    </group>
  );
}

function OrbitingSphere({ phase, color, scale, speed }: { phase: number; color: string; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + phase;
      ref.current.position.set(
        Math.cos(t) * scale * 0.7,
        Math.sin(t * 1.3) * scale * 0.7,
        Math.sin(t * 0.7) * scale * 0.3,
      );
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[scale * 0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
}
