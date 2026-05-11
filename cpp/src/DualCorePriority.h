#ifndef DUALCOREPRIORITY_H
#define DUALCOREPRIORITY_H

#include "DualCoreScheduler.h"

class DualCorePriority : public DualCoreScheduler {
public:
    DualCorePriority(const std::vector<Process>& processes);
    DualCoreScheduleResult schedule() override;
};

#endif
