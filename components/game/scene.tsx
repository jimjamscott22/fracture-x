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
      <color attach="background" args={['#24323a']} />
      <fog attach="fog" args={['#24323a', 28, 56]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#d9f0ff', '#465057', 1.4]} />
      <directionalLight position={[8, 16, 10]} intensity={3.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-10, 8, -6]} color="#9ed9ff" intensity={1.1} />
      <pointLight position={[-8, 7, -4]} color="#ffad57" intensity={48} distance={26} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} timeStep="vary">
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -0.32, 0]} receiveShadow>
              <boxGeometry args={[14, 0.6, 14]} />
              <meshStandardMaterial color="#35434a" roughness={0.82} />
            </mesh>
          </RigidBody>
          <VoxelGrid blocks={blocks} target={target} validTarget={validTarget && mode === 'build'} heatmap={heatmap || mode !== 'build'} onTarget={onTarget} onRemove={onRemove} onPlace={onPlace} />
          <Debris blocks={debris} />
        </Physics>
      </Suspense>
      <Grid position={[0, 0.01, 0]} args={[12, 12]} cellSize={1} cellThickness={0.8} cellColor="#82929a" sectionSize={6} sectionThickness={1.4} sectionColor="#ffad57" fadeDistance={32} fadeStrength={1.1} infiniteGrid />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.24} scale={24} blur={2.8} far={10} />
      <OrbitControls makeDefault target={[0, 3.6, 0]} minDistance={8} maxDistance={32} maxPolarAngle={Math.PI / 2.05} enableDamping />
    </Canvas>
  )
}
