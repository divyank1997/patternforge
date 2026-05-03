'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PatternParameters } from '../../lib/store';

interface Props { params: PatternParameters }

export function GeometricPattern({ params }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { complexity, scale, symmetry, colorPalette, seed, customParams } = params;

  const count = Math.max(1, Math.floor(symmetry * 3 + complexity * 20));
  const rng = useMemo(() => seededRandom(seed), [seed]);

  const meshes = useMemo(() => {
    const r = seededRandom(seed);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = (0.5 + r() * 0.5) * scale;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (r() - 0.5) * scale * complexity;
      const size = (0.1 + r() * 0.4) * scale * 0.3;
      const geomType = Math.floor(r() * 3);
      return { x, y, z, size, geomType, rotX: r() * Math.PI, rotZ: r() * Math.PI };
    });
  }, [count, scale, complexity, seed]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * customParams.speed * 0.3;
    }
  });

  const primary = new THREE.Color(colorPalette.primary);
  const secondary = new THREE.Color(colorPalette.secondary);
  const accent = new THREE.Color(colorPalette.accent);
  const colors = [primary, secondary, accent];

  return (
    <group ref={groupRef} rotation={[0, 0, (params.rotation * Math.PI) / 180]}>
      {meshes.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]} rotation={[m.rotX, 0, m.rotZ]}>
          {m.geomType === 0 ? (
            <boxGeometry args={[m.size, m.size, m.size]} />
          ) : m.geomType === 1 ? (
            <octahedronGeometry args={[m.size * 0.7]} />
          ) : (
            <tetrahedronGeometry args={[m.size * 0.8]} />
          )}
          <meshStandardMaterial
            color={colors[i % 3]}
            roughness={customParams.roughness}
            metalness={customParams.metalness}
            wireframe={customParams.wireframe}
            emissive={colors[i % 3]}
            emissiveIntensity={customParams.emissiveIntensity * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
