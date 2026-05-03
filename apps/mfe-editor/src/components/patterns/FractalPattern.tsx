'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PatternParameters } from '../../lib/store';

interface Props { params: PatternParameters }

interface SphereData {
  position: [number, number, number];
  radius: number;
  depth: number;
}

function generateFractal(
  x: number, y: number, z: number,
  radius: number, depth: number, maxDepth: number,
  result: SphereData[],
) {
  if (depth > maxDepth || radius < 0.05) return;
  result.push({ position: [x, y, z], radius, depth });
  if (depth >= maxDepth) return;
  const childRadius = radius * 0.5;
  const offset = radius * 1.2;
  const dirs: [number, number, number][] = [
    [offset, 0, 0], [-offset, 0, 0],
    [0, offset, 0], [0, -offset, 0],
    [0, 0, offset],
  ];
  for (const [dx, dy, dz] of dirs) {
    generateFractal(x + dx, y + dy, z + dz, childRadius, depth + 1, maxDepth, result);
  }
}

export function FractalPattern({ params }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { complexity, scale, colorPalette, customParams } = params;

  const maxDepth = Math.floor(1 + complexity * 3);

  const spheres = useMemo(() => {
    const result: SphereData[] = [];
    generateFractal(0, 0, 0, scale * 0.5, 0, maxDepth, result);
    return result;
  }, [scale, maxDepth]);

  const colors = useMemo(() => [
    new THREE.Color(colorPalette.primary),
    new THREE.Color(colorPalette.secondary),
    new THREE.Color(colorPalette.accent),
  ], [colorPalette]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * customParams.speed * 0.2;
      groupRef.current.rotation.x += delta * customParams.speed * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, (params.rotation * Math.PI) / 180]}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.position}>
          <icosahedronGeometry args={[s.radius, Math.min(s.depth, 2)]} />
          <meshStandardMaterial
            color={colors[s.depth % 3]}
            roughness={customParams.roughness}
            metalness={customParams.metalness}
            wireframe={customParams.wireframe || s.depth > 1}
            emissive={colors[s.depth % 3]}
            emissiveIntensity={customParams.emissiveIntensity * (0.2 + s.depth * 0.1)}
          />
        </mesh>
      ))}
    </group>
  );
}
