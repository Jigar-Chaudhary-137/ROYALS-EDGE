import urllib.request
import json
import sys

def test_endpoint(name, url, is_json=True):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Tester/1.0"})
        with urllib.request.urlopen(req, timeout=5) as res:
            status = res.status
            content_type = res.headers.get("Content-Type", "")
            data = res.read()
            size = len(data)
            
            if is_json:
                parsed = json.loads(data.decode('utf-8'))
                print(f"[PASS] {name:25} -> {status} OK | Size: {size:7} bytes | Keys: {list(parsed.keys())[:4]}")
                return True, parsed
            else:
                print(f"[PASS] {name:25} -> {status} OK | Size: {size:7} bytes | Type: {content_type}")
                return True, data
    except Exception as e:
        print(f"[FAIL] {name:25} -> ERROR: {e}")
        return False, None

print("\n" + "="*70)
print("RUNNING ROYAL SCOUT INTEGRATION TESTS ON http://127.0.0.1:8000")
print("="*70)

all_passed = True

# 1. Frontend SPA served by FastAPI
p, _ = test_endpoint("Frontend SPA Root", "http://127.0.0.1:8000/", is_json=False)
all_passed &= p

# 2. Health Endpoint
p, health = test_endpoint("API Health", "http://127.0.0.1:8000/api/health")
all_passed &= p
if health:
    print(f"       Health: Status={health.get('status')}, Backend={health.get('backend')}, Datasets={health.get('dataset_status', {}).get('available')}")

# 3. Overview API
p, over = test_endpoint("Overview API", "http://127.0.0.1:8000/api/overview")
all_passed &= p

# 4. Batters Rankings API
p, b_data = test_endpoint("Batters Rankings API", "http://127.0.0.1:8000/api/batters?page=1&page_size=10")
all_passed &= p
if b_data and 'rankings' in b_data and len(b_data['rankings']) > 0:
    top1 = b_data['rankings'][0]
    print(f"       Top 1 Batter: {top1.get('striker_name')} | Rating: {top1.get('final_rating')} | Team: {top1.get('team')}")

# 5. Bowlers Rankings API
p, bw_data = test_endpoint("Bowlers Rankings API", "http://127.0.0.1:8000/api/bowlers?page=1&page_size=10")
all_passed &= p
if bw_data and 'rankings' in bw_data and len(bw_data['rankings']) > 0:
    top1_bw = bw_data['rankings'][0]
    print(f"       Top 1 Bowler: {top1_bw.get('bowler_name')} | Rating: {top1_bw.get('final_rating')} | Team: {top1_bw.get('team')}")

# 6. Player 360 Profile API (Rinku Singh: 4708)
p, prof = test_endpoint("Player Profile API", "http://127.0.0.1:8000/api/player/4708")
all_passed &= p
if prof:
    print(f"       Profile: {prof.get('player_name')} | Rating: {prof.get('final_rating')} | Primary: {prof.get('primary_role')}")

# 7. Player Comparison API
comp_payload = json.dumps({"player_ids": [4708, 6495], "role": "batter"}).encode('utf-8')
try:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/compare",
        data=comp_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        c_data = json.loads(res.read().decode('utf-8'))
        print(f"[PASS] {'Player Comparison API':25} -> 200 OK | Profiles compared: {len(c_data.get('profiles', []))}")
except Exception as e:
    print(f"[FAIL] {'Player Comparison API':25} -> ERROR: {e}")
    all_passed = False

# 8. Player Image Serving
p, _ = test_endpoint("Player Image (4708.png)", "http://127.0.0.1:8000/players/4708.png", is_json=False)
all_passed &= p

# 9. PDF Report Download
p, _ = test_endpoint("Methodology PDF Download", "http://127.0.0.1:8000/api/download/pdf", is_json=False)
all_passed &= p

# 10. CSV Export Download
p, _ = test_endpoint("Batters CSV Download", "http://127.0.0.1:8000/api/download/csv/batters", is_json=False)
all_passed &= p

# 11. Master Submission ZIP Download
p, _ = test_endpoint("Submission ZIP Download", "http://127.0.0.1:8000/api/download/submission-zip", is_json=False)
all_passed &= p

# 12. RR Recommendations API
p, rec = test_endpoint("RR Recommendations API", "http://127.0.0.1:8000/api/rr-recommendations")
all_passed &= p

print("="*70)
print(f"INTEGRATION TEST SUMMARY: {'ALL 12 TESTS PASSED!' if all_passed else 'SOME TESTS FAILED'}")
print("="*70)

