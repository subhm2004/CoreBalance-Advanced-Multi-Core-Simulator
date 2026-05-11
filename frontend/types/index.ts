export interface Process {
  id: number
  arrivalTime: number
  burstTime: number
  priority?: number
  memoryRequired?: number
}

export interface GanttEntry {
  processId: number
  startTime: number
  endTime: number
}

export interface ScheduleResult {
  ganttChart: GanttEntry[]
  processes: ProcessResult[]
  avgWaitingTime: number
  avgTurnaroundTime: number
  totalTime: number
}

export interface ProcessResult {
  id: number
  arrivalTime: number
  burstTime: number
  priority: number
  memoryRequired: number
  startTime: number
  completionTime: number
  waitingTime: number
  turnaroundTime: number
  waitingTicks: number
  isAged: boolean
}

export interface CoreResult {
  ganttChart: GanttEntry[]
  processes: ProcessResult[]
  avgWaitingTime: number
  avgTurnaroundTime: number
  totalTime: number
}

export interface MemorySnapshot {
  time: number
  usedMemory: number
  availableMemory: number
}

export interface DualCoreScheduleResult {
  core0_results: CoreResult
  core1_results: CoreResult
  cpuUtilization: number[]
  memoryUsage: MemorySnapshot[]
  avgCpuUtilization: number
  contextSwitches: number
  totalTime: number
}
