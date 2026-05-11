#ifndef SJF_H
#define SJF_H

#include "Scheduler.h"

class SJF : public Scheduler {
public:
    SJF(const std::vector<Process>& processes);
    ScheduleResult schedule() override;
};

#endif
