'use client'

import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { DebrisBlock } from '@/lib/game/types'
import { MATERIALS } from '@/lib/game/materials'

export function Debris({ blocks }: { blocks: DebrisBlock[] }) {
  return blocks.slice(-260).map((block) => (
    <RigidBody
      key={`${block.id}-${block.damage}`}
      position={[block.x, block.y + 0.5, block.z]}
      linearVelocity={block.velocity}
      angularVelocity={[block.velocity[2] * 0.2, block.velocity[0] * 0.16, block.velocity[1] * 0.1]}
      colliders={false}
      mass={MATERIALS[block.material].mass}
      restitution={0.08}
      friction={0.72}
    >
      <CuboidCollider args={[0.46, 0.46, 0.46]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshStandardMaterial color={MATERIALS[block.material].color} roughness={0.72} metalness={block.material === 'steel' ? 0.68 : 0.08} />
      </mesh>
    </RigidBody>
  ))
}
