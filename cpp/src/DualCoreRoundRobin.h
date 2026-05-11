#ifndef DUALCOREROUNDROBIN_H
#define DUALCOREROUNDROBIN_H

#include "DualCoreScheduler.h"

class DualCoreRoundRobin : public DualCoreScheduler {
public:
    DualCoreRoundRobin(const std::vector<Process>& processes, int timeQuantum);
    DualCoreScheduleResult schedule() override;
};

#endif
