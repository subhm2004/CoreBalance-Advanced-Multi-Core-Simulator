#include "DualCoreFCFS.h"
#include <algorithm>
#include <queue>
#include <vector>
#include <climits>

DualCoreFCFS::DualCoreFCFS(const std::vector<Process>& processes)
    : DualCoreScheduler(processes, 0) {}

DualCoreScheduleResult DualCoreFCFS::schedule() {
    DualCoreScheduleResult result;
    result.contextSwitches = 0;
    std::vector<Process> sortedProcesses = processes;
    
    // Sort by arrival time
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    std::vector<int> coreLoads = {0, 0};
    std::vector<int> coreCurrentTime = {0, 0};
    std::vector<Process*> runningProcesses = {nullptr, nullptr};
    std::queue<Process*> readyQueue;
    std::vector<Process*> waitingQueue;
    
    int currentTime = 0;
    size_t processIndex = 0;
    int lastProcessId0 = -1, lastProcessId1 = -1;
    
    while (processIndex < sortedProcesses.size() || !readyQueue.empty() || 
           runningProcesses[0] != nullptr || runningProcesses[1] != nullptr ||
           !waitingQueue.empty()) {
        
        // Add newly arrived processes
        while (processIndex < sortedProcesses.size() && 
               sortedProcesses[processIndex].arrivalTime <= currentTime) {
            Process* p = &sortedProcesses[processIndex];
            if (canAllocateMemory(p->memoryRequired)) {
                allocateMemory(p->memoryRequired);
                readyQueue.push(p);
            } else {
                waitingQueue.push_back(p);
            }
            processIndex++;
        }
        
        // Update aging for waiting processes
        updateAging(waitingQueue, 50);
        
        // Try to allocate memory for waiting processes (after aging may have changed priorities)
        for (auto it = waitingQueue.begin(); it != waitingQueue.end();) {
            if (canAllocateMemory((*it)->memoryRequired)) {
                allocateMemory((*it)->memoryRequired);
                readyQueue.push(*it);
                it = waitingQueue.erase(it);
            } else {
                ++it;
            }
        }
        
        // Check for completed processes and deallocate memory
        for (int core = 0; core < 2; core++) {
            if (runningProcesses[core] != nullptr) {
                Process* p = runningProcesses[core];
                if (coreCurrentTime[core] <= currentTime) {
                    // Process completed
                    p->completionTime = coreCurrentTime[core];
                    p->calculateMetrics();
                    deallocateMemory(p->memoryRequired);
                    
                    if (core == 0) {
                        result.core0.processes.push_back(*p);
                    } else {
                        result.core1.processes.push_back(*p);
                    }
                    
                    runningProcesses[core] = nullptr;
                }
            }
        }
        
        // Assign processes to cores
        for (int core = 0; core < 2; core++) {
            if (runningProcesses[core] == nullptr && !readyQueue.empty()) {
                Process* p = readyQueue.front();
                readyQueue.pop();
                
                // Check for context switch
                if ((core == 0 && lastProcessId0 != -1 && lastProcessId0 != p->id) ||
                    (core == 1 && lastProcessId1 != -1 && lastProcessId1 != p->id)) {
                    result.contextSwitches++;
                    contextSwitchCount++;
                    coreCurrentTime[core] += CONTEXT_SWITCH_TIME;
                }
                
                int selectedCore = selectCore(coreLoads);
                if (selectedCore == core) {
                    if (coreCurrentTime[core] < p->arrivalTime) {
                        coreCurrentTime[core] = p->arrivalTime;
                    }
                    
                    p->startTime = coreCurrentTime[core];
                    runningProcesses[core] = p;
                    coreCurrentTime[core] += p->burstTime;
                    coreLoads[core] += p->burstTime;
                    
                    if (core == 0) {
                        result.core0.ganttChart.push_back({p->id, p->startTime, coreCurrentTime[core]});
                        lastProcessId0 = p->id;
                    } else {
                        result.core1.ganttChart.push_back({p->id, p->startTime, coreCurrentTime[core]});
                        lastProcessId1 = p->id;
                    }
                } else {
                    // Put back in queue for correct core
                    readyQueue.push(p);
                }
            }
        }
        
        // Update memory snapshot periodically
        if (currentTime % 5 == 0 || processIndex == sortedProcesses.size()) {
            updateMemorySnapshot(result, currentTime);
        }
        
        // Advance time
        int nextEvent = INT_MAX;
        for (int core = 0; core < 2; core++) {
            if (runningProcesses[core] != nullptr) {
                nextEvent = std::min(nextEvent, coreCurrentTime[core]);
            }
        }
        if (processIndex < sortedProcesses.size()) {
            nextEvent = std::min(nextEvent, sortedProcesses[processIndex].arrivalTime);
        }
        if (nextEvent != INT_MAX && nextEvent > currentTime) {
            currentTime = nextEvent;
        } else {
            currentTime++;
        }
        
        // Safety check to prevent infinite loop
        if (currentTime > 10000) break;
    }
    
    result.core0.totalTime = coreCurrentTime[0];
    result.core1.totalTime = coreCurrentTime[1];
    result.totalTime = std::max(result.core0.totalTime, result.core1.totalTime);
    
    // Final memory snapshot
    updateMemorySnapshot(result, result.totalTime);
    
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
    result.contextSwitches = contextSwitchCount;
    
    return result;
}
