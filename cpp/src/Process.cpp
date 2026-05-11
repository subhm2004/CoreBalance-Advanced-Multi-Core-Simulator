#include "Process.h"

Process::Process(int id, int arrivalTime, int burstTime, int priority, int memoryRequired)
    : id(id), arrivalTime(arrivalTime), burstTime(burstTime), priority(priority),
      memoryRequired(memoryRequired), remainingTime(burstTime), startTime(-1), 
      completionTime(-1), waitingTime(0), turnaroundTime(0), waitingTicks(0), isAged(false) {}

void Process::calculateMetrics() {
    if (completionTime != -1 && startTime != -1) {
        turnaroundTime = completionTime - arrivalTime;
        waitingTime = turnaroundTime - burstTime;
    }
}

void Process::incrementWaitingTicks() {
    waitingTicks++;
}

void Process::applyAging(int agingThreshold) {
    if (waitingTicks > agingThreshold && !isAged) {
        // Boost priority (lower number = higher priority, so decrease priority value)
        if (priority > 0) {
            priority = priority > 1 ? priority - 1 : 0;
        }
        isAged = true;
    }
}
