'use client'

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { Suspense } from 'react'
import type { Block, DebrisBlock, GameMode, GridPosition } from '@/lib/game/types'
import { Debris } from './debris'
import { VoxelGrid } from './voxel-grid'

export function GameScene({ blocks, debris, mode, target, validTarget, heatmap, onTarget, onRemove, onPlace }: { blocks: Block[]; debris: DebrisBlock[]; mode: GameMode; target: GridPosition; validTarget: boolean; heatmap: boolean; onTarget: (position: GridPosition) => void; onRemove: (id: string) => void; onPlace: () => void }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [14, 12, 17], fov: 42 }} gl={{ antialias: true }}>
      <color attach="background" args={['#080a0b']} />
      <fog attach="fog" args={['#080a0b', 24, 48]} />
      <ambientLight intensity={0.52} />
      <directionalLight position={[8, 16, 10]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-8, 7, -4]} color="#ff8a1f" intensity={36} distance={22} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} timeStep="vary">
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -0.32, 0]} receiveShadow>
              <boxGeometry args={[14, 0.6, 14]} />
              <meshStandardMaterial color="#15191a" roughness={0.92} />
            </mesh>
          </RigidBody>
          <VoxelGrid blocks={blocks} target={target} validTarget={validTarget && mode === 'build'} heatmap={heatmap || mode !== 'build'} onTarget={onTarget} onRemove={onRemove} onPlace={onPlace} />
          <Debris blocks={debris} />
        </Physics>
      </Suspense>
      <Grid position={[0, 0.01, 0]} args={[12, 12]} cellSize={1} cellThickness={0.7} cellColor="#384044" sectionSize={6} sectionThickness={1.2} sectionColor="#ff8a1f" fadeDistance={28} fadeStrength={1.4} infiniteGrid />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.38} scale={24} blur={2.6} far={10} />
      <OrbitControls makeDefault target={[0, 3.6, 0]} minDistance={8} maxDistance={32} maxPolarAngle={Math.PI / 2.05} enableDamping />
    </Canvas>
  )
}
