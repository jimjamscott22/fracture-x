export type MaterialId = 'wood' | 'steel' | 'glass'
export type ToolId = MaterialId | 'erase'
export type TestType = 'wind' | 'quake' | 'weight'
export type GameMode = 'build' | 'test' | 'result'

export type GridPosition = { x: number; y: number; z: number }

export type Block = GridPosition & {
  id: string
  material: MaterialId
  stress: number
  damage: number
}

export type DebrisBlock = Block & {
  velocity: [number, number, number]
}

export type MaterialSpec = {
  id: MaterialId
  name: string
  cost: number
  strength: number
  mass: number
  color: string
  accent: string
  description: string
}
