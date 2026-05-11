cmake_minimum_required(VERSION 3.10)
project(ProcessScheduler)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Common source files
set(COMMON_SOURCES
    src/Process.cpp
    src/Scheduler.cpp
    src/FCFS.cpp
    src/SJF.cpp
    src/RoundRobin.cpp
    src/Priority.cpp
)

# Dual-core source files
set(DUALCORE_SOURCES
    ${COMMON_SOURCES}
    src/DualCoreScheduler.cpp
    src/DualCoreFCFS.cpp
    src/DualCoreSJF.cpp
    src/DualCoreRoundRobin.cpp
    src/DualCorePriority.cpp
)

# Include directories
include_directories(${CMAKE_SOURCE_DIR})

# Original single-core scheduler
add_executable(scheduler
    ${COMMON_SOURCES}
    src/main.cpp
)

# Dual-core scheduler
add_executable(dualcore_scheduler
    ${DUALCORE_SOURCES}
    src/dualcore_main.cpp
)

# Process generator
add_executable(generator
    src/Process.cpp
    src/ProcessGenerator.cpp
    src/generator_main.cpp
)

# Set output directories
set_target_properties(scheduler dualcore_scheduler generator PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
