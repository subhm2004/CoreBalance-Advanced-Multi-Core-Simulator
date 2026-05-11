#include "DualCoreScheduler.h"
#include <algorithm>
#include <climits>
#include <sstream>
#include <iomanip>

DualCoreScheduler::DualCoreScheduler(const std::vector<Process>& processes, int timeQuantum)
    : processes(processes), timeQuantum(timeQuantum), currentMemory(0), contextSwitchCount(0) {}

int DualCoreScheduler::selectCore(const std::vector<int>& coreLoads) {
    return (coreLoads[0] <= coreLoads[1]) ? 0 : 1;
}

bool DualCoreScheduler::canAllocateMemory(int memoryRequired) {
    return (currentMemory + memoryRequired) <= SYSTEM_RAM;
}

void DualCoreScheduler::allocateMemory(int memoryRequired) {
    currentMemory += memoryRequired;
}

void DualCoreScheduler::deallocateMemory(int memoryRequired) {
    currentMemory = std::max(0, currentMemory - memoryRequired);
}

void DualCoreScheduler::updateMemorySnapshot(DualCoreScheduleResult& result, int currentTime) {
    MemorySnapshot snapshot;
    snapshot.time = currentTime;
    snapshot.usedMemory = currentMemory;
    snapshot.availableMemory = SYSTEM_RAM - currentMemory;
    result.memoryUsage.push_back(snapshot);
}

void DualCoreScheduler::updateAging(std::vector<Process*>& waitingProcesses, int agingThreshold) {
    for (auto* p : waitingProcesses) {
        if (p != nullptr) {
            p->incrementWaitingTicks();
            p->applyAging(agingThreshold);
        }
    }
}

void DualCoreScheduler::calculateUtilization(DualCoreScheduleResult& result) {
    int maxTime = std::max(result.core0.totalTime, result.core1.totalTime);
    result.cpuUtilization.clear();
    result.cpuUtilization.resize(maxTime + 1, 0.0);
    
    // Count busy cores at each time tick
    for (int t = 0; t <= maxTime; t++) {
        int busyCores = 0;
        
        // Check Core 0
        for (const auto& entry : result.core0.ganttChart) {
            if (t >= entry.startTime && t < entry.endTime) {
                busyCores++;
                break;
            }
        }
        
        // Check Core 1
        for (const auto& entry : result.core1.ganttChart) {
            if (t >= entry.startTime && t < entry.endTime) {
                busyCores++;
                break;
            }
        }
        
        result.cpuUtilization[t] = (busyCores / 2.0) * 100.0; // 2 cores total
    }
    
    // Calculate average CPU utilization
    double totalUtil = 0;
    for (double util : result.cpuUtilization) {
        totalUtil += util;
    }
    result.avgCpuUtilization = result.cpuUtilization.empty() ? 0 : 
                               totalUtil / result.cpuUtilization.size();
}

std::string toJSON(const DualCoreScheduleResult& result) {
    std::ostringstream json;
    json << std::fixed << std::setprecision(2);
    json << "{\n";
    
    // Core 0 results
    json << "  \"core0_results\": {\n";
    json << "    \"ganttChart\": [\n";
    for (size_t i = 0; i < result.core0.ganttChart.size(); i++) {
        json << "      {\"processId\": " << result.core0.ganttChart[i].processId
             << ", \"startTime\": " << result.core0.ganttChart[i].startTime
             << ", \"endTime\": " << result.core0.ganttChart[i].endTime << "}";
        if (i < result.core0.ganttChart.size() - 1) json << ",";
        json << "\n";
    }
    json << "    ],\n";
    json << "    \"processes\": [\n";
    for (size_t i = 0; i < result.core0.processes.size(); i++) {
        const auto& p = result.core0.processes[i];
        json << "      {\"id\": " << p.id
             << ", \"arrivalTime\": " << p.arrivalTime
             << ", \"burstTime\": " << p.burstTime
             << ", \"priority\": " << p.priority
             << ", \"memoryRequired\": " << p.memoryRequired
             << ", \"startTime\": " << p.startTime
             << ", \"completionTime\": " << p.completionTime
             << ", \"waitingTime\": " << p.waitingTime
             << ", \"turnaroundTime\": " << p.turnaroundTime
             << ", \"waitingTicks\": " << p.waitingTicks
             << ", \"isAged\": " << (p.isAged ? "true" : "false") << "}";
        if (i < result.core0.processes.size() - 1) json << ",";
        json << "\n";
    }
    json << "    ],\n";
    json << "    \"avgWaitingTime\": " << result.core0.avgWaitingTime << ",\n";
    json << "    \"avgTurnaroundTime\": " << result.core0.avgTurnaroundTime << ",\n";
    json << "    \"totalTime\": " << result.core0.totalTime << "\n";
    json << "  },\n";
    
    // Core 1 results
    json << "  \"core1_results\": {\n";
    json << "    \"ganttChart\": [\n";
    for (size_t i = 0; i < result.core1.ganttChart.size(); i++) {
        json << "      {\"processId\": " << result.core1.ganttChart[i].processId
             << ", \"startTime\": " << result.core1.ganttChart[i].startTime
             << ", \"endTime\": " << result.core1.ganttChart[i].endTime << "}";
        if (i < result.core1.ganttChart.size() - 1) json << ",";
        json << "\n";
    }
    json << "    ],\n";
    json << "    \"processes\": [\n";
    for (size_t i = 0; i < result.core1.processes.size(); i++) {
        const auto& p = result.core1.processes[i];
        json << "      {\"id\": " << p.id
             << ", \"arrivalTime\": " << p.arrivalTime
             << ", \"burstTime\": " << p.burstTime
             << ", \"priority\": " << p.priority
             << ", \"memoryRequired\": " << p.memoryRequired
             << ", \"startTime\": " << p.startTime
             << ", \"completionTime\": " << p.completionTime
             << ", \"waitingTime\": " << p.waitingTime
             << ", \"turnaroundTime\": " << p.turnaroundTime
             << ", \"waitingTicks\": " << p.waitingTicks
             << ", \"isAged\": " << (p.isAged ? "true" : "false") << "}";
        if (i < result.core1.processes.size() - 1) json << ",";
        json << "\n";
    }
    json << "    ],\n";
    json << "    \"avgWaitingTime\": " << result.core1.avgWaitingTime << ",\n";
    json << "    \"avgTurnaroundTime\": " << result.core1.avgTurnaroundTime << ",\n";
    json << "    \"totalTime\": " << result.core1.totalTime << "\n";
    json << "  },\n";
    
    // CPU Utilization
    json << "  \"cpuUtilization\": [\n";
    for (size_t i = 0; i < result.cpuUtilization.size(); i++) {
        json << "    " << result.cpuUtilization[i];
        if (i < result.cpuUtilization.size() - 1) json << ",";
        json << "\n";
    }
    json << "  ],\n";
    
    // Memory Usage
    json << "  \"memoryUsage\": [\n";
    for (size_t i = 0; i < result.memoryUsage.size(); i++) {
        json << "    {\"time\": " << result.memoryUsage[i].time
             << ", \"usedMemory\": " << result.memoryUsage[i].usedMemory
             << ", \"availableMemory\": " << result.memoryUsage[i].availableMemory << "}";
        if (i < result.memoryUsage.size() - 1) json << ",";
        json << "\n";
    }
    json << "  ],\n";
    json << "  \"avgCpuUtilization\": " << result.avgCpuUtilization << ",\n";
    json << "  \"contextSwitches\": " << result.contextSwitches << ",\n";
    json << "  \"totalTime\": " << result.totalTime << "\n";
    json << "}";
    return json.str();
}
