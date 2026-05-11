#include "Scheduler.h"
#include <sstream>
#include <iomanip>
#include <algorithm>

Scheduler::Scheduler(const std::vector<Process>& processes) : processes(processes) {}

void Scheduler::calculateAverages(ScheduleResult& result) {
    double totalWaiting = 0, totalTurnaround = 0;
    for (const auto& p : result.processes) {
        totalWaiting += p.waitingTime;
        totalTurnaround += p.turnaroundTime;
    }
    result.avgWaitingTime = result.processes.empty() ? 0 : totalWaiting / result.processes.size();
    result.avgTurnaroundTime = result.processes.empty() ? 0 : totalTurnaround / result.processes.size();
}

std::string toJSON(const ScheduleResult& result) {
    std::ostringstream json;
    json << std::fixed << std::setprecision(2);
    json << "{\n";
    json << "  \"ganttChart\": [\n";
    for (size_t i = 0; i < result.ganttChart.size(); i++) {
        json << "    {\"processId\": " << result.ganttChart[i].processId
             << ", \"startTime\": " << result.ganttChart[i].startTime
             << ", \"endTime\": " << result.ganttChart[i].endTime << "}";
        if (i < result.ganttChart.size() - 1) json << ",";
        json << "\n";
    }
    json << "  ],\n";
    json << "  \"processes\": [\n";
    for (size_t i = 0; i < result.processes.size(); i++) {
        const auto& p = result.processes[i];
        json << "    {\"id\": " << p.id
             << ", \"arrivalTime\": " << p.arrivalTime
             << ", \"burstTime\": " << p.burstTime
             << ", \"priority\": " << p.priority
             << ", \"startTime\": " << p.startTime
             << ", \"completionTime\": " << p.completionTime
             << ", \"waitingTime\": " << p.waitingTime
             << ", \"turnaroundTime\": " << p.turnaroundTime << "}";
        if (i < result.processes.size() - 1) json << ",";
        json << "\n";
    }
    json << "  ],\n";
    json << "  \"avgWaitingTime\": " << result.avgWaitingTime << ",\n";
    json << "  \"avgTurnaroundTime\": " << result.avgTurnaroundTime << ",\n";
    json << "  \"totalTime\": " << result.totalTime << "\n";
    json << "}";
    return json.str();
}
