#include <iostream>
#include "ProcessGenerator.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <count> [seed]" << std::endl;
        return 1;
    }
    
    int count = std::stoi(argv[1]);
    unsigned int seed = (argc > 2) ? std::stoul(argv[2]) : std::random_device{}();
    
    ProcessGenerator generator(seed);
    std::vector<Process> processes = generator.generateRandom(count);
    
    std::cout << generator.toJSON(processes) << std::endl;
    return 0;
}
