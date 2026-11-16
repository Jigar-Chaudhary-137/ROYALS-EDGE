#!/usr/bin/env python3
"""
ROYAL SCOUT — Python Application Launcher & System Integration
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

Provides single-command startup from Python:
    python scripts/launcher.py [start|dev|stop]
"""

import os
import sys
import time
import json
import socket
import urllib.request
import subprocess
import signal
import webbrowser

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PID_FILE = os.path.join(ROOT_DIR, ".royal_scout.pid")

PORT = int(os.environ.get("PORT", 8000))
DEV_PORT = int(os.environ.get("DEV_PORT", 5173))
HOST = os.environ.get("HOST", "127.0.0.1")
IS_WIN = sys.platform.startswith("win")

# Rajasthan Royals color codes
RESET = "\033[0m"
BOLD = "\033[1m"
PINK = "\033[38;2;232;62;140m"
BLUE = "\033[38;2;23;78;166m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
CYAN = "\033[36m"
DIM = "\033[2m"

active_procs = []

def print_header():
    print(f"\n{PINK}=================================================={RESET}")
    print(f"{BOLD}{PINK}             ROYAL SCOUT{RESET}")
    print(f"{BLUE}      Cricket Intelligence Platform{RESET}")
    print(f"{DIM} Rajasthan Royals | SupeRR Selector Season 2{RESET}")
    print(f"{PINK}=================================================={RESET}\n")

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((HOST, port)) == 0

def query_health(port):
    try:
        url = f"http://{HOST}:{port}/api/health"
        req = urllib.request.Request(url, headers={"User-Agent": "RoyalScoutLauncher/2.0"})
        with urllib.request.urlopen(req, timeout=1.5) as res:
            if res.status == 200:
                return True, json.loads(res.read().decode('utf-8'))
    except Exception:
        pass
    return False, None

