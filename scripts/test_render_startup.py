"""
ROYAL SCOUT — Render Startup & ASGI Entrypoint Verification
Tests all variations of uvicorn start commands to guarantee Render deployment success.
"""

import os
import sys
import time
import subprocess
import urllib.request
import json

# Ensure project root is in sys.path
_ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)

TEST_PORT = 8009
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

def test_uvicorn_startup():
    print("=" * 80)
    print("   TESTING RENDER ASGI ENTRYPOINTS & START COMMANDS")
    print("=" * 80)
    print()

    # 1. Test importing all entrypoints
    print("[1/5] Testing Python module imports...")
    try:
        from app import app as root_app
        print("  ✓ 'app:app' imported successfully from root (title:", root_app.title + ")")
    except Exception as e:
        print("  ✗ 'app:app' import failed:", e)
        return False

    try:
        from main import app as main_app
        print("  ✓ 'main:app' imported successfully from root (title:", main_app.title + ")")
    except Exception as e:
        print("  ✗ 'main:app' import failed:", e)
        return False

    try:
        from backend.app import app as backend_app
        print("  ✓ 'backend.app:app' imported successfully (title:", backend_app.title + ")")
    except Exception as e:
        print("  ✗ 'backend.app:app' import failed:", e)
        return False

    try:
        from backend.main import app as backend_main
        print("  ✓ 'backend.main:app' imported successfully (title:", backend_main.title + ")")
    except Exception as e:
        print("  ✗ 'backend.main:app' import failed:", e)
        return False

    print("\n[2/5] Spawning uvicorn with Render command: 'uvicorn app:app --host 0.0.0.0 --port 8009'...")
    env = os.environ.copy()
    env["PORT"] = str(TEST_PORT)
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", str(TEST_PORT)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.getcwd(),
        env=env,
        text=True
    )

    try:
        # Wait up to 15 seconds for startup
        started = False
        for attempt in range(15):
            time.sleep(1)
            try:
                with urllib.request.urlopen(f"{BASE_URL}/api/health", timeout=2) as resp:
                    if resp.status == 200:
                        started = True
                        break
            except Exception:
                pass

        if not started:
            print("  ✗ Server failed to start on port", TEST_PORT)
            outs, errs = proc.communicate(timeout=3)
            print("Stdout:", outs)
            print("Stderr:", errs)
            return False

        print(f"  ✓ Server is alive and listening on 0.0.0.0:{TEST_PORT}!")

        # 3. Test API Health
        print("\n[3/5] Testing /api/health...")
        with urllib.request.urlopen(f"{BASE_URL}/api/health") as resp:
            data = json.loads(resp.read().decode())
            print(f"  ✓ /api/health returned 200 OK | status={data.get('status')} | db_ready={data.get('database_ready')}")
            print(f"  ✓ Batters: {data.get('batters_count')} | Bowlers: {data.get('bowlers_count')}")

        # 4. Test API Rankings
        print("\n[4/5] Testing API Rankings & Single Source of Truth...")
        with urllib.request.urlopen(f"{BASE_URL}/api/batters") as resp:
            batters_data = json.loads(resp.read().decode())
            top1 = batters_data.get("top_10", [])[0]
            print(f"  ✓ /api/batters returned 200 OK | #1: {top1.get('striker_name')} (Rating: {top1.get('final_rating')})")
            assert top1.get("striker_name") == "Rinku Singh"
            assert top1.get("final_rating") == 97.01

        with urllib.request.urlopen(f"{BASE_URL}/api/bowlers") as resp:
            bowlers_data = json.loads(resp.read().decode())
            top1_bw = bowlers_data.get("top_10", [])[0]
            print(f"  ✓ /api/bowlers returned 200 OK | #1: {top1_bw.get('bowler_name')} (Rating: {top1_bw.get('final_rating')})")
            assert top1_bw.get("bowler_name") == "Rashid Khan"
            assert top1_bw.get("final_rating") == 72.13

        # 5. Test Frontend Static & SPA Serving
        print("\n[5/5] Testing Frontend React SPA serving...")
        with urllib.request.urlopen(f"{BASE_URL}/") as resp:
            html = resp.read().decode(errors="ignore")
            assert "<!doctype html>" in html.lower() or "<html" in html.lower()
            print("  ✓ GET / correctly serves React frontend index.html!")

        with urllib.request.urlopen(f"{BASE_URL}/players/4708") as resp:
            profile_html = resp.read().decode(errors="ignore")
            assert "<!doctype html>" in profile_html.lower() or "<html" in profile_html.lower()
            print("  ✓ GET /players/4708 correctly serves SPA for direct route navigation!")

        with urllib.request.urlopen(f"{BASE_URL}/players/4708.png") as resp:
            assert resp.status == 200
            print("  ✓ GET /players/4708.png correctly serves player portrait!")

        print("\n" + "=" * 80)
        print("  ALL RENDER STARTUP & ASGI TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 80)
        return True

    finally:
        print("\nCleaning up test server process...")
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()
        print("Test process terminated.")

if __name__ == "__main__":
    success = test_uvicorn_startup()
    sys.exit(0 if success else 1)
