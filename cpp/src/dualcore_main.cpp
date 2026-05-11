#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include "DualCoreFCFS.h"
#include "DualCoreSJF.h"
#include "DualCoreRoundRobin.h"
#include "DualCorePriority.h"

std::vector<Process> parseInput(const std::string& input) {
    std::vector<Process> processes;
    std::istringstream iss(input);
    std::string line;
    
    while (std::getline(iss, line)) {
        if (line.empty()) continue;
        
        std::istringstream lineStream(line);
        int id, arrival, burst, priority = 0, memory = 0;
        
        if (lineStream >> id >> arrival >> burst) {
            lineStream >> priority;
            lineStream >> memory; // Optional memory
            processes.push_back(Process(id, arrival, burst, priority, memory));
        }
    }
    
    return processes;
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <algorithm> <timeQuantum> <process_data>" << std::endl;
        std::cerr << "Algorithms: DualCoreFCFS, DualCoreSJF, DualCoreRoundRobin, DualCorePriority" << std::endl;
        return 1;
    }
    
    std::string algorithm = argv[1];
    int timeQuantum = (argc > 2) ? std::stoi(argv[2]) : 2;
    std::string processData = (argc > 3) ? argv[3] : "";
    
    if (processData.empty()) {
        std::string line;
        while (std::getline(std::cin, line)) {
            processData += line + "\n";
        }
    }
    
    std::vector<Process> processes = parseInput(processData);
    
    if (processes.empty()) {
        std::cerr << "Error: No processes provided" << std::endl;
        return 1;
    }
    
    DualCoreScheduleResult result;
    DualCoreScheduler* scheduler = nullptr;
    
    if (algorithm == "DualCoreFCFS") {
        scheduler = new DualCoreFCFS(processes);
    } else if (algorithm == "DualCoreSJF") {
        scheduler = new DualCoreSJF(processes);
    } else if (algorithm == "DualCoreRoundRobin") {
        scheduler = new DualCoreRoundRobin(processes, timeQuantum);
    } else if (algorithm == "DualCorePriority") {
        scheduler = new DualCorePriority(processes);
    } else {
        std::cerr << "Error: Unknown algorithm: " << algorithm << std::endl;
        return 1;
    }
    
    result = scheduler->schedule();
    
    std::cout << toJSON(result) << std::endl;
    
    delete scheduler;
    return 0;
}
