import { createBlock } from './grid'
import type { Block, MaterialId } from './types'

export type StructureExampleId = 'timber-truss' | 'steel-frame' | 'glass-pavilion' | 'hybrid-tower'

export const STRUCTURE_EXAMPLES: Array<{ id: StructureExampleId; name: string; description: string }> = [
  { id: 'timber-truss', name: 'Timber Truss', description: 'Wide wooden bridge' },
  { id: 'steel-frame', name: 'Steel Frame', description: 'Rigid industrial tower' },
  { id: 'glass-pavilion', name: 'Glass Pavilion', description: 'Light vaulted shelter' },
  { id: 'hybrid-tower', name: 'Hybrid Tower', description: 'Balanced mixed materials' },
]

function structureBuilder() {
  const blocks = new Map<string, Block>()
  const add = (x: number, y: number, z: number, material: MaterialId) => {
    const block = createBlock({ x, y, z }, material)
    blocks.set(block.id, block)
  }
  return { add, finish: () => Array.from(blocks.values()) }
}

export function createExampleStructure(id: StructureExampleId): Block[] {
  if (id === 'timber-truss') return createTimberTruss()
  if (id === 'steel-frame') return createSteelFrame()
  if (id === 'glass-pavilion') return createGlassPavilion()
  return createHybridTower()
}

function createTimberTruss() {
  const { add, finish } = structureBuilder()
  for (let x = -5; x <= 5; x += 1) {
    add(x, 2, -1, 'wood')
    add(x, 2, 1, 'wood')
    add(x, 3, -1, 'wood')
    add(x, 3, 1, 'wood')
    if (x % 2 !== 0) {
      add(x, 1, -1, 'wood')
      add(x, 1, 1, 'wood')
    }
  }
  for (let y = 0; y <= 2; y += 1) {
    add(-5, y, -1, 'wood')
    add(-5, y, 1, 'wood')
    add(5, y, -1, 'wood')
    add(5, y, 1, 'wood')
  }
  for (let x = -4; x <= 4; x += 2) {
    add(x, 4, -1, 'wood')
    add(x, 4, 1, 'wood')
  }
  return finish()
}

function createSteelFrame() {
  const { add, finish } = structureBuilder()
  for (let y = 0; y <= 8; y += 1) {
    for (const x of [-2, 2]) for (const z of [-2, 2]) add(x, y, z, 'steel')
    if (y % 2 === 0) {
      for (let x = -2; x <= 2; x += 1) {
        add(x, y, -2, 'steel')
        add(x, y, 2, 'steel')
      }
      for (let z = -1; z <= 1; z += 1) {
        add(-2, y, z, 'steel')
        add(2, y, z, 'steel')
      }
    }
  }
  add(0, 9, 0, 'steel')
  add(0, 10, 0, 'steel')
  return finish()
}

function createGlassPavilion() {
  const { add, finish } = structureBuilder()
  for (let x = -4; x <= 4; x += 1) {
    add(x, 0, -2, 'glass')
    add(x, 0, 2, 'glass')
    add(x, 3, -2, 'glass')
    add(x, 3, 2, 'glass')
    if (x % 2 === 0) {
      add(x, 1, -2, 'glass')
      add(x, 2, -2, 'glass')
      add(x, 1, 2, 'glass')
      add(x, 2, 2, 'glass')
      add(x, 4, -1, 'glass')
      add(x, 4, 0, 'glass')
      add(x, 4, 1, 'glass')
    }
  }
  for (let z = -1; z <= 1; z += 1) {
    add(-4, 0, z, 'glass')
    add(4, 0, z, 'glass')
  }
  return finish()
}

function createHybridTower() {
  const { add, finish } = structureBuilder()
  for (let y = 0; y <= 9; y += 1) {
    const frameMaterial: MaterialId = y < 3 ? 'steel' : 'wood'
    for (const x of [-2, 2]) for (const z of [-2, 2]) add(x, y, z, frameMaterial)
    if (y % 3 === 0) {
      for (let x = -2; x <= 2; x += 1) {
        add(x, y, -2, x === 0 ? 'glass' : 'steel')
        add(x, y, 2, x === 0 ? 'glass' : 'steel')
      }
      for (let z = -1; z <= 1; z += 1) {
        add(-2, y, z, z === 0 ? 'glass' : 'steel')
        add(2, y, z, z === 0 ? 'glass' : 'steel')
      }
    }
  }
  for (let x = -1; x <= 1; x += 1) for (let z = -1; z <= 1; z += 1) add(x, 10, z, 'glass')
  return finish()
}