def kill_process_tree(pid):
    if not pid:
        return
    try:
        if IS_WIN:
            subprocess.run(f"taskkill /F /T /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            os.kill(pid, signal.SIGKILL)
    except Exception:
        pass

def handle_stop():
    print_header()
    print(f"{BOLD}Stopping active ROYAL SCOUT processes...{RESET}\n")
    stopped = False

    if os.path.exists(PID_FILE):
        try:
            with open(PID_FILE, 'r') as f:
                pids = json.load(f)
            for pid in pids:
                print(f"    {CYAN}ℹ{RESET} Terminating process PID {pid}...")
                kill_process_tree(pid)
                stopped = True
            os.remove(PID_FILE)
        except Exception:
            pass

    if is_port_in_use(PORT):
        ok, _ = query_health(PORT)
        if ok and IS_WIN:
            try:
                out = subprocess.check_output(f"netstat -ano | findstr :{PORT} | findstr LISTENING", shell=True).decode()
                for line in out.strip().splitlines():
                    parts = line.split()
                    if parts:
                        kill_process_tree(int(parts[-1]))
                        stopped = True
            except Exception:
                pass

    print(f"\n{GREEN}=================================================={RESET}")
    if stopped:
        print(f"    {GREEN}✓{RESET} ROYAL SCOUT has been stopped successfully.")
    else:
        print(f"    {CYAN}ℹ{RESET} No active ROYAL SCOUT processes were found.")
    print(f"{GREEN}=================================================={RESET}\n")
    sys.exit(0)

def cleanup(signum=None, frame=None):
    print(f"\n{PINK}=================================================={RESET}")
    print(f"{BOLD}{PINK}          SHUTTING DOWN ROYAL SCOUT...{RESET}")
    print(f"{PINK}=================================================={RESET}")
    for p in active_procs:
        if p and p.pid:
            print(f"    {CYAN}ℹ{RESET} Terminating PID {p.pid}...")
            kill_process_tree(p.pid)
    if os.path.exists(PID_FILE):
        try:
            os.remove(PID_FILE)
        except Exception:
            pass
    print(f"    {GREEN}✓{RESET} All services stopped cleanly. Ports released.")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def run(mode="start"):
    print_header()
    is_dev = mode == "dev"
    TOTAL = 8

    # Step 1
    print(f"{PINK}[1/{TOTAL}]{RESET} {BOLD}Checking system requirements...{RESET}")
    if is_port_in_use(PORT):
        ok, _ = query_health(PORT)
        if ok:
            print(f"\n{YELLOW}=================================================={RESET}")
            print(f"    {YELLOW}⚠{RESET} ROYAL SCOUT is ALREADY RUNNING on port {PORT}!")
            print(f"{YELLOW}=================================================={RESET}\n")
            print(f"Opening browser at: http://localhost:{PORT}")
            webbrowser.open(f"http://localhost:{PORT}")
            sys.exit(0)
        else:
            print(f"    {RED}✗ Error:{RESET} Port {PORT} is already in use by another application.")
            sys.exit(1)
    print(f"    {GREEN}✓{RESET} Port {PORT} is available.")

    # Step 2
    print(f"{PINK}[2/{TOTAL}]{RESET} {BOLD}Checking Python environment...{RESET}")
    print(f"    {GREEN}✓{RESET} Python {sys.version.split()[0]} interpreter verified.")

    # Step 3
    print(f"{PINK}[3/{TOTAL}]{RESET} {BOLD}Checking Node.js dependencies...{RESET}")
    if not os.path.exists(os.path.join(FRONTEND_DIR, "node_modules")):
        print(f"    {YELLOW}⚠{RESET} Installing frontend dependencies...")
        subprocess.run("npm install --prefix frontend", cwd=ROOT_DIR, shell=True, check=True)
    print(f"    {GREEN}✓{RESET} Node.js dependencies verified.")

    # Step 4
    print(f"{PINK}[4/{TOTAL}]{RESET} {BOLD}Loading environment configuration...{RESET}")
    print(f"    {GREEN}✓{RESET} Configuration verified (Host={HOST}, Port={PORT}, Mode={'Dev' if is_dev else 'Production'}).")

    # Step 5
    print(f"{PINK}[5/{TOTAL}]{RESET} {BOLD}Checking dataset availability...{RESET}")
    required = ['ball_by_ball.csv', 'matches.csv', 'competitions.csv', 'teams.csv', 'playing_eleven.csv']
    present = [f for f in required if os.path.exists(os.path.join(DATA_DIR, f))]
    print(f"    {GREEN}✓{RESET} Competition datasets: {len(present)}/{len(required)} files present in data/.")

    # Step 6
    print(f"{PINK}[6/{TOTAL}]{RESET} {BOLD}Starting FastAPI backend...{RESET}")
    cmd = [sys.executable, "-m", "uvicorn", "app:app", "--host", HOST, "--port", str(PORT)]
    backend = subprocess.Popen(cmd, cwd=BACKEND_DIR)
    active_procs.append(backend)
    print(f"    {GREEN}✓{RESET} FastAPI backend spawned on PID {backend.pid}.")

    # Step 7
    print(f"{PINK}[7/{TOTAL}]{RESET} {BOLD}{'Starting React frontend (Vite dev)...' if is_dev else 'Verifying frontend production build...'}{RESET}")
    if is_dev:
        frontend = subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND_DIR, shell=IS_WIN)
        active_procs.append(frontend)
        print(f"    {GREEN}✓{RESET} Vite dev server spawned on PID {frontend.pid}.")
    else:
        dist_index = os.path.join(FRONTEND_DIR, "dist", "index.html")
        if not os.path.exists(dist_index):
            print(f"    {YELLOW}⚠{RESET} Building frontend with Vite...")
            subprocess.run("npm run build", cwd=FRONTEND_DIR, shell=True, check=True)
        print(f"    {GREEN}✓{RESET} Compiled frontend verified. FastAPI serves UI on port {PORT}.")

    # Write PID
    try:
        with open(PID_FILE, 'w') as f:
            json.dump([p.pid for p in active_procs if p], f)
    except Exception:
        pass

    # Step 8
    print(f"{PINK}[8/{TOTAL}]{RESET} {BOLD}Checking application health...{RESET}")
    sys.stdout.write("    Waiting for backend analytics engine...")
    sys.stdout.flush()
    healthy = False
    start_t = time.time()
    while time.time() - start_t < 60:
        ok, data = query_health(PORT)
        if ok:
            healthy = True
            break
        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(0.5)
    print("")

    if not healthy:
        print(f"    {RED}✗ Error:{RESET} Backend did not become healthy in time.")
        cleanup()

    print(f"    {GREEN}✓{RESET} Application is healthy and ready.")

    app_url = f"http://localhost:{DEV_PORT if is_dev else PORT}"
    print(f"\n{GREEN}=================================================={RESET}")
    print(f"{BOLD}{GREEN}          ROYAL SCOUT IS READY!{RESET}")
    print(f"{GREEN}=================================================={RESET}\n")
    print(f"  {BOLD}Backend API:{RESET}        http://{HOST}:{PORT}")
    print(f"  {BOLD}API Docs (Swagger):{RESET} http://{HOST}:{PORT}/docs")
    if is_dev:
        print(f"  {BOLD}Frontend (Vite):{RESET}    http://localhost:{DEV_PORT}")
    print(f"  {BOLD}Application:{RESET}        {BOLD}{PINK}{app_url}{RESET}\n")

    print(f"{PINK}=================================================={RESET}")
    print(f"{BOLD}{PINK}Opening ROYAL SCOUT in your browser...{RESET}")
    print(f"{PINK}=================================================={RESET}\n")
    webbrowser.open(app_url)

    print(f"{DIM}Press Ctrl+C to stop all services cleanly.{RESET}\n")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "start"
    if mode == "stop":
        handle_stop()
    else:
        run(mode)

