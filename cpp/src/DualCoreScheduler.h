#ifndef DUALCORESCHEDULER_H
#define DUALCORESCHEDULER_H

#include "Scheduler.h"
#include <vector>
#include <string>

struct CoreResult {
    std::vector<GanttEntry> ganttChart;
    std::vector<Process> processes;
    double avgWaitingTime;
    double avgTurnaroundTime;
    int totalTime;
};

struct MemorySnapshot {
    int time;
    int usedMemory;  // Total memory used at this time
    int availableMemory;  // Available memory at this time
};

struct DualCoreScheduleResult {
    CoreResult core0;
    CoreResult core1;
    std::vector<double> cpuUtilization; // Percentage at each time tick
    std::vector<MemorySnapshot> memoryUsage; // Memory usage over time
    double avgCpuUtilization;
    int totalTime;
    int contextSwitches; // Total number of context switches
};

class DualCoreScheduler {
protected:
    std::vector<Process> processes;
    int timeQuantum;
    static const int SYSTEM_RAM = 1024; // Total system RAM in MB
    static const int CONTEXT_SWITCH_TIME = 1; // Context switch overhead in time units
    
    int currentMemory; // Current memory usage in MB
    int contextSwitchCount; // Count of context switches
    
    // Load balancer: returns 0 or 1 for core assignment
    int selectCore(const std::vector<int>& coreLoads);
    
    // Memory management
    bool canAllocateMemory(int memoryRequired);
    void allocateMemory(int memoryRequired);
    void deallocateMemory(int memoryRequired);
    void updateMemorySnapshot(DualCoreScheduleResult& result, int currentTime);
    
    // Aging logic
    void updateAging(std::vector<Process*>& waitingProcesses, int agingThreshold = 50);
    
    // Calculate CPU utilization at each time tick
    void calculateUtilization(DualCoreScheduleResult& result);
    
public:
    DualCoreScheduler(const std::vector<Process>& processes, int timeQuantum = 2);
    virtual DualCoreScheduleResult schedule() = 0;
    virtual ~DualCoreScheduler() = default;
};

// Standalone function to convert DualCoreScheduleResult to JSON
std::string toJSON(const DualCoreScheduleResult& result);

#endif
