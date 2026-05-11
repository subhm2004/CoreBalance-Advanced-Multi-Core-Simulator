'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ProcessInput from '@/components/ProcessInput'
import AlgorithmSelector from '@/components/AlgorithmSelector'
import GanttChart from '@/components/GanttChart'
import MetricsTable from '@/components/MetricsTable'
import RandomDataGenerator from '@/components/RandomDataGenerator'
import DualCoreGanttChart from '@/components/DualCoreGanttChart'
import CPUUtilizationChart from '@/components/CPUUtilizationChart'
import ComparisonTable from '@/components/ComparisonTable'
import ThemeToggle from '@/components/ThemeToggle'
import SimulationControls from '@/components/SimulationControls'
import AlgorithmExplain from '@/components/AlgorithmExplain'
import { ScheduleResult, Process as ProcessType, DualCoreScheduleResult } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function SimulatorPage() {
  const [processes, setProcesses] = useState<ProcessType[]>([
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 4, arrivalTime: 3, burstTime: 6, priority: 2 },
  ])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('FCFS')
  const [timeQuantum, setTimeQuantum] = useState<number>(2)
  const [result, setResult] = useState<ScheduleResult | null>(null)
  const [dualCoreResult, setDualCoreResult] = useState<DualCoreScheduleResult | null>(null)
  const [comparisonResults, setComparisonResults] = useState<Record<string, DualCoreScheduleResult> | null>(null)

  const [isSimulating, setIsSimulating] = useState(false)
  const [currentTimeUnit, setCurrentTimeUnit] = useState(0)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [isStepMode, setIsStepMode] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'single' | 'compare' | 'dualcore'>('dualcore')
  const hasResults = Boolean(result || dualCoreResult || comparisonResults)
  const totalTimelineUnits = Math.max(
    result?.totalTime || 0,
    dualCoreResult?.totalTime || 0,
    ...(comparisonResults ? Object.values(comparisonResults).map((res) => res.totalTime) : [0])
  )

  useEffect(() => {
    if (!isSimulating || isStepMode) return

    const interval = setInterval(() => {
      setCurrentTimeUnit((prev) => {
        const maxTime = totalTimelineUnits
        if (prev >= maxTime) {
          setIsSimulating(false)
          return prev
        }
        return prev + 1
      })
    }, Math.max(90, Math.round(800 / simulationSpeed)))

    return () => clearInterval(interval)
  }, [isSimulating, isStepMode, simulationSpeed, totalTimelineUnits])

  const handlePlayPause = () => {
    if (currentTimeUnit >= totalTimelineUnits && totalTimelineUnits > 0) {
      setCurrentTimeUnit(0)
    }
    setIsSimulating(!isSimulating)
  }

  const handleReplay = () => {
    setCurrentTimeUnit(0)
    setIsSimulating(false)
  }

  const handleStepForward = () => {
    if (currentTimeUnit < totalTimelineUnits) {
      setCurrentTimeUnit((prev) => prev + 1)
    }
  }

  const handleToggleStepMode = () => {
    setIsStepMode(!isStepMode)
    setIsSimulating(false)
  }

  const handleSchedule = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setDualCoreResult(null)
    setComparisonResults(null)
    setCurrentTimeUnit(0)
    setIsSimulating(false)

    try {
      const response = await fetch(`${API_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm: selectedAlgorithm,
          timeQuantum,
          processes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to schedule processes')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDualCoreSchedule = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setDualCoreResult(null)
    setComparisonResults(null)
    setCurrentTimeUnit(0)
    setIsSimulating(false)

    try {
      const algorithm = `DualCore${selectedAlgorithm}`
      const response = await fetch(`${API_URL}/api/schedule-dualcore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm,
          timeQuantum,
          processes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to schedule processes')
      }

      const data = await response.json()
      setDualCoreResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = async (processesToUse?: ProcessType[]) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setDualCoreResult(null)
    setComparisonResults(null)
    setCurrentTimeUnit(0)
    setIsSimulating(false)

    const processesForCompare = processesToUse || processes

    try {
      const response = await fetch(`${API_URL}/api/compare-dualcore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeQuantum,
          processes: processesForCompare,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to compare algorithms')
      }

      const data = await response.json()
      setComparisonResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSimulate = async (newProcesses: ProcessType[]) => {
    setProcesses(newProcesses)
    setViewMode('compare')
    await handleCompare(newProcesses)
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <header className="sim-topbar !mb-4 md:!mb-5">
          <Link href="/" className="btn-secondary">
            ← Back To Landing
          </Link>
          <ThemeToggle />
        </header>

        {/* 2×2: equal columns, stretched row 1; right column = one card + internal scroll */}
        <div className="mb-2 grid grid-cols-1 gap-2.5 lg:mb-3 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-3 lg:gap-y-2.5">
          {/* 1 — Intro (natural height — no stretch filler) */}
          <div className="card sim-section animate-slide-in order-1 !p-2.5 md:!p-3 lg:order-1">
            <span className="sim-badge mb-1 inline-flex text-[10px] leading-none">Interactive Scheduling Workspace</span>
            <h1 className="text-base font-semibold tracking-tight text-[var(--cb-text)] md:text-lg">
              Simulator Dashboard
            </h1>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--cb-text-muted)] md:text-xs">
              Configure process data, run algorithms, and inspect timeline metrics.
            </p>
          </div>

          {/* 2 — Timeline */}
          <div className="order-2 flex animate-slide-in lg:order-2 lg:min-h-0" style={{ animationDelay: '0.05s' }}>
            {hasResults ? (
              <SimulationControls
                compact
                isRunning={isSimulating}
                onPlayPause={handlePlayPause}
                onReplay={handleReplay}
                onStepForward={handleStepForward}
                speed={simulationSpeed}
                onSpeedChange={setSimulationSpeed}
                currentTimeUnit={currentTimeUnit}
                totalTimeUnits={totalTimelineUnits}
                isStepMode={isStepMode}
                onToggleStepMode={handleToggleStepMode}
              />
            ) : (
              <div className="card sim-section !p-2.5 text-center">
                <p className="text-[11px] leading-snug text-[var(--cb-text-muted)] md:text-xs">
                  Run a schedule to unlock{' '}
                  <span className="font-semibold text-[var(--cb-text)]">timeline controls</span>.
                </p>
              </div>
            )}
          </div>

          {/* 3 — Random data */}
          <div className="card sim-section animate-slide-in order-3 !p-2.5 md:!p-3 lg:order-3" style={{ animationDelay: '0.1s' }}>
            <RandomDataGenerator onGenerate={setProcesses} onAutoSimulate={handleAutoSimulate} loading={loading} />
          </div>

          {/* 4 — Actions + algorithm: single shell, one scroll area */}
          <div
            className="card sim-section order-4 flex max-h-[min(46vh,26rem)] min-h-0 flex-col overflow-hidden !p-0 animate-slide-in lg:order-4 lg:max-h-[min(48vh,27rem)]"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="shrink-0 border-b border-[var(--cb-border)] bg-[var(--cb-bg)] px-3 py-2.5 md:px-4">
              <h2 className="text-base font-semibold text-[var(--cb-text)]">Actions</h2>
              <p className="text-[11px] text-[var(--cb-text-muted)]">Run for current view mode.</p>
              <div className="mt-2">
                {viewMode === 'single' && (
                  <button onClick={handleSchedule} disabled={loading} type="button" className="btn-primary w-full py-2.5 text-sm">
                    {loading ? 'Scheduling...' : 'Run Schedule'}
                  </button>
                )}
                {viewMode === 'dualcore' && (
                  <button onClick={handleDualCoreSchedule} disabled={loading} type="button" className="btn-primary w-full py-2.5 text-sm">
                    {loading ? 'Scheduling...' : 'Run dual-core'}
                  </button>
                )}
                {viewMode === 'compare' && (
                  <button onClick={() => handleCompare()} disabled={loading} type="button" className="btn-primary w-full py-2.5 text-sm">
                    {loading ? 'Comparing...' : 'Compare all'}
                  </button>
                )}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2.5 md:px-4 md:py-3">
              <h2 className="mb-0.5 text-base font-semibold text-[var(--cb-text)]">Algorithm</h2>
              <p className="mb-2 text-[11px] text-[var(--cb-text-muted)]">Mode, algorithm, time quantum.</p>
              <AlgorithmSelector
                compact
                selectedAlgorithm={selectedAlgorithm}
                setSelectedAlgorithm={setSelectedAlgorithm}
                timeQuantum={timeQuantum}
                setTimeQuantum={setTimeQuantum}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
            {error && (
              <div className="shrink-0 border-t border-[var(--cb-border)] px-3 py-2">
                <p className="status-error text-xs">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Process table */}
        <div className="card sim-section mb-4 max-h-[min(40vh,24rem)] overflow-y-auto overflow-x-hidden !p-2.5 md:!p-3 lg:max-h-[min(36vh,22rem)]">
          <h2 className="sticky top-0 z-[1] mb-2 border-b border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] py-1.5 text-base font-semibold text-[var(--cb-text)]">
            Process Configuration
          </h2>
          <ProcessInput processes={processes} setProcesses={setProcesses} />
        </div>

        {viewMode === 'single' && result && (
          <div className="space-y-6 animate-fade-in">
            <div className="card sim-section">
              <h2 className="card-title">Gantt Chart - {selectedAlgorithm}</h2>
              <GanttChart ganttChart={result.ganttChart} currentTimeUnit={currentTimeUnit} isSimulating={isSimulating || isStepMode} />
            </div>

            <div className="card sim-section">
              <h2 className="card-title">Performance Metrics</h2>
              <MetricsTable result={result} />
            </div>

            <AlgorithmExplain
              viewMode={viewMode}
              selectedAlgorithm={selectedAlgorithm}
              processes={processes}
              timeQuantum={timeQuantum}
              result={result}
              dualCoreResult={dualCoreResult}
              comparisonResults={comparisonResults}
            />
          </div>
        )}

        {viewMode === 'dualcore' && dualCoreResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="card sim-section">
              <h2 className="card-title">Dual-Core Gantt Chart - {selectedAlgorithm}</h2>
              <DualCoreGanttChart
                core0Gantt={dualCoreResult.core0_results.ganttChart}
                core1Gantt={dualCoreResult.core1_results.ganttChart}
                core0Processes={dualCoreResult.core0_results.processes}
                core1Processes={dualCoreResult.core1_results.processes}
                title={`Dual-Core Gantt Chart - ${selectedAlgorithm}`}
                currentTimeUnit={currentTimeUnit}
                isSimulating={isSimulating || isStepMode}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card sim-section">
                <CPUUtilizationChart utilization={dualCoreResult.cpuUtilization} />
              </div>
            </div>

            <AlgorithmExplain
              viewMode={viewMode}
              selectedAlgorithm={selectedAlgorithm}
              processes={processes}
              timeQuantum={timeQuantum}
              result={result}
              dualCoreResult={dualCoreResult}
              comparisonResults={comparisonResults}
            />
          </div>
        )}

        {viewMode === 'compare' && comparisonResults && (
          <div className="space-y-6 animate-fade-in">
            <div className="card sim-section">
              <ComparisonTable results={comparisonResults} />
            </div>
            {Object.entries(comparisonResults).map(([algorithm, item]) => (
              <div key={algorithm} className="card sim-section">
                <h3 className="card-title mb-6">{algorithm.replace('DualCore', '')}</h3>
                <DualCoreGanttChart
                  core0Gantt={item.core0_results.ganttChart}
                  core1Gantt={item.core1_results.ganttChart}
                  core0Processes={item.core0_results.processes}
                  core1Processes={item.core1_results.processes}
                  currentTimeUnit={currentTimeUnit}
                  isSimulating={isSimulating || isStepMode}
                />
                <div className="mt-6">
                  <CPUUtilizationChart utilization={item.cpuUtilization} />
                </div>
              </div>
            ))}

            <AlgorithmExplain
              viewMode={viewMode}
              selectedAlgorithm={selectedAlgorithm}
              processes={processes}
              timeQuantum={timeQuantum}
              result={result}
              dualCoreResult={dualCoreResult}
              comparisonResults={comparisonResults}
            />
          </div>
        )}
      </div>
    </div>
  )
}
