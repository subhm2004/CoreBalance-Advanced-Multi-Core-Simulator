#include "ProcessGenerator.h"
#include <sstream>
#include <iomanip>

ProcessGenerator::ProcessGenerator(unsigned int seed) : rng(seed) {}

std::vector<Process> ProcessGenerator::generateRandom(int count, int minArrival, int maxArrival,
                                                      int minBurst, int maxBurst,
                                                      int minPriority, int maxPriority) {
    std::vector<Process> processes;
    std::uniform_int_distribution<int> arrivalDist(minArrival, maxArrival);
    std::uniform_int_distribution<int> burstDist(minBurst, maxBurst);
    std::uniform_int_distribution<int> priorityDist(minPriority, maxPriority);
    std::uniform_int_distribution<int> memoryDist(50, 200); // Memory between 50-200 MB
    
    for (int i = 1; i <= count; i++) {
        int arrival = arrivalDist(rng);
        int burst = burstDist(rng);
        int priority = priorityDist(rng);
        int memory = memoryDist(rng);
        processes.push_back(Process(i, arrival, burst, priority, memory));
    }
    
    return processes;
}

std::string ProcessGenerator::toJSON(const std::vector<Process>& processes) {
    std::ostringstream json;
    json << "[\n";
    for (size_t i = 0; i < processes.size(); i++) {
        const auto& p = processes[i];
        json << "  {\"id\": " << p.id
             << ", \"arrivalTime\": " << p.arrivalTime
             << ", \"burstTime\": " << p.burstTime
             << ", \"priority\": " << p.priority
             << ", \"memoryRequired\": " << p.memoryRequired << "}";
        if (i < processes.size() - 1) json << ",";
        json << "\n";
    }
    json << "]";
    return json.str();
}
