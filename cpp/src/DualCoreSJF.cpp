#include "DualCoreSJF.h"
#include <algorithm>
#include <vector>
#include <climits>

DualCoreSJF::DualCoreSJF(const std::vector<Process>& processes)
    : DualCoreScheduler(processes, 0) {}

DualCoreScheduleResult DualCoreSJF::schedule() {
    DualCoreScheduleResult result;
    std::vector<Process> processList = processes;
    std::vector<bool> completed(processes.size(), false);
    
    std::sort(processList.begin(), processList.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    std::vector<int> coreLoads = {0, 0};
    std::vector<int> coreCurrentTime = {0, 0};
    int completedCount = 0;
    
    while (completedCount < processList.size()) {
        // Find available processes
        std::vector<int> available;
        for (size_t i = 0; i < processList.size(); i++) {
            if (!completed[i] && processList[i].arrivalTime <= 
                std::min(coreCurrentTime[0], coreCurrentTime[1])) {
                available.push_back(i);
            }
        }
        
        if (available.empty()) {
            // Find next arriving process
            int nextArrival = INT_MAX;
            for (size_t i = 0; i < processList.size(); i++) {
                if (!completed[i] && processList[i].arrivalTime < nextArrival) {
                    nextArrival = processList[i].arrivalTime;
                }
            }
            if (nextArrival != INT_MAX) {
                coreCurrentTime[0] = std::max(coreCurrentTime[0], nextArrival);
                coreCurrentTime[1] = std::max(coreCurrentTime[1], nextArrival);
            }
            continue;
        }
        
        // Sort available by burst time (SJF)
        std::sort(available.begin(), available.end(),
                  [&](int a, int b) {
                      return processList[a].burstTime < processList[b].burstTime;
                  });
        
        // Assign to cores (up to 2 processes at a time)
        for (size_t idx = 0; idx < available.size() && idx < 2; idx++) {
            int i = available[idx];
            int selectedCore = selectCore(coreLoads);
            
            Process& p = processList[i];
            p.startTime = coreCurrentTime[selectedCore];
            p.completionTime = coreCurrentTime[selectedCore] + p.burstTime;
            p.calculateMetrics();
            
            if (selectedCore == 0) {
                result.core0.ganttChart.push_back({p.id, p.startTime, p.completionTime});
                result.core0.processes.push_back(p);
                coreCurrentTime[0] = p.completionTime;
            } else {
                result.core1.ganttChart.push_back({p.id, p.startTime, p.completionTime});
                result.core1.processes.push_back(p);
                coreCurrentTime[1] = p.completionTime;
            }
            
            coreLoads[selectedCore] += p.burstTime;
            completed[i] = true;
            completedCount++;
        }
    }
    
    result.core0.totalTime = coreCurrentTime[0];
    result.core1.totalTime = coreCurrentTime[1];
    result.totalTime = std::max(result.core0.totalTime, result.core1.totalTime);
    
    // Calculate averages
    double totalWaiting0 = 0, totalTurnaround0 = 0;
    for (const auto& p : result.core0.processes) {
        totalWaiting0 += p.waitingTime;
        totalTurnaround0 += p.turnaroundTime;
    }
    result.core0.avgWaitingTime = result.core0.processes.empty() ? 0 : 
                                  totalWaiting0 / result.core0.processes.size();
    result.core0.avgTurnaroundTime = result.core0.processes.empty() ? 0 : 
                                     totalTurnaround0 / result.core0.processes.size();
    
    double totalWaiting1 = 0, totalTurnaround1 = 0;
    for (const auto& p : result.core1.processes) {
        totalWaiting1 += p.waitingTime;
        totalTurnaround1 += p.turnaroundTime;
    }
    result.core1.avgWaitingTime = result.core1.processes.empty() ? 0 : 
                                  totalWaiting1 / result.core1.processes.size();
    result.core1.avgTurnaroundTime = result.core1.processes.empty() ? 0 : 
                                     totalTurnaround1 / result.core1.processes.size();
    
    // Calculate CPU utilization
    calculateUtilization(result);
    
    return result;
}
