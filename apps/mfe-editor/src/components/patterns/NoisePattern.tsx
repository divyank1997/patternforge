
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PatternParameters } from '../../lib/store';

interface Props { params: PatternParameters }

// Simple value noise (no external dep)
function noise3(x: number, y: number, z: number, seed: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);
  const h = (n: number) => {
    let s = (n ^ seed) * 2246822519;
    s ^= s >> 13; s *= 1540483477; s ^= s >> 15;
    return (s & 0xFFFF) / 0xFFFF;
  };
  const v000 = h(ix + iy * 57 + iz * 131);
  const v100 = h((ix + 1) + iy * 57 + iz * 131);
  const v010 = h(ix + (iy + 1) * 57 + iz * 131);
  const v110 = h((ix + 1) + (iy + 1) * 57 + iz * 131);
  const v001 = h(ix + iy * 57 + (iz + 1) * 131);
  const v101 = h((ix + 1) + iy * 57 + (iz + 1) * 131);
  const v011 = h(ix + (iy + 1) * 57 + (iz + 1) * 131);
  const v111 = h((ix + 1) + (iy + 1) * 57 + (iz + 1) * 131);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(THREE.MathUtils.lerp(v000, v100, ux), THREE.MathUtils.lerp(v010, v110, ux), uy),
    THREE.MathUtils.lerp(THREE.MathUtils.lerp(v001, v101, ux), THREE.MathUtils.lerp(v011, v111, ux), uy),
    uz,
  );
}

export function NoisePattern({ params }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const { complexity, scale, colorPalette, seed, customParams } = params;

  const resolution = Math.floor(32 + complexity * 64);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(scale * 2, scale * 2, resolution, resolution);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const n = noise3(x * 0.4, y * 0.4, 0, seed)
               + 0.5 * noise3(x * 0.8, y * 0.8, 0, seed + 1)
               + 0.25 * noise3(x * 1.6, y * 1.6, 0, seed + 2);
      pos.setZ(i, n * scale * 0.5 * complexity);
    }
    geo.computeVertexNormals();
    return geo;
  }, [scale, complexity, seed, resolution]);

  useFrame((state, delta) => {
    timeRef.current += delta * customParams.speed;
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 4 + Math.sin(timeRef.current * 0.3) * 0.2;
      meshRef.current.rotation.z = timeRef.current * 0.1;
    }
  });

  return (
    <group rotation={[0, 0, (params.rotation * Math.PI) / 180]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={colorPalette.primary}
          roughness={customParams.roughness}
          metalness={customParams.metalness}
          wireframe={customParams.wireframe}
          side={THREE.DoubleSide}
          emissive={colorPalette.secondary}
          emissiveIntensity={customParams.emissiveIntensity * 0.3}
        />
      </mesh>
    </group>
  );
}
