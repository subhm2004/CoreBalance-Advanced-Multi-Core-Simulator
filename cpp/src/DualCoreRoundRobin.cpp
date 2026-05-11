#include "DualCoreRoundRobin.h"
#include <queue>
#include <algorithm>
#include <climits>

DualCoreRoundRobin::DualCoreRoundRobin(const std::vector<Process>& processes, int timeQuantum)
    : DualCoreScheduler(processes, timeQuantum) {}

DualCoreScheduleResult DualCoreRoundRobin::schedule() {
    DualCoreScheduleResult result;
    std::vector<Process> processList = processes;
    
    std::sort(processList.begin(), processList.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    std::queue<int> readyQueue0, readyQueue1;
    std::vector<bool> inQueue0(processes.size(), false);
    std::vector<bool> inQueue1(processes.size(), false);
    std::vector<int> coreCurrentTime = {0, 0};
    
    // Initialize remaining time
    for (auto& p : processList) {
        p.remainingTime = p.burstTime;
    }
    
    int completedCount = 0;
    
    while (completedCount < processList.size()) {
        // Add newly arrived processes
        for (size_t i = 0; i < processList.size(); i++) {
            int minTime = std::min(coreCurrentTime[0], coreCurrentTime[1]);
            if (processList[i].arrivalTime <= minTime && 
                processList[i].remainingTime > 0 &&
                !inQueue0[i] && !inQueue1[i]) {
                int selectedCore = selectCore({
                    static_cast<int>(readyQueue0.size()),
                    static_cast<int>(readyQueue1.size())
                });
                if (selectedCore == 0) {
                    readyQueue0.push(i);
                    inQueue0[i] = true;
                } else {
                    readyQueue1.push(i);
                    inQueue1[i] = true;
                }
            }
        }
        
        // Process Core 0
        if (!readyQueue0.empty()) {
            int idx = readyQueue0.front();
            readyQueue0.pop();
            inQueue0[idx] = false;
            
            Process& p = processList[idx];
            if (p.startTime == -1) {
                p.startTime = coreCurrentTime[0];
            }
            
            int execTime = std::min(timeQuantum, p.remainingTime);
            int startExec = coreCurrentTime[0];
            coreCurrentTime[0] += execTime;
            p.remainingTime -= execTime;
            
            result.core0.ganttChart.push_back({p.id, startExec, coreCurrentTime[0]});
            
            if (p.remainingTime > 0) {
                readyQueue0.push(idx);
                inQueue0[idx] = true;
            } else {
                p.completionTime = coreCurrentTime[0];
                p.calculateMetrics();
                result.core0.processes.push_back(p);
                completedCount++;
            }
        } else if (coreCurrentTime[0] < coreCurrentTime[1]) {
            coreCurrentTime[0] = coreCurrentTime[1];
        }
        
        // Process Core 1
        if (!readyQueue1.empty()) {
            int idx = readyQueue1.front();
            readyQueue1.pop();
            inQueue1[idx] = false;
            
            Process& p = processList[idx];
            if (p.startTime == -1) {
                p.startTime = coreCurrentTime[1];
            }
            
            int execTime = std::min(timeQuantum, p.remainingTime);
            int startExec = coreCurrentTime[1];
            coreCurrentTime[1] += execTime;
            p.remainingTime -= execTime;
            
            result.core1.ganttChart.push_back({p.id, startExec, coreCurrentTime[1]});
            
            if (p.remainingTime > 0) {
                readyQueue1.push(idx);
                inQueue1[idx] = true;
            } else {
                p.completionTime = coreCurrentTime[1];
                p.calculateMetrics();
                result.core1.processes.push_back(p);
                completedCount++;
            }
        } else if (coreCurrentTime[1] < coreCurrentTime[0]) {
            coreCurrentTime[1] = coreCurrentTime[0];
        }
        
        // If both queues empty, advance time
        if (readyQueue0.empty() && readyQueue1.empty() && completedCount < processList.size()) {
            int nextArrival = INT_MAX;
            for (size_t i = 0; i < processList.size(); i++) {
                if (processList[i].remainingTime > 0 && 
                    processList[i].arrivalTime < nextArrival) {
                    nextArrival = processList[i].arrivalTime;
                }
            }
            if (nextArrival != INT_MAX) {
                coreCurrentTime[0] = std::max(coreCurrentTime[0], nextArrival);
                coreCurrentTime[1] = std::max(coreCurrentTime[1], nextArrival);
            }
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
