#ifndef DUALCOREFCFS_H
#define DUALCOREFCFS_H

#include "DualCoreScheduler.h"

class DualCoreFCFS : public DualCoreScheduler {
public:
    DualCoreFCFS(const std::vector<Process>& processes);
    DualCoreScheduleResult schedule() override;
};

#endif
