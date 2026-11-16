#!/usr/bin/env node
/**
 * ROYAL SCOUT — Unified Application Launcher & System Integration
 * Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence
 * 
 * Provides single-command orchestration:
 *   npm run start   - Start complete integrated production application on http://localhost:8000
 *   npm run dev     - Start development environment with hot reloading (API: 8000, UI: 5173)
 *   npm run stop    - Gracefully terminate all application processes and free ports
 */

import { spawn, execSync, exec } from 'child_process';
import http from 'http';
import net from 'net';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const EXPORTS_DIR = path.join(ROOT_DIR, 'exports');
const PID_FILE = path.join(ROOT_DIR, '.royal_scout.pid');

const IS_WINDOWS = os.platform() === 'win32';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '8000', 10);
const DEV_PORT = parseInt(process.env.DEV_PORT || '5173', 10);
const AUTO_OPEN = process.env.BROWSER_AUTO_OPEN !== 'false';

// Child process tracker
const activeProcesses = [];
let isShuttingDown = false;

// ANSI Colors
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  pink: '\x1b[38;2;232;62;140m', // Rajasthan Royals Pink (#E83E8C)
  navy: '\x1b[38;2;20;33;61m',   // Deep Navy (#14213D)
  blue: '\x1b[38;2;23;78;166m',  // Royal Blue (#174EA6)
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function logHeader() {
  console.log(`\n${C.pink}==================================================${C.reset}`);
  console.log(`${C.bold}${C.pink}             ROYAL SCOUT${C.reset}`);
  console.log(`${C.blue}      Cricket Intelligence Platform${C.reset}`);
  console.log(`${C.dim} Rajasthan Royals | SupeRR Selector Season 2${C.reset}`);
  console.log(`${C.pink}==================================================${C.reset}\n`);
}

function logStep(step, total, message) {
  console.log(`${C.pink}[${step}/${total}]${C.reset} ${C.bold}${message}${C.reset}`);
}

function logSuccess(message) {
  console.log(`    ${C.green}✓${C.reset} ${message}`);
}

function logInfo(message) {
  console.log(`    ${C.cyan}ℹ${C.reset} ${message}`);
}

function logWarning(message) {
  console.log(`    ${C.yellow}⚠${C.reset} ${message}`);
}

function logError(message) {
  console.error(`    ${C.red}✗ Error:${C.reset} ${message}`);
}

// Check if a port is in use
function checkPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port, '127.0.0.1');
  });
}

// HTTP Health query helper
function queryHealth(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, { timeout: 1500 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: res.statusCode === 200, data: json });
        } catch {
          resolve({ ok: false, data: null });
        }
      });
    });
    req.on('error', () => resolve({ ok: false, data: null }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, data: null });
    });
  });
}

// Kill process and all its children safely
function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (IS_WINDOWS) {
      execSync(`taskkill /F /T /PID ${pid} 2>nul`);
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    // Process might have already exited
  }
}

