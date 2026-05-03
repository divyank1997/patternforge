
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PatternParameters } from '../../lib/store';

interface Props { params: PatternParameters }

export function OrganicPattern({ params }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { complexity, scale, colorPalette, seed, customParams } = params;

  const geometry = useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(
      scale * 0.6,
      scale * 0.15 * (0.3 + complexity * 0.7),
      Math.floor(64 + complexity * 128),
      Math.floor(8 + complexity * 16),
      2 + Math.floor(seed % 4),
      3 + Math.floor(seed % 5),
    );
    return geo;
  }, [scale, complexity, seed]);

  const geometry2 = useMemo(() => {
    return new THREE.TorusKnotGeometry(
      scale * 0.4,
      scale * 0.08,
      64,
      8,
      3 + Math.floor(seed % 3),
      2 + Math.floor(seed % 4),
    );
  }, [scale, seed]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * customParams.speed * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * customParams.speed * 0.3;
    }
  });

  return (
    <group rotation={[0, 0, (params.rotation * Math.PI) / 180]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color={colorPalette.primary}
          roughness={customParams.roughness}
          metalness={customParams.metalness}
          wireframe={customParams.wireframe}
          emissive={colorPalette.accent}
          emissiveIntensity={customParams.emissiveIntensity * 0.4}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh geometry={geometry2} rotation={[Math.PI * 0.3, 0, 0]}>
        <meshStandardMaterial
          color={colorPalette.secondary}
          roughness={customParams.roughness + 0.2}
          metalness={customParams.metalness * 0.5}
          wireframe={customParams.wireframe}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
