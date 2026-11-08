'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MATERIALS } from '@/lib/game/materials'
import type { Block, GridPosition, MaterialId } from '@/lib/game/types'

const materialIds: MaterialId[] = ['wood', 'steel', 'glass']
const heat = new THREE.Color()
const base = new THREE.Color()
const matrix = new THREE.Matrix4()

function BlockInstances({ blocks, heatmap, onTarget, onRemove }: { blocks: Block[]; heatmap: boolean; onTarget: (position: GridPosition) => void; onRemove: (id: string) => void }) {
  const refs = useRef<Record<MaterialId, THREE.InstancedMesh | null>>({ wood: null, steel: null, glass: null })
  const groups = useMemo(() => Object.fromEntries(materialIds.map((id) => [id, blocks.filter((block) => block.material === id)])) as Record<MaterialId, Block[]>, [blocks])

  useLayoutEffect(() => {
    materialIds.forEach((id) => {
      const mesh = refs.current[id]
      if (!mesh) return
      groups[id].forEach((block, index) => {
        matrix.makeTranslation(block.x, block.y + 0.5, block.z)
        mesh.setMatrixAt(index, matrix)
        base.set(MATERIALS[id].color)
        if (heatmap) {
          if (block.stress < 0.55) heat.set('#49b8ff')
          else if (block.stress < 0.9) heat.set('#f4d35e')
          else heat.set('#ff4d35')
          base.lerp(heat, Math.min(0.92, block.stress))
        }
        mesh.setColorAt(index, base)
      })
      mesh.count = groups[id].length
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    })
  }, [groups, heatmap])

  return materialIds.map((id) => (
    <instancedMesh
      key={id}
      ref={(mesh) => { refs.current[id] = mesh }}
      args={[undefined, undefined, Math.max(1, groups[id].length)]}
      castShadow
      receiveShadow
      onPointerMove={(event) => {
        event.stopPropagation()
        if (event.instanceId === undefined) return
        const block = groups[id][event.instanceId]
        const normal = event.face?.normal ?? new THREE.Vector3(0, 1, 0)
        onTarget({ x: block.x + Math.round(normal.x), y: block.y + Math.round(normal.y), z: block.z + Math.round(normal.z) })
      }}
      onClick={(event) => {
        event.stopPropagation()
        if (event.instanceId !== undefined && event.shiftKey) onRemove(groups[id][event.instanceId].id)
      }}
    >
      <boxGeometry args={[0.92, 0.92, 0.92]} />
      <meshStandardMaterial vertexColors roughness={id === 'glass' ? 0.25 : 0.68} metalness={id === 'steel' ? 0.68 : 0.05} transparent={id === 'glass'} opacity={id === 'glass' ? 0.76 : 1} />
    </instancedMesh>
  ))
}

export function VoxelGrid({ blocks, target, validTarget, heatmap, onTarget, onRemove, onPlace }: { blocks: Block[]; target: GridPosition; validTarget: boolean; heatmap: boolean; onTarget: (position: GridPosition) => void; onRemove: (id: string) => void; onPlace: () => void }) {
  return (
    <group>
      <BlockInstances blocks={blocks} heatmap={heatmap} onTarget={onTarget} onRemove={onRemove} />
      <mesh position={[target.x, target.y + 0.5, target.z]} onClick={(event) => { event.stopPropagation(); onPlace() }}>
        <boxGeometry args={[0.96, 0.96, 0.96]} />
        <meshBasicMaterial color={validTarget ? '#ff9f1c' : '#ff3b30'} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  )
}
