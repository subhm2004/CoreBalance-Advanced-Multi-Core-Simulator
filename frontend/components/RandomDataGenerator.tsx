'use client'

import { useState } from 'react'
import { Process } from '@/types'

interface RandomDataGeneratorProps {
  onGenerate: (processes: Process[]) => void
  onAutoSimulate: (processes: Process[]) => void
  loading: boolean
}

export default function RandomDataGenerator({ onGenerate, onAutoSimulate, loading }: RandomDataGeneratorProps) {
  const [count, setCount] = useState<number>(10)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const handleGenerate = async () => {
    console.log('RandomDataGenerator: handleGenerate called', { count, API_URL })
    try {
      const url = `${API_URL}/api/generate-random?count=${count}`
      console.log('RandomDataGenerator: Fetching from:', url)
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('RandomDataGenerator: Response not OK:', response.status, errorText)
        throw new Error(`Failed to generate random data: ${response.status}`)
      }
      const processes = await response.json()
      console.log('RandomDataGenerator: Generated processes:', processes)
      onGenerate(processes)
    } catch (error) {
      console.error('RandomDataGenerator: Error generating random data:', error)
      alert(`Failed to generate random data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleGenerateAndSimulate = async () => {
    console.log('RandomDataGenerator: handleGenerateAndSimulate called', { count, API_URL })
    try {
      const url = `${API_URL}/api/generate-random?count=${count}`
      console.log('RandomDataGenerator: Fetching from:', url)
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('RandomDataGenerator: Response not OK:', response.status, errorText)
        throw new Error(`Failed to generate random data: ${response.status}`)
      }
      const processes = await response.json()
      console.log('RandomDataGenerator: Generated processes:', processes)
      onAutoSimulate(processes)
    } catch (error) {
      console.error('RandomDataGenerator: Error generating random data:', error)
      alert(`Failed to generate random data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="mb-0 text-base font-semibold tracking-tight text-[var(--cb-text)] md:text-lg">
        Generate Random Processes
      </h2>
      <p className="text-[11px] leading-snug text-[var(--cb-text-muted)] md:text-xs">
        Quickly create test workloads for simulation and comparisons.
      </p>
      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--cb-text-muted)] md:text-xs">
            Number of Processes
          </label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="input-field py-2 text-sm font-semibold"
            disabled={loading}
          >
            <option value={3}>3 processes</option>
            <option value={5}>5 processes</option>
            <option value={10}>10 processes</option>
            <option value={15}>15 processes</option>
            <option value={20}>20 processes</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              handleGenerate()
            }}
            disabled={loading}
            type="button"
            className="btn-secondary py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleGenerateAndSimulate()
            }}
            disabled={loading}
            type="button"
            className="btn-primary py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Running...' : 'Generate + Simulate'}
          </button>
        </div>
      </div>
    </div>
  )
}
