#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include "FCFS.h"
#include "SJF.h"
#include "RoundRobin.h"
#include "Priority.h"
#include "Scheduler.h"

std::vector<Process> parseInput(const std::string& input) {
    std::vector<Process> processes;
    std::istringstream iss(input);
    std::string line;
    
    while (std::getline(iss, line)) {
        if (line.empty()) continue;
        
        std::istringstream lineStream(line);
        int id, arrival, burst, priority = 0;
        
        if (lineStream >> id >> arrival >> burst) {
            lineStream >> priority; // Optional priority
            processes.push_back(Process(id, arrival, burst, priority));
        }
    }
    
    return processes;
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <algorithm> <timeQuantum> <process_data>" << std::endl;
        std::cerr << "Algorithms: FCFS, SJF, RoundRobin, Priority" << std::endl;
        return 1;
    }
    
    std::string algorithm = argv[1];
    int timeQuantum = (argc > 2) ? std::stoi(argv[2]) : 2;
    std::string processData = (argc > 3) ? argv[3] : "";
    
    // Read from stdin if no process data provided
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
    
    ScheduleResult result;
    Scheduler* scheduler = nullptr;
    
    if (algorithm == "FCFS") {
        scheduler = new FCFS(processes);
    } else if (algorithm == "SJF") {
        scheduler = new SJF(processes);
    } else if (algorithm == "RoundRobin") {
        scheduler = new RoundRobin(processes, timeQuantum);
    } else if (algorithm == "Priority") {
        scheduler = new Priority(processes);
    } else {
        std::cerr << "Error: Unknown algorithm: " << algorithm << std::endl;
        return 1;
    }
    
    result = scheduler->schedule();
    
    // Output JSON
    std::cout << toJSON(result) << std::endl;
    
    delete scheduler;
    return 0;
}
