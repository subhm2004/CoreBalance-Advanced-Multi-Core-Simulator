#include "SJF.h"
#include <algorithm>
#include <queue>
#include <vector>
#include <climits>

SJF::SJF(const std::vector<Process>& processes) : Scheduler(processes) {}

ScheduleResult SJF::schedule() {
    ScheduleResult result;
    std::vector<Process> sortedProcesses = processes;
    std::vector<Process> readyQueue;
    std::vector<bool> completed(processes.size(), false);
    
    // Sort by arrival time initially
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    int currentTime = 0;
    int completedCount = 0;
    
    while (completedCount < sortedProcesses.size()) {
        // Add processes that have arrived to ready queue
        for (size_t i = 0; i < sortedProcesses.size(); i++) {
            if (!completed[i] && sortedProcesses[i].arrivalTime <= currentTime) {
                readyQueue.push_back(sortedProcesses[i]);
                completed[i] = true;
            }
        }
        
        if (readyQueue.empty()) {
            // Find next arriving process
            int nextArrival = INT_MAX;
            for (size_t i = 0; i < sortedProcesses.size(); i++) {
                if (!completed[i] && sortedProcesses[i].arrivalTime < nextArrival) {
                    nextArrival = sortedProcesses[i].arrivalTime;
                }
            }
            currentTime = nextArrival;
            continue;
        }
        
        // Sort ready queue by burst time (SJF)
        std::sort(readyQueue.begin(), readyQueue.end(),
                  [](const Process& a, const Process& b) {
                      return a.burstTime < b.burstTime;
                  });
        
        Process& p = readyQueue[0];
        p.startTime = currentTime;
        p.completionTime = currentTime + p.burstTime;
        p.calculateMetrics();
        
        result.ganttChart.push_back({p.id, p.startTime, p.completionTime});
        currentTime = p.completionTime;
        
        // Find and update the process in sortedProcesses
        for (auto& proc : sortedProcesses) {
            if (proc.id == p.id) {
                proc = p;
                break;
            }
        }
        
        readyQueue.erase(readyQueue.begin());
        completedCount++;
    }
    
    result.processes = sortedProcesses;
    result.totalTime = currentTime;
    calculateAverages(result);
    
    return result;
}
