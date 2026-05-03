'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { GeometricPattern } from './patterns/GeometricPattern';
import { OrganicPattern } from './patterns/OrganicPattern';
import { FractalPattern } from './patterns/FractalPattern';
import { NoisePattern } from './patterns/NoisePattern';
import { ParametricPattern } from './patterns/ParametricPattern';
import type { PatternParameters } from '../lib/store';

interface Props {
  params: PatternParameters;
}

function ActivePattern({ params }: Props) {
  switch (params.style) {
    case 'geometric':   return <GeometricPattern params={params} />;
    case 'organic':     return <OrganicPattern params={params} />;
    case 'fractal':     return <FractalPattern params={params} />;
    case 'noise':       return <NoisePattern params={params} />;
    case 'parametric':  return <ParametricPattern params={params} />;
  }
}

export function PatternCanvas({ params }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      style={{ background: params.colorPalette.background }}
      gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.2 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} color={params.colorPalette.accent} intensity={2} />
        <pointLight position={[5, -5, 8]} color={params.colorPalette.secondary} intensity={1.5} />

        <Stars radius={50} depth={20} count={800} factor={2} fade speed={0.5} />

        <ActivePattern params={params} />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={30}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  );
}
