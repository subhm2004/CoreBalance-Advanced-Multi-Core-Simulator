#include "RoundRobin.h"
#include <queue>
#include <algorithm>
#include <climits>

RoundRobin::RoundRobin(const std::vector<Process>& processes, int timeQuantum)
    : Scheduler(processes), timeQuantum(timeQuantum) {}

ScheduleResult RoundRobin::schedule() {
    ScheduleResult result;
    std::vector<Process> processList = processes;
    std::queue<int> readyQueue;
    std::vector<bool> inQueue(processes.size(), false);
    
    // Sort by arrival time
    std::sort(processList.begin(), processList.end(),
              [](const Process& a, const Process& b) {
                  return a.arrivalTime < b.arrivalTime;
              });
    
    int currentTime = 0;
    int completedCount = 0;
    
    // Initialize remaining time
    for (auto& p : processList) {
        p.remainingTime = p.burstTime;
    }
    
    // Add first process
    if (!processList.empty() && processList[0].arrivalTime <= currentTime) {
        readyQueue.push(0);
        inQueue[0] = true;
    }
    
    while (completedCount < processList.size()) {
        if (readyQueue.empty()) {
            // Find next arriving process
            int nextArrival = INT_MAX;
            int nextIndex = -1;
            for (size_t i = 0; i < processList.size(); i++) {
                if (processList[i].remainingTime > 0 && 
                    processList[i].arrivalTime < nextArrival) {
                    nextArrival = processList[i].arrivalTime;
                    nextIndex = i;
                }
            }
            if (nextIndex != -1) {
                currentTime = nextArrival;
                if (!inQueue[nextIndex]) {
                    readyQueue.push(nextIndex);
                    inQueue[nextIndex] = true;
                }
            }
            continue;
        }
        
        int currentIndex = readyQueue.front();
        readyQueue.pop();
        inQueue[currentIndex] = false;
        
        Process& p = processList[currentIndex];
        
        if (p.startTime == -1) {
            p.startTime = currentTime;
        }
        
        int executionTime = std::min(timeQuantum, p.remainingTime);
        int startExecution = currentTime;
        currentTime += executionTime;
        p.remainingTime -= executionTime;
        
        result.ganttChart.push_back({p.id, startExecution, currentTime});
        
        // Add newly arrived processes to queue
        for (size_t i = 0; i < processList.size(); i++) {
            if (processList[i].arrivalTime > startExecution && 
                processList[i].arrivalTime <= currentTime &&
                processList[i].remainingTime > 0 && !inQueue[i]) {
                readyQueue.push(i);
                inQueue[i] = true;
            }
        }
        
        if (p.remainingTime > 0) {
            // Process not completed, add back to queue
            readyQueue.push(currentIndex);
            inQueue[currentIndex] = true;
        } else {
            // Process completed
            p.completionTime = currentTime;
            p.calculateMetrics();
            completedCount++;
        }
    }
    
    result.processes = processList;
    result.totalTime = currentTime;
    calculateAverages(result);
    
    return result;
}
