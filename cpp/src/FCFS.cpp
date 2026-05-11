#include "FCFS.h"
#include <algorithm>

FCFS::FCFS(const std::vector<Process>& processes) : Scheduler(processes) {}

ScheduleResult FCFS::schedule() {
    ScheduleResult result;
    std::vector<Process> sortedProcesses = processes;
    
    // Sort by arrival time
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    int currentTime = 0;
    
    for (auto& p : sortedProcesses) {
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime;
        }
        
        p.startTime = currentTime;
        p.completionTime = currentTime + p.burstTime;
        p.calculateMetrics();
        
        result.ganttChart.push_back({p.id, p.startTime, p.completionTime});
        currentTime = p.completionTime;
    }
    
    result.processes = sortedProcesses;
    result.totalTime = currentTime;
    calculateAverages(result);
    
    return result;
}