// Clean shutdown handler
function cleanShutdown(exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${C.pink}==================================================${C.reset}`);
  console.log(`${C.bold}${C.pink}          SHUTTING DOWN ROYAL SCOUT...${C.reset}`);
  console.log(`${C.pink}==================================================${C.reset}`);

  // Kill tracked child processes
  for (const proc of activeProcesses) {
    if (proc && proc.pid) {
      logInfo(`Terminating process PID ${proc.pid}...`);
      killProcessTree(proc.pid);
    }
  }

  // Remove PID file
  if (fs.existsSync(PID_FILE)) {
    try {
      fs.unlinkSync(PID_FILE);
    } catch {}
  }

  logSuccess('All services stopped cleanly. Ports released.');
  process.exit(exitCode);
}

// Handle signals
process.on('SIGINT', () => cleanShutdown(0));
process.on('SIGTERM', () => cleanShutdown(0));
process.on('uncaughtException', (err) => {
  logError(`Uncaught exception: ${err.message}`);
  cleanShutdown(1);
});

// Open browser helper
function openBrowser(url) {
  if (!AUTO_OPEN) return;
  console.log(`\n${C.pink}==================================================${C.reset}`);
  console.log(`${C.bold}${C.pink}Opening ROYAL SCOUT in your browser...${C.reset}`);
  console.log(`${C.pink}==================================================${C.reset}\n`);

  try {
    if (IS_WINDOWS) {
      exec(`start "" "${url}"`);
    } else if (os.platform() === 'darwin') {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
  } catch (err) {
    logWarning(`Could not open browser automatically: ${err.message}`);
    console.log(`Please open manually: ${C.cyan}${url}${C.reset}`);
  }
}

// Command: STOP
async function handleStopCommand() {
  logHeader();
  console.log(`${C.bold}Stopping any running ROYAL SCOUT instances...${C.reset}\n`);

  let stoppedAny = false;

  // 1. Read PID file if available
  if (fs.existsSync(PID_FILE)) {
    try {
      const data = fs.readFileSync(PID_FILE, 'utf8');
      const pids = JSON.parse(data);
      for (const pid of pids) {
        logInfo(`Stopping tracked process ${pid}...`);
        killProcessTree(pid);
        stoppedAny = true;
      }
      fs.unlinkSync(PID_FILE);
    } catch {}
  }

  // 2. Check if port 8000 is still active
  const port8000InUse = await checkPortInUse(PORT);
  if (port8000InUse) {
    const health = await queryHealth(PORT);
    if (health.ok) {
      logInfo(`Found active ROYAL SCOUT backend on port ${PORT}. Stopping...`);
      if (IS_WINDOWS) {
        try {
          const out = execSync(`netstat -ano | findstr :${PORT} | findstr LISTENING`).toString();
          const match = out.match(/\s+(\d+)\s*$/m);
          if (match && match[1]) {
            killProcessTree(parseInt(match[1], 10));
            stoppedAny = true;
          }
        } catch {}
      }
    }
  }

  // 3. Check dev port 5173
  const portDevInUse = await checkPortInUse(DEV_PORT);
  if (portDevInUse && IS_WINDOWS) {
    try {
      const out = execSync(`netstat -ano | findstr :${DEV_PORT} | findstr LISTENING`).toString();
      const match = out.match(/\s+(\d+)\s*$/m);
      if (match && match[1]) {
        killProcessTree(parseInt(match[1], 10));
        stoppedAny = true;
      }
    } catch {}
  }

  console.log(`\n${C.green}==================================================${C.reset}`);
  if (stoppedAny) {
    logSuccess('ROYAL SCOUT has been stopped successfully.');
  } else {
    logInfo('No active ROYAL SCOUT processes were running.');
  }
  console.log(`${C.green}==================================================${C.reset}\n`);
  process.exit(0);
}

// Find working Python executable
function getPythonCommand() {
  const candidates = [
    path.join(ROOT_DIR, '.venv', 'Scripts', 'python.exe'),
    path.join(ROOT_DIR, 'venv', 'Scripts', 'python.exe'),
    path.join(BACKEND_DIR, 'venv', 'Scripts', 'python.exe'),
    'python',
    'python3'
  ];

  for (const cmd of candidates) {
    try {
      const out = execSync(`"${cmd}" --version 2>&1`, { stdio: 'pipe' }).toString();
      if (out.includes('Python')) {
        return cmd;
      }
    } catch {}
  }
  return null;
}

// MAIN LAUNCHER FUNCTION
async function runLauncher(mode = 'start') {
  logHeader();
  const isDev = mode === 'dev';
  const TOTAL_STEPS = 8;

  // STEP 1: System requirements & Port verification
  logStep(1, TOTAL_STEPS, 'Checking system requirements...');
  logInfo(`Operating System: ${os.type()} ${os.release()} (${os.arch()})`);
  logInfo(`Node.js Version: ${process.version}`);

  const port8000InUse = await checkPortInUse(PORT);
  if (port8000InUse) {
    // Check if it's already ROYAL SCOUT
    const health = await queryHealth(PORT);
    if (health.ok) {
      console.log(`\n${C.yellow}==================================================${C.reset}`);
      logWarning(`ROYAL SCOUT is ALREADY RUNNING and healthy on port ${PORT}!`);
      console.log(`${C.yellow}==================================================${C.reset}\n`);
      console.log(`  Backend:     ${C.cyan}http://localhost:${PORT}${C.reset}`);
      console.log(`  Application: ${C.cyan}http://localhost:${PORT}${C.reset}\n`);
      logInfo('Opening your browser to the active session...');
      openBrowser(`http://localhost:${PORT}`);
      console.log(`${C.dim}To restart or stop the server, run: npm run stop${C.reset}\n`);
      process.exit(0);
    } else {
      logError(`Port ${PORT} is occupied by another application!`);
      console.log(`    Please free port ${PORT} or run 'npm run stop' before starting.\n`);
      process.exit(1);
    }
  }

  if (isDev) {
    const devPortInUse = await checkPortInUse(DEV_PORT);
    if (devPortInUse) {
      logError(`Development port ${DEV_PORT} is already occupied!`);
      process.exit(1);
    }
  }
  logSuccess(`Network ports available (Backend: ${PORT}${isDev ? `, Dev UI: ${DEV_PORT}` : ''})`);

  // STEP 2: Python environment & package check
  logStep(2, TOTAL_STEPS, 'Checking Python environment...');
  const pythonCmd = getPythonCommand();
  if (!pythonCmd) {
    logError('Python 3.9+ was not found on your system PATH!');
    console.log('    Please install Python from https://www.python.org/ or add it to PATH.');
    process.exit(1);
  }
  const pyVer = execSync(`"${pythonCmd}" --version`).toString().trim();
  logSuccess(`Found Python interpreter: ${pyVer} (${pythonCmd})`);

  // Check required Python dependencies
  try {
    execSync(`"${pythonCmd}" -c "import fastapi, uvicorn, pandas, numpy, reportlab, matplotlib"`, { stdio: 'pipe' });
    logSuccess('All required Python packages verified (FastAPI, Pandas, NumPy, ReportLab).');
  } catch {
    logWarning('Some required Python packages are missing. Attempting automatic installation...');
    try {
      const reqPath = path.join(BACKEND_DIR, 'requirements.txt');
      execSync(`"${pythonCmd}" -m pip install -r "${reqPath}"`, { stdio: 'inherit' });
      logSuccess('Python dependencies installed successfully.');
    } catch (e) {
      logError(`Failed to auto-install Python requirements: ${e.message}`);
      process.exit(1);
    }
  }

  // STEP 3: Node.js & Frontend dependencies
  logStep(3, TOTAL_STEPS, 'Checking Node.js dependencies...');
  const nodeModulesPath = path.join(FRONTEND_DIR, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    logWarning('frontend/node_modules not found. Installing frontend dependencies...');
    try {
      execSync('npm install --prefix frontend', { stdio: 'inherit', cwd: ROOT_DIR });
      logSuccess('Frontend dependencies installed cleanly.');
    } catch (e) {
      logError(`Failed to install frontend dependencies: ${e.message}`);
      process.exit(1);
    }
  } else {
    logSuccess('Frontend node_modules verified.');
  }

  // STEP 4: Environment configuration
  logStep(4, TOTAL_STEPS, 'Loading environment configuration...');
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    logInfo('Loaded custom configuration from .env');
  } else {
    logInfo(`Using default settings: Host=${HOST}, Port=${PORT}, Mode=${isDev ? 'Development' : 'Integrated Production'}`);
  }
  logSuccess('Configuration loaded.');

  // STEP 5: Dataset availability
  logStep(5, TOTAL_STEPS, 'Checking dataset availability...');
  const requiredFiles = [
    'ball_by_ball.csv',
    'matches.csv',
    'competitions.csv',
    'teams.csv',
    'playing_eleven.csv',
    'competition_team_player_mapping.csv'
  ];

  let missingFiles = [];
  for (const f of requiredFiles) {
    if (!fs.existsSync(path.join(DATA_DIR, f))) {
      missingFiles.push(f);
    }
  }

  if (missingFiles.length > 0) {
    logWarning(`Dataset files missing: ${missingFiles.join(', ')}`);
    logInfo('ROYAL SCOUT will launch in upload-ready mode.');
    logInfo('You can upload the competition ZIP directly through the UI or place CSVs into the data/ directory.');
  } else {
    const bbbStats = fs.statSync(path.join(DATA_DIR, 'ball_by_ball.csv'));
    const bbbMb = (bbbStats.size / (1024 * 1024)).toFixed(1);
    logSuccess(`All 6 competition datasets detected (${bbbMb} MB ball-by-ball records).`);
  }

  // STEP 6: Start FastAPI backend
  logStep(6, TOTAL_STEPS, 'Starting FastAPI backend...');
  const backendProc = spawn(pythonCmd, ['-m', 'uvicorn', 'app:app', '--host', HOST, '--port', PORT.toString()], {
    cwd: BACKEND_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false
  });

  activeProcesses.push(backendProc);

  backendProc.stdout.on('data', (d) => {
    const text = d.toString();
    if (process.env.DEBUG) process.stdout.write(text);
  });
  backendProc.stderr.on('data', (d) => {
    const text = d.toString();
    if (process.env.DEBUG) process.stderr.write(text);
  });

  backendProc.on('exit', (code) => {
    if (!isShuttingDown && code !== 0) {
      logError(`Backend process terminated unexpectedly with exit code ${code}`);
      cleanShutdown(code || 1);
    }
  });

  logSuccess(`FastAPI backend spawned on PID ${backendProc.pid} (${HOST}:${PORT})`);

  // STEP 7: React Frontend preparation / startup
  logStep(7, TOTAL_STEPS, isDev ? 'Starting React frontend (Vite dev server)...' : 'Verifying production frontend build...');
  
  let frontendProc = null;
  if (isDev) {
    // Development mode with hot reloading
    const npmCmd = IS_WINDOWS ? 'npm.cmd' : 'npm';
    frontendProc = spawn(npmCmd, ['run', 'dev'], {
      cwd: FRONTEND_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false
    });

    activeProcesses.push(frontendProc);
    logSuccess(`Vite dev server spawned on PID ${frontendProc.pid} (port ${DEV_PORT})`);
  } else {
    // Production integrated mode: Verify dist build exists
    const distIndex = path.join(FRONTEND_DIR, 'dist', 'index.html');
    if (!fs.existsSync(distIndex)) {
      logWarning('Compiled frontend build not found. Building now with Vite...');
      try {
        execSync('npm run build', { cwd: FRONTEND_DIR, stdio: 'inherit' });
        logSuccess('Frontend built successfully.');
      } catch (be) {
        logError(`Frontend build failed: ${be.message}`);
        cleanShutdown(1);
      }
    } else {
      logSuccess('Compiled production frontend verified in frontend/dist/');
    }
    logSuccess(`FastAPI is configured to serve the compiled React SPA directly on port ${PORT}.`);
  }

  // Save PIDs for 'npm run stop'
  const pidsToTrack = activeProcesses.map(p => p.pid).filter(Boolean);
  try {
    fs.writeFileSync(PID_FILE, JSON.stringify(pidsToTrack, null, 2), 'utf8');
  } catch {}

  // STEP 8: Application Health Check polling
  logStep(8, TOTAL_STEPS, 'Checking application health...');
  process.stdout.write('    Waiting for backend analytics engine to be ready...');

  const startTime = Date.now();
  const TIMEOUT_MS = 60000; // 60s max
  let isHealthy = false;
  let healthInfo = null;

  while (Date.now() - startTime < TIMEOUT_MS) {
    const health = await queryHealth(PORT);
    if (health.ok) {
      isHealthy = true;
      healthInfo = health.data;
      break;
    }
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 600));
  }
  console.log('');

  if (!isHealthy) {
    logError('Health check timed out waiting for backend to respond.');
    cleanShutdown(1);
  }

  logSuccess(`Backend is healthy! Status: ${healthInfo?.status || 'online'}`);
  if (healthInfo?.analytics_engine?.status === 'computed') {
    logSuccess(`Analytics Engine Ready: ${healthInfo.analytics_engine.eligible_batters} Batters, ${healthInfo.analytics_engine.eligible_bowlers} Bowlers ranked.`);
  }

  // Display READY banner
  const appUrl = isDev ? `http://localhost:${DEV_PORT}` : `http://localhost:${PORT}`;
  const apiUrl = `http://${HOST}:${PORT}`;
  const docsUrl = `http://${HOST}:${PORT}/docs`;

  console.log(`\n${C.green}==================================================${C.reset}`);
  console.log(`${C.bold}${C.green}          ROYAL SCOUT IS READY!${C.reset}`);
  console.log(`${C.green}==================================================${C.reset}\n`);

  console.log(`  ${C.bold}Backend API:${C.reset}`);
  console.log(`  ${C.cyan}${apiUrl}${C.reset}\n`);

  console.log(`  ${C.bold}API Documentation (Swagger):${C.reset}`);
  console.log(`  ${C.cyan}${docsUrl}${C.reset}\n`);

  if (isDev) {
    console.log(`  ${C.bold}Frontend (Vite Dev Server with HMR):${C.reset}`);
    console.log(`  ${C.cyan}http://localhost:${DEV_PORT}${C.reset}\n`);
  }

  console.log(`  ${C.bold}Application:${C.reset}`);
  console.log(`  ${C.bold}${C.pink}${appUrl}${C.reset}\n`);

  console.log(`${C.dim}--------------------------------------------------${C.reset}`);
  console.log(`  ${C.dim}• Press ${C.bold}Ctrl+C${C.dim} in this terminal to stop all services.${C.reset}`);
  console.log(`  ${C.dim}• Or run ${C.bold}npm run stop${C.dim} from another terminal.${C.reset}`);
  console.log(`${C.dim}--------------------------------------------------${C.reset}\n`);

  // Open in default browser
  openBrowser(appUrl);
}

// Entrypoint dispatcher
const command = process.argv[2] || 'start';

if (command === 'stop') {
  handleStopCommand();
} else if (command === 'dev') {
  runLauncher('dev');
} else {
  runLauncher('start');
}
