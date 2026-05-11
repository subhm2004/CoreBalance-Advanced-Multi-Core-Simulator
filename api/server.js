const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Paths to compiled C++ binaries
const SCHEDULER_BINARY = path.join(__dirname, '../cpp/build/bin/scheduler');
const DUALCORE_SCHEDULER_BINARY = path.join(__dirname, '../cpp/build/bin/dualcore_scheduler');
const GENERATOR_BINARY = path.join(__dirname, '../cpp/build/bin/generator');

// Helper function to execute single-core C++ binary
function executeScheduler(algorithm, timeQuantum, processes) {
    return new Promise((resolve, reject) => {
        const processData = processes
            .map(p => `${p.id} ${p.arrivalTime} ${p.burstTime} ${p.priority || 0} ${p.memoryRequired || 0}`)
            .join('\n');

        const schedulerProcess = spawn(SCHEDULER_BINARY, [
            algorithm,
            timeQuantum.toString(),
            processData
        ]);

        let stdout = '';
        let stderr = '';

        schedulerProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        schedulerProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        schedulerProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Scheduler process exited with code ${code}: ${stderr}`));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error.message}\nOutput: ${stdout}`));
            }
        });

        schedulerProcess.on('error', (error) => {
            reject(new Error(`Failed to start scheduler process: ${error.message}`));
        });
    });
}

// Helper function to execute dual-core C++ binary
function executeDualCoreScheduler(algorithm, timeQuantum, processes) {
    return new Promise((resolve, reject) => {
        const processData = processes
            .map(p => `${p.id} ${p.arrivalTime} ${p.burstTime} ${p.priority || 0} ${p.memoryRequired || 0}`)
            .join('\n');

        const schedulerProcess = spawn(DUALCORE_SCHEDULER_BINARY, [
            algorithm,
            timeQuantum.toString(),
            processData
        ]);

        let stdout = '';
        let stderr = '';

        schedulerProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        schedulerProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        schedulerProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Dual-core scheduler process exited with code ${code}: ${stderr}`));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error.message}\nOutput: ${stdout}`));
            }
        });

        schedulerProcess.on('error', (error) => {
            reject(new Error(`Failed to start dual-core scheduler process: ${error.message}`));
        });
    });
}

// Helper function to generate random processes
function generateRandomProcesses(count, seed = null) {
    return new Promise((resolve, reject) => {
        const args = [count.toString()];
        if (seed !== null) {
            args.push(seed.toString());
        }

        const generatorProcess = spawn(GENERATOR_BINARY, args);

        let stdout = '';
        let stderr = '';

        generatorProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        generatorProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        generatorProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Generator process exited with code ${code}: ${stderr}`));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error.message}\nOutput: ${stdout}`));
            }
        });

        generatorProcess.on('error', (error) => {
            reject(new Error(`Failed to start generator process: ${error.message}`));
        });
    });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Quantum Queue API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generateRandom: 'GET /api/generate-random?count=10',
      schedule: 'POST /api/schedule',
      scheduleDualCore: 'POST /api/schedule-dualcore',
      compare: 'POST /api/compare',
      compareDualCore: 'POST /api/compare-dualcore'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Scheduler API is running' });
});

// Main scheduling endpoint
app.post('/api/schedule', async (req, res) => {
    try {
        const { algorithm, timeQuantum = 2, processes } = req.body;

        if (!algorithm || !processes || !Array.isArray(processes)) {
            return res.status(400).json({
                error: 'Invalid request. Required: algorithm (string), processes (array)'
            });
        }

        const validAlgorithms = ['FCFS', 'SJF', 'RoundRobin', 'Priority'];
        if (!validAlgorithms.includes(algorithm)) {
            return res.status(400).json({
                error: `Invalid algorithm. Must be one of: ${validAlgorithms.join(', ')}`
            });
        }

        // Validate processes
        for (const p of processes) {
            if (typeof p.id !== 'number' ||
                typeof p.arrivalTime !== 'number' ||
                typeof p.burstTime !== 'number') {
                return res.status(400).json({
                    error: 'Each process must have: id (number), arrivalTime (number), burstTime (number)'
                });
            }
        }

        const result = await executeScheduler(algorithm, timeQuantum, processes);
        res.json(result);
    } catch (error) {
        console.error('Scheduling error:', error);
        res.status(500).json({
            error: 'Failed to execute scheduling algorithm',
            message: error.message
        });
    }
});

// Generate random processes endpoint
app.get('/api/generate-random', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 10;
        const seed = req.query.seed ? parseInt(req.query.seed) : null;

        if (count < 1 || count > 100) {
            return res.status(400).json({
                error: 'Count must be between 1 and 100'
            });
        }

        const processes = await generateRandomProcesses(count, seed);
        res.json(processes);
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate random processes',
            message: error.message
        });
    }
});

// Dual-core scheduling endpoint
app.post('/api/schedule-dualcore', async (req, res) => {
    try {
        const { algorithm, timeQuantum = 2, processes } = req.body;

        if (!algorithm || !processes || !Array.isArray(processes)) {
            return res.status(400).json({
                error: 'Invalid request. Required: algorithm (string), processes (array)'
            });
        }

        const validAlgorithms = ['DualCoreFCFS', 'DualCoreSJF', 'DualCoreRoundRobin', 'DualCorePriority'];
        if (!validAlgorithms.includes(algorithm)) {
            return res.status(400).json({
                error: `Invalid algorithm. Must be one of: ${validAlgorithms.join(', ')}`
            });
        }

        const result = await executeDualCoreScheduler(algorithm, timeQuantum, processes);
        res.json(result);
    } catch (error) {
        console.error('Dual-core scheduling error:', error);
        res.status(500).json({
            error: 'Failed to execute dual-core scheduling algorithm',
            message: error.message
        });
    }
});

// Compare multiple algorithms (dual-core)
app.post('/api/compare-dualcore', async (req, res) => {
    try {
        const { timeQuantum = 2, processes } = req.body;

        if (!processes || !Array.isArray(processes)) {
            return res.status(400).json({
                error: 'Invalid request. Required: processes (array)'
            });
        }

        const algorithms = ['DualCoreFCFS', 'DualCoreSJF', 'DualCoreRoundRobin', 'DualCorePriority'];
        const results = {};

        for (const algorithm of algorithms) {
            try {
                const result = await executeDualCoreScheduler(algorithm, timeQuantum, processes);
                results[algorithm] = result;
            } catch (error) {
                console.error(`Error executing ${algorithm}:`, error);
                results[algorithm] = { error: error.message };
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Dual-core comparison error:', error);
        res.status(500).json({
            error: 'Failed to compare dual-core algorithms',
            message: error.message
        });
    }
});

// Compare multiple algorithms (single-core - kept for backward compatibility)
app.post('/api/compare', async (req, res) => {
    try {
        const { timeQuantum = 2, processes } = req.body;

        if (!processes || !Array.isArray(processes)) {
            return res.status(400).json({
                error: 'Invalid request. Required: processes (array)'
            });
        }

        const algorithms = ['FCFS', 'SJF', 'RoundRobin', 'Priority'];
        const results = {};

        for (const algorithm of algorithms) {
            try {
                const result = await executeScheduler(algorithm, timeQuantum, processes);
                results[algorithm] = result;
            } catch (error) {
                console.error(`Error executing ${algorithm}:`, error);
                results[algorithm] = { error: error.message };
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Comparison error:', error);
        res.status(500).json({
            error: 'Failed to compare algorithms',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Scheduler API server running on port ${PORT}`);
    console.log(`📊 Binary location: ${SCHEDULER_BINARY}`);
});
