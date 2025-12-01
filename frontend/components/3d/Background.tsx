'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particle({ position, color }: { position: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() + position[0]) * 0.002;
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
        </Float>
    );
}

function FloatingOrb({ position, color, scale, speed }: { position: [number, number, number], color: string, scale: number, speed: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[1, 64, 64]} position={position} scale={scale} ref={meshRef}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.9}
                />
            </Sphere>
        </Float>
    );
}

function Particles({ count = 100 }) {
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            color: Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6'
        }));
    }, [count]);

    return (
        <>
            {particles.map((p, i) => (
                <Particle key={i} position={p.position} color={p.color} />
            ))}
        </>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00ffff" />

                <FloatingOrb position={[-4, 2, -5]} color="#7c3aed" scale={2} speed={1.5} />
                <FloatingOrb position={[4, -2, -5]} color="#db2777" scale={2.5} speed={1.2} />
                <FloatingOrb position={[0, 0, -10]} color="#2563eb" scale={4} speed={0.8} />

                <Particles count={50} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#000', 5, 30]} />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
        </div>
    );
}
