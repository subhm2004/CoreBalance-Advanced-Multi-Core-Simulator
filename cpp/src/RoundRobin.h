#ifndef ROUNDROBIN_H
#define ROUNDROBIN_H

#include "Scheduler.h"

class RoundRobin : public Scheduler {
private:
    int timeQuantum;
    
public:
    RoundRobin(const std::vector<Process>& processes, int timeQuantum);
    ScheduleResult schedule() override;
};

#endif
