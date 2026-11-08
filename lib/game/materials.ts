import type { MaterialId, MaterialSpec } from './types'

export const MATERIALS: Record<MaterialId, MaterialSpec> = {
  wood: {
    id: 'wood',
    name: 'Timber',
    cost: 10,
    strength: 1.05,
    mass: 0.75,
    color: '#b97842',
    accent: '#f4bd75',
    description: 'Flexible / light',
  },
  steel: {
    id: 'steel',
    name: 'Steel',
    cost: 28,
    strength: 2.6,
    mass: 1.4,
    color: '#73828f',
    accent: '#c8d4dc',
    description: 'Strong / heavy',
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    cost: 16,
    strength: 0.82,
    mass: 0.55,
    color: '#5bb9c8',
    accent: '#bff6ff',
    description: 'Rigid / brittle',
  },
}

export const INITIAL_BUDGET = 1600
