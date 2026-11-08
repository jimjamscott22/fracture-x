import { MATERIALS } from './materials'
import { blockId } from './grid'
import type { Block, TestType } from './types'

export type SolverResult = { blocks: Block[]; failed: Block[]; maxStress: number }

export function solveStep(blocks: Block[], test: TestType, intensity: number, elapsed: number): SolverResult {
  const occupied = new Set(blocks.map((block) => block.id))
  const failed: Block[] = []
  let maxStress = 0

  const next = blocks.map((block) => {
    const below = occupied.has(blockId({ x: block.x, y: block.y - 1, z: block.z }))
    const sideSupports = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ].filter(([x, z]) => occupied.has(blockId({ x: block.x + x, y: block.y, z: block.z + z }))).length
    const material = MATERIALS[block.material]
    const heightFactor = 0.12 + block.y / 13
    const supportFactor = block.y === 0 ? 0.18 : below ? 0.7 : 1.25 - sideSupports * 0.16
    const force = test === 'wind'
      ? intensity * heightFactor * (0.8 + Math.abs(block.x) * 0.05)
      : test === 'quake'
        ? intensity * (0.45 + material.mass * 0.35) * (0.7 + Math.abs(Math.sin(elapsed * 9)) * 0.5)
        : intensity * (block.y > 5 ? 0.95 : 0.28) * (1 + block.y * 0.025)
    const stress = Math.max(0, Math.min(1.6, force * supportFactor / material.strength))
    const damage = stress > 0.9 ? block.damage + (stress - 0.82) * 0.065 : Math.max(0, block.damage - 0.02)
    const updated = { ...block, stress, damage }
    maxStress = Math.max(maxStress, stress)
    if (damage > 1.05 && block.y > 0) failed.push(updated)
    return updated
  })

  const failedIds = new Set(failed.map((block) => block.id))
  return { blocks: next.filter((block) => !failedIds.has(block.id)), failed, maxStress }
}
