import type { Block, GridPosition, MaterialId } from './types'

export const GRID_SIZE = 12
export const GRID_HEIGHT = 18

export const blockId = ({ x, y, z }: GridPosition) => `${x}:${y}:${z}`

export function createBlock(position: GridPosition, material: MaterialId): Block {
  return { ...position, id: blockId(position), material, stress: 0, damage: 0 }
}

export function isInsideGrid({ x, y, z }: GridPosition) {
  const half = GRID_SIZE / 2
  return x >= -half && x < half && z >= -half && z < half && y >= 0 && y < GRID_HEIGHT
}

export function canPlace(blocks: Block[], position: GridPosition) {
  if (!isInsideGrid(position) || blocks.some((block) => block.id === blockId(position))) return false
  if (position.y === 0) return true
  return blocks.some((block) => {
    const distance = Math.abs(block.x - position.x) + Math.abs(block.y - position.y) + Math.abs(block.z - position.z)
    return distance === 1
  })
}

export function createStarterTower() {
  const blocks: Block[] = []
  const add = (x: number, y: number, z: number, material: MaterialId) => blocks.push(createBlock({ x, y, z }, material))

  for (let y = 0; y < 7; y += 1) {
    const material: MaterialId = y < 2 ? 'steel' : 'wood'
    add(-2, y, -2, material)
    add(2, y, -2, material)
    add(-2, y, 2, material)
    add(2, y, 2, material)
    if (y % 2 === 0) {
      for (let x = -2; x <= 2; x += 1) {
        add(x, y, -2, x === 0 ? 'glass' : material)
        add(x, y, 2, x === 0 ? 'glass' : material)
      }
    }
  }
  for (let x = -2; x <= 2; x += 1) {
    for (let z = -2; z <= 2; z += 1) add(x, 7, z, 'glass')
  }
  return Array.from(new Map(blocks.map((block) => [block.id, block])).values())
}
