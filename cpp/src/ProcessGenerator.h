#ifndef PROCESSGENERATOR_H
#define PROCESSGENERATOR_H

#include "Process.h"
#include <vector>
#include <random>

class ProcessGenerator {
private:
    std::mt19937 rng;
    
public:
    ProcessGenerator(unsigned int seed = std::random_device{}());
    std::vector<Process> generateRandom(int count, int minArrival = 0, int maxArrival = 20, 
                                       int minBurst = 1, int maxBurst = 15, 
                                       int minPriority = 1, int maxPriority = 5);
    std::string toJSON(const std::vector<Process>& processes);
};

#endif
