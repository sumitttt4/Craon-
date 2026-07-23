'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

function roundedRectangle(width: number, height: number, radius: number, z: number) {
  const points: THREE.Vector3[] = [];
  const corners = [
    [width / 2 - radius, height / 2 - radius, 0],
    [-width / 2 + radius, height / 2 - radius, Math.PI / 2],
    [-width / 2 + radius, -height / 2 + radius, Math.PI],
    [width / 2 - radius, -height / 2 + radius, Math.PI * 1.5],
  ] as const;

  corners.forEach(([cx, cy, start]) => {
    for (let index = 0; index <= 10; index += 1) {
      const angle = start + (index / 10) * (Math.PI / 2);
      points.push(
        new THREE.Vector3(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius,
          z,
        ),
      );
    }
  });

  points.push(points[0].clone());
  return points;
}

function WireframeComposition() {
  const groupRef = useRef<THREE.Group>(null);
  const frames = useMemo(
    () => [
      { points: roundedRectangle(6.9, 3.86, 0.38, -0.82), position: [-0.32, 0.08, 0] as const },
      { points: roundedRectangle(6.25, 3.52, 0.34, -0.16), position: [0.28, -0.02, 0] as const },
      { points: roundedRectangle(5.72, 3.18, 0.3, 0.7), position: [-0.08, 0.02, 0] as const },
    ],
    [],
  );

  const streams = useMemo(
    () =>
      Array.from({ length: 6 }, (_, streamIndex) =>
        Array.from({ length: 30 }, (_, pointIndex) => {
          const t = pointIndex / 29;
          const x = -3.1 + t * 6.2;
          const baseY = 1.12 - streamIndex * 0.45;
          const wave =
            Math.sin(t * Math.PI * (1.35 + streamIndex * 0.08) + streamIndex * 0.62) *
            (0.12 + streamIndex * 0.014);
          const pull = Math.exp(-Math.pow((t - 0.54) * 4.4, 2)) * (streamIndex - 2.5) * -0.08;
          return new THREE.Vector3(x, baseY + wave + pull, 1.48);
        }),
      ),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = -0.09 + Math.sin(time * 0.18) * 0.018;
    groupRef.current.rotation.x = Math.sin(time * 0.14) * 0.008;
  });

  return (
    <group ref={groupRef} rotation={[0.015, -0.09, -0.025]}>
      {frames.map((frame, index) => (
        <Line
          key={`frame-${index}`}
          points={frame.points}
          position={frame.position}
          color="#f3f0e9"
          transparent
          opacity={0.42 + index * 0.12}
          lineWidth={0.72}
        />
      ))}

      {streams.map((points, index) => (
        <Line
          key={`stream-${index}`}
          points={points}
          color="#f6f3ed"
          transparent
          opacity={index % 2 === 0 ? 0.56 : 0.3}
          lineWidth={0.48}
          dashed={index % 2 === 1}
          dashSize={0.06}
          gapSize={0.065}
        />
      ))}

      {Array.from({ length: 4 }, (_, index) => {
        const x = -2.4 + index * 1.6;
        return (
          <Line
            key={`guide-${index}`}
            points={[
              new THREE.Vector3(x, -1.45, 1.4),
              new THREE.Vector3(x + Math.sin(index) * 0.12, 1.45, 1.4),
            ]}
            color="#f6f3ed"
            transparent
            opacity={0.08}
            lineWidth={0.32}
          />
        );
      })}
    </group>
  );
}

export default function WireframeScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8.8], fov: 44 }}
      >
        <WireframeComposition />
      </Canvas>
    </div>
  );
}
