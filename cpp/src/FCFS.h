#ifndef FCFS_H
#define FCFS_H

#include "Scheduler.h"

class FCFS : public Scheduler {
public:
    FCFS(const std::vector<Process>& processes);
    ScheduleResult schedule() override;
};

#endif
