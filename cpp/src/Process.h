#ifndef PROCESS_H
#define PROCESS_H

#include <string>

class Process {
public:
    int id;
    int arrivalTime;
    int burstTime;
    int priority;
    int memoryRequired;  // Memory required in MB
    int remainingTime;
    int startTime;
    int completionTime;
    int waitingTime;
    int turnaroundTime;
    int waitingTicks;    // Ticks spent waiting
    bool isAged;         // True if priority was boosted due to aging

    Process(int id, int arrivalTime, int burstTime, int priority = 0, int memoryRequired = 0);
    void calculateMetrics();
    void incrementWaitingTicks();
    void applyAging(int agingThreshold = 50);
};

#endif
