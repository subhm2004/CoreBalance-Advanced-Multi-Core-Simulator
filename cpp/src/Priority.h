#ifndef PRIORITY_H
#define PRIORITY_H

#include "Scheduler.h"

class Priority : public Scheduler {
public:
    Priority(const std::vector<Process>& processes);
    ScheduleResult schedule() override;
};

#endif
