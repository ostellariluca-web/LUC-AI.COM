// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
// FIX: Add `ThreeElements` to manually extend JSX namespace for react-three-fiber primitives.
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { MathUtils, Color } from 'three';
import type { Mesh } from 'three';

// Custom hook to check for user's preference for reduced motion.
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

interface LiquidOrbProps {
  size: 'sm' | 'md' | 'lg';
  status: 'idle' | 'listening' | 'speaking';
  audioLevel: number;
}

const sizeMap = {
  sm: { scale: 1.1, canvasSize: 460 },
  md: { scale: 1.3, canvasSize: 600 },
  lg: { scale: 1.2, canvasSize: 740 },
};

const OrbScene: React.FC<{ status: LiquidOrbProps['status'], audioLevel: number }> = ({ status, audioLevel }) => {
    const meshRef = useRef<Mesh>(null!);
    const materialRef = useRef<any>(null!);
    const prefersReducedMotion = usePrefersReducedMotion();

    const colors = useMemo(() => ({
        idle: { color: new Color("#06b6d4"), emissive: new Color("#60a5fa") },
        speaking: { color: new Color("#7c3aed"), emissive: new Color("#8b5cf6") },
    }), []);

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;
        
        // Smooth the audio level to prevent jerky movements
        const smoothedAudioLevel = MathUtils.lerp(meshRef.current.userData.lastAudioLevel || 0, audioLevel, 0.2);
        meshRef.current.userData.lastAudioLevel = smoothedAudioLevel;

        if (prefersReducedMotion) {
            materialRef.current.distort = 0.1;
            materialRef.current.speed = 0.5;
            meshRef.current.scale.setScalar(1.0);
            return;
        }

        const time = state.clock.getElapsedTime();
        
        let targetDistort = 0.4;
        let targetSpeed = 1.2;
        let targetScale = 1.0;
        let targetColor = colors.idle.color;
        let targetEmissive = colors.idle.emissive;
        let targetEmissiveIntensity = 0.5;
        let targetRoughness = 0.8;

        switch(status) {
            case 'listening':
                targetDistort = 0.55 + smoothedAudioLevel * 0.2;
                targetSpeed = 2 + smoothedAudioLevel * 2;
                targetScale = 1.03 + smoothedAudioLevel * 0.07;
                targetRoughness = 0.7;
                targetEmissiveIntensity = 0.8 + smoothedAudioLevel * 0.4;
                break;
            case 'speaking':
                targetDistort = 0.65 + smoothedAudioLevel * 0.15 + Math.sin(time * 8) * 0.05;
                targetSpeed = 2.5 + smoothedAudioLevel * 1;
                targetScale = 1.0 + smoothedAudioLevel * 0.05;
                targetColor = colors.speaking.color;
                targetEmissive = colors.speaking.emissive;
                targetRoughness = 0.9;
                targetEmissiveIntensity = 1.2 + smoothedAudioLevel * 0.5;
                break;
            default: // idle
                targetDistort = 0.36;
                targetSpeed = 1.08;
                targetEmissiveIntensity = 0.45;
                break;
        }
        
        // Smooth transitions using lerp for a fluid feel
        materialRef.current.distort = MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);
        materialRef.current.speed = MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05);
        materialRef.current.color.lerp(targetColor, 0.1);
        materialRef.current.emissive.lerp(targetEmissive, 0.1);
        materialRef.current.emissiveIntensity = MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissiveIntensity, 0.1);
        materialRef.current.roughness = MathUtils.lerp(materialRef.current.roughness, targetRoughness, 0.1);
        meshRef.current.scale.setScalar(MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));

        // Gentle rotation for constant motion
        meshRef.current.rotation.y += delta * 0.1;
    });

    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#60a5fa" />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#06b6d4" />
            <Sphere ref={meshRef} args={[1, 128, 128]}>
                <MeshDistortMaterial
                    ref={materialRef}
                    color={colors.idle.color}
                    emissive={colors.idle.emissive}
                    emissiveIntensity={0.5}
                    distort={0.4}
                    speed={1.2}
                    roughness={0.8}
                />
            </Sphere>
        </>
    );
};

const LiquidOrb: React.FC<LiquidOrbProps> = ({ size, status, audioLevel }) => {
  const { canvasSize, scale } = useMemo(() => sizeMap[size], [size]);

  return (
    <div 
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2.5] }}
        style={{ width: canvasSize, height: canvasSize }}
      >
        <group scale={scale}>
            <OrbScene status={status} audioLevel={audioLevel} />
        </group>
      </Canvas>
    </div>
  );
};

export default LiquidOrb;