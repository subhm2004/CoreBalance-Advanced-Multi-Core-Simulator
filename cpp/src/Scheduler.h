#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "Process.h"
#include <vector>
#include <string>

struct GanttEntry {
    int processId;
    int startTime;
    int endTime;
};

struct ScheduleResult {
    std::vector<GanttEntry> ganttChart;
    std::vector<Process> processes;
    double avgWaitingTime;
    double avgTurnaroundTime;
    int totalTime;
};

class Scheduler {
protected:
    std::vector<Process> processes;
    
public:
    Scheduler(const std::vector<Process>& processes);
    virtual ScheduleResult schedule() = 0;
    virtual ~Scheduler() = default;
    
protected:
    void calculateAverages(ScheduleResult& result);
};

// Standalone function to convert ScheduleResult to JSON
std::string toJSON(const ScheduleResult& result);

#endif // SCHEDULER_H
