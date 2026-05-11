#ifndef DUALCORESJF_H
#define DUALCORESJF_H

#include "DualCoreScheduler.h"

class DualCoreSJF : public DualCoreScheduler {
public:
    DualCoreSJF(const std::vector<Process>& processes);
    DualCoreScheduleResult schedule() override;
};

#endif
