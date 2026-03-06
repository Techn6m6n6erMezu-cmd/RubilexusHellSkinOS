import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import { useAuth } from './contexts/AuthContext';

const NPCTerminal = ({ position, name, color = "#ff0000" }) => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
    <group position={position}>
      {/* Obsidian Terminal Frame */}
      <mesh>
        <boxGeometry args={[1.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
      </mesh>
      {/* Red-Neon Core Screen */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1, 1.6]} />
        <meshBasicMaterial color={color} opacity={0.4} transparent />
      </mesh>
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  </Float>
);

export default function App() {
  const { user } = useAuth();
  
  const npcs = [
    { name: "OZZY", pos: [-5, 0, -4] },
    { name: "LIBRARIAN", pos: [0, 0, -4] },
    { name: "TRASH_PACT", pos: [5, 0, -4] },
    { name: "S_01", pos: [-5, 0, 0] },
    { name: "S_02", pos: [0, 0, 0], color: "#00ff00" }, // Central Admin Hub
    { name: "S_03", pos: [5, 0, 0] },
    { name: "S_04", pos: [-5, 0, 4] },
    { name: "S_05", pos: [0, 0, 4] },
    { name: "S_06", pos: [5, 0, 4] },
    { name: "S_07", pos: [-8, 0, 0] },
    { name: "S_08", pos: [8, 0, 0] },
    { name: "ADMIN", pos: [0, 5, 0], color: "#ffffff" } // Your Floating Overseer Seat
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 12, 20], fov: 40 }}>
        <color attach="background" args={['#000']} />
        <fog attach="fog" args={['#000', 10, 30]} />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 15, 0]} intensity={2.5} color="#ff0000" />
        
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          {npcs.map((npc, i) => (
            <NPCTerminal key={i} position={npc.pos} name={npc.name} color={npc.color} />
          ))}
          
          {/* Pulsing Floor Matrix */}
          <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 40]} />
            <MeshDistortMaterial color="#080000" speed={1} distort={0.1} />
          </mesh>
          <gridHelper args={[40, 40, "#440000", "#110000"]} position={[0, -0.99, 0]} />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={10}
          maxDistance={35}
        />
      </Canvas>
    </div>
  );
}

// Solar Flare Fri Mar  6 18:43:01 UTC 2026
