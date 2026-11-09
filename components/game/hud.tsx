'use client'

import { Activity, Building2, Gauge, Hammer, Pause, Play, RotateCcw, ShieldCheck, Trash2, Undo2, Wind, Waves, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STRUCTURE_EXAMPLES } from '@/lib/game/examples'
import type { StructureExampleId } from '@/lib/game/examples'
import { MATERIALS } from '@/lib/game/materials'
import type { GameMode, MaterialId, TestType, ToolId } from '@/lib/game/types'

const forceIcons = { wind: Wind, quake: Waves, weight: Weight }

export function Hud({ mode, tool, budget, blockCount, testType, intensity, elapsed, maxStress, heatmap, paused, score, onTool, onTestType, onIntensity, onStart, onPause, onReset, onClear, onUndo, onLoadExample, onHeatmap }: { mode: GameMode; tool: ToolId; budget: number; blockCount: number; testType: TestType; intensity: number; elapsed: number; maxStress: number; heatmap: boolean; paused: boolean; score: number; onTool: (tool: ToolId) => void; onTestType: (type: TestType) => void; onIntensity: (value: number) => void; onStart: () => void; onPause: () => void; onReset: () => void; onClear: () => void; onUndo: () => void; onLoadExample: (id: StructureExampleId) => void; onHeatmap: () => void }) {
  return (
    <>
      <header className="pointer-events-auto absolute inset-x-4 top-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl md:inset-x-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><Activity aria-hidden="true" /></div>
          <div><p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">PROJECT SI-01</p><h1 className="text-sm font-semibold tracking-wide md:text-base">STRUCTURAL INTEGRITY</h1></div>
        </div>
        <div className="hidden items-center gap-7 md:flex">
          <Metric label="Budget" value={`$${budget}`} />
          <Metric label="Elements" value={String(blockCount)} />
          <Metric label="Stress peak" value={`${Math.round(maxStress * 100)}%`} warning={maxStress > 0.9} />
          <Metric label="Score" value={score.toLocaleString()} />
        </div>
        <div className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em] ${mode === 'build' ? 'bg-white/10 text-white' : 'bg-primary/15 text-primary'}`}>{mode === 'build' ? 'BUILD MODE' : mode === 'test' ? 'LIVE TEST' : 'TEST COMPLETE'}</div>
      </header>

      <aside className="pointer-events-auto absolute bottom-20 left-4 flex w-[164px] flex-col gap-2 rounded-lg border border-white/10 bg-black/75 p-3 backdrop-blur-xl md:bottom-auto md:left-6 md:top-28 md:w-[190px]">
        <div className="flex items-center justify-between px-1"><p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">EXAMPLE STRUCTURES</p><Building2 className="text-primary" aria-hidden="true" /></div>
        <div className="grid grid-cols-2 gap-1.5">
          {STRUCTURE_EXAMPLES.map((example) => <button key={example.id} disabled={mode !== 'build'} onClick={() => onLoadExample(example.id)} title={example.description} className="rounded-md border border-white/7 bg-white/[0.03] px-2 py-2 text-left text-[10px] font-medium leading-tight transition hover:border-primary/60 hover:bg-primary/10 disabled:opacity-40">{example.name}</button>)}
        </div>
        <p className="px-1 pt-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">MATERIAL LIBRARY</p>
        {(Object.keys(MATERIALS) as MaterialId[]).map((id) => {
          const material = MATERIALS[id]
          return <button key={id} disabled={mode !== 'build'} onClick={() => onTool(id)} className={`flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition ${tool === id ? 'border-primary bg-primary/10' : 'border-white/7 bg-white/[0.03] hover:bg-white/[0.07]'} disabled:opacity-40`}><span className="size-4 rounded-sm border border-white/20" style={{ background: material.color }} /><span className="min-w-0 flex-1"><span className="block text-xs font-medium">{material.name}</span><span className="block truncate text-[10px] text-muted-foreground">{material.description}</span></span><span className="font-mono text-[10px] text-primary">${material.cost}</span></button>
        })}
        <button disabled={mode !== 'build'} onClick={() => onTool('erase')} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${tool === 'erase' ? 'border-destructive bg-destructive/10' : 'border-white/7 bg-white/[0.03]'}`}><Trash2 aria-hidden="true" /> Erase <span className="ml-auto text-[9px] text-muted-foreground">SHIFT</span></button>
        <div className="grid grid-cols-2 gap-2 pt-1"><Button size="sm" variant="outline" onClick={onUndo} disabled={mode !== 'build'}><Undo2 data-icon="inline-start" />Undo</Button><Button size="sm" variant="outline" onClick={onClear} disabled={mode !== 'build'}><Trash2 data-icon="inline-start" />Clear</Button></div>
      </aside>

      <aside className="pointer-events-auto absolute bottom-20 right-4 flex w-[190px] flex-col gap-3 rounded-lg border border-white/10 bg-black/75 p-3 backdrop-blur-xl md:bottom-auto md:right-6 md:top-28 md:w-[224px]">
        <div className="flex items-center justify-between"><p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">STRESS TEST</p><Gauge className="text-primary" aria-hidden="true" /></div>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-white/[0.04] p-1">
          {(['wind', 'quake', 'weight'] as TestType[]).map((type) => { const Icon = forceIcons[type]; return <button key={type} disabled={mode === 'test'} onClick={() => onTestType(type)} className={`flex flex-col items-center gap-1 rounded px-1 py-2 text-[9px] uppercase tracking-wide ${testType === type ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'}`}><Icon aria-hidden="true" />{type}</button> })}
        </div>
        <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><span className="flex justify-between"><span>Force intensity</span><b className="text-foreground">{intensity.toFixed(1)}×</b></span><input type="range" min="0.5" max="3" step="0.1" value={intensity} onChange={(event) => onIntensity(Number(event.target.value))} className="accent-[var(--primary)]" /></label>
        <button onClick={onHeatmap} className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.03] px-3 py-2 text-xs"><span>Stress overlay</span><span className={`h-2 w-8 rounded-full ${heatmap ? 'bg-primary' : 'bg-white/15'}`}><span className={`block size-2 rounded-full bg-white transition ${heatmap ? 'translate-x-6' : ''}`} /></span></button>
        <div><div className="mb-1 flex justify-between font-mono text-[9px] text-muted-foreground"><span>STABLE</span><span>CRITICAL</span></div><div className="h-1.5 rounded-full bg-gradient-to-r from-[#49b8ff] via-[#f4d35e] to-[#ff4d35]" /></div>
        {mode === 'build' ? <Button onClick={onStart}><Play data-icon="inline-start" />Begin test</Button> : <div className="grid grid-cols-2 gap-2"><Button onClick={onPause} variant="outline">{paused ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}{paused ? 'Resume' : 'Pause'}</Button><Button onClick={onReset}><RotateCcw data-icon="inline-start" />Retry</Button></div>}
        {mode !== 'build' && <div className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2"><span className="font-mono text-[10px] text-muted-foreground">SURVIVAL</span><span className="font-mono text-sm">{Math.max(0, 20 - elapsed).toFixed(1)}s</span></div>}
      </aside>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/8 bg-black/60 px-4 py-2 font-mono text-[9px] tracking-wider text-muted-foreground backdrop-blur md:text-[10px]"><Hammer aria-hidden="true" /><span>CLICK BUILD</span><span className="text-white/20">/</span><span>SHIFT REMOVE</span><span className="hidden text-white/20 sm:inline">/</span><span className="hidden sm:inline">DRAG ORBIT</span></div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[9px] text-muted-foreground md:left-6"><ShieldCheck aria-hidden="true" /><span>SIMULATION // ENTERTAINMENT MODEL</span></div>
    </>
  )
}

function Metric({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) { return <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className={`font-mono text-sm ${warning ? 'text-destructive' : 'text-foreground'}`}>{value}</p></div> }
