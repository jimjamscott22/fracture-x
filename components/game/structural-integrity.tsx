'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { INITIAL_BUDGET, MATERIALS } from '@/lib/game/materials'
import { blockId, canPlace, createBlock, createStarterTower } from '@/lib/game/grid'
import { solveStep } from '@/lib/game/solver'
import type { Block, DebrisBlock, GameMode, GridPosition, TestType, ToolId } from '@/lib/game/types'
import { GameScene } from './scene'
import { Hud } from './hud'

export function StructuralIntegrity() {
  const starter = useRef(createStarterTower())
  const [blocks, setBlocks] = useState<Block[]>(starter.current)
  const [snapshot, setSnapshot] = useState<Block[]>(starter.current)
  const [history, setHistory] = useState<Block[][]>([])
  const [debris, setDebris] = useState<DebrisBlock[]>([])
  const [mode, setMode] = useState<GameMode>('build')
  const [tool, setTool] = useState<ToolId>('wood')
  const [target, setTarget] = useState<GridPosition>({ x: 0, y: 8, z: 0 })
  const [testType, setTestType] = useState<TestType>('wind')
  const [intensity, setIntensity] = useState(1.25)
  const [heatmap, setHeatmap] = useState(false)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [maxStress, setMaxStress] = useState(0)

  const spent = useMemo(() => blocks.reduce((total, block) => total + MATERIALS[block.material].cost, 0), [blocks])
  const budget = INITIAL_BUDGET - spent
  const validTarget = tool !== 'erase' && canPlace(blocks, target) && budget >= MATERIALS[tool].cost
  const score = Math.round(elapsed * 125 + blocks.length * 8 - debris.length * 3)

  const mutateBuild = useCallback((next: Block[]) => {
    setHistory((items) => [...items.slice(-19), blocks])
    setBlocks(next)
  }, [blocks])

  const place = useCallback(() => {
    if (mode !== 'build') return
    if (tool === 'erase') {
      const targetId = blockId({ x: target.x, y: Math.max(0, target.y - 1), z: target.z })
      mutateBuild(blocks.filter((block) => block.id !== targetId))
      return
    }
    if (validTarget) mutateBuild([...blocks, createBlock(target, tool)])
  }, [blocks, mode, mutateBuild, target, tool, validTarget])

  const remove = useCallback((id: string) => {
    if (mode === 'build') mutateBuild(blocks.filter((block) => block.id !== id))
  }, [blocks, mode, mutateBuild])

  useEffect(() => {
    if (mode !== 'test' || paused) return
    const timer = window.setInterval(() => {
      setElapsed((time) => time + 0.08)
      setBlocks((current) => {
        const result = solveStep(current, testType, intensity, elapsed)
        setMaxStress(result.maxStress)
        if (result.failed.length) {
          setDebris((items) => [...items, ...result.failed.map((block) => ({ ...block, velocity: testType === 'weight' ? [0, -1, 0] as [number, number, number] : [(testType === 'quake' ? Math.sin(elapsed * 9) : 1) * intensity * 1.7, 0.5, (Math.random() - 0.5) * intensity] as [number, number, number] }))].slice(-260))
        }
        return result.blocks
      })
    }, 80)
    return () => window.clearInterval(timer)
  }, [elapsed, intensity, mode, paused, testType])

  useEffect(() => {
    if (mode === 'test' && elapsed >= 20) setMode('result')
  }, [elapsed, mode])

  const start = () => { setSnapshot(blocks); setDebris([]); setElapsed(0); setMaxStress(0); setPaused(false); setHeatmap(true); setMode('test') }
  const reset = () => { setBlocks(snapshot.map((block) => ({ ...block, stress: 0, damage: 0 }))); setDebris([]); setElapsed(0); setMaxStress(0); setPaused(false); setMode('build') }
  const clear = () => { mutateBuild([]); setDebris([]); setTarget({ x: 0, y: 0, z: 0 }) }
  const undo = () => { const previous = history.at(-1); if (previous) { setBlocks(previous); setHistory((items) => items.slice(0, -1)) } }

  return (
    <main className="relative h-dvh min-h-[640px] overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0"><GameScene blocks={blocks} debris={debris} mode={mode} target={target} validTarget={validTarget} heatmap={heatmap} onTarget={setTarget} onRemove={remove} onPlace={place} /></div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.24),transparent_22%,transparent_72%,rgba(0,0,0,.42))]" />
      <div className="pointer-events-none absolute inset-0"><Hud mode={mode} tool={tool} budget={budget} blockCount={blocks.length} testType={testType} intensity={intensity} elapsed={elapsed} maxStress={maxStress} heatmap={heatmap} paused={paused} score={score} onTool={setTool} onTestType={setTestType} onIntensity={setIntensity} onStart={start} onPause={() => setPaused((value) => !value)} onReset={reset} onClear={clear} onUndo={undo} onHeatmap={() => setHeatmap((value) => !value)} /></div>
    </main>
  )
}
