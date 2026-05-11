'use client'

import { Process } from '@/types'

interface ProcessInputProps {
  processes: Process[]
  setProcesses: (processes: Process[]) => void
}

export default function ProcessInput({ processes, setProcesses }: ProcessInputProps) {
  const updateProcess = (index: number, field: keyof Process, value: number) => {
    const updated = [...processes]
    updated[index] = { ...updated[index], [field]: value }
    setProcesses(updated)
  }

  const addProcess = () => {
    const newId = processes.length > 0 
      ? Math.max(...processes.map(p => p.id)) + 1 
      : 1
    setProcesses([...processes, { 
      id: newId, 
      arrivalTime: 0, 
      burstTime: 1, 
      priority: 0,
      memoryRequired: 100
    }])
  }

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-[var(--cb-border)] bg-[var(--cb-bg)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--cb-border)] bg-[var(--cb-accent-soft)]">
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">ID</th>
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">Arrival</th>
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">Burst</th>
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">Priority</th>
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">Memory</th>
              <th className="p-3 text-left font-bold text-[var(--cb-text)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id} className="border-b border-[var(--cb-border)] hover:bg-[var(--cb-accent-soft)] transition-colors">
                <td className="p-3">
                  <input
                    type="number"
                    value={process.id}
                    onChange={(e) => updateProcess(index, 'id', parseInt(e.target.value) || 0)}
                    className="input-field w-16 text-center font-semibold"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={process.arrivalTime}
                    onChange={(e) => updateProcess(index, 'arrivalTime', parseInt(e.target.value) || 0)}
                    className="input-field w-20 text-center font-semibold"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={process.burstTime}
                    onChange={(e) => updateProcess(index, 'burstTime', parseInt(e.target.value) || 1)}
                    min="1"
                    className="input-field w-20 text-center font-semibold"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={process.priority || 0}
                    onChange={(e) => updateProcess(index, 'priority', parseInt(e.target.value) || 0)}
                    className="input-field w-20 text-center font-semibold"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={process.memoryRequired || 0}
                    onChange={(e) => updateProcess(index, 'memoryRequired', parseInt(e.target.value) || 0)}
                    min="0"
                    max="1024"
                    className="input-field w-24 text-center font-semibold"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => removeProcess(index)}
                    className="btn-secondary px-4 py-1.5 text-sm font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addProcess}
        className="btn-primary w-full flex items-center justify-center font-bold text-base"
      >
        Add New Process
      </button>
    </div>
  )
}
