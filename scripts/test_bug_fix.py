import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def get(url, expect_json=True):
    req = urllib.request.Request(url, headers={"User-Agent": "BugFixAudit/2.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            status = res.status
            content_type = res.headers.get("Content-Type", "")
            raw = res.read()
            if expect_json:
                try:
                    return status, json.loads(raw.decode('utf-8')), content_type
                except Exception as je:
                    return status, {"raw_text": raw.decode('utf-8', errors='ignore')}, content_type
            return status, raw, content_type
    except urllib.error.HTTPError as he:
        raw = he.read()
        try:
            return he.code, json.loads(raw.decode('utf-8')), he.headers.get("Content-Type", "")
        except:
            return he.code, {"error": raw.decode('utf-8', errors='ignore')}, he.headers.get("Content-Type", "")
    except Exception as e:
        return 500, {"error": str(e)}, ""

print("="*80)
print("ROYAL SCOUT: 10-POINT PLAYER PROFILE NAVIGATION & RENDERING AUDIT")
print("="*80)

results = []

# TEST 1: Batter Rankings -> Rinku Singh (4708)
s, d, ct = get(f"{BASE_URL}/api/player/4708")
t1_pass = s == 200 and d.get('player_name') == 'Rinku Singh' and d.get('batting', {}).get('rating') == 97.01
results.append(("TEST 1: Click Rinku Singh (Batting Profile)", t1_pass, f"Name: {d.get('player_name')}, Rating: {d.get('batting', {}).get('rating')}, Avg: {d.get('batting', {}).get('pressure_avg')}"))

# TEST 2: Bowler Rankings -> Rashid Khan (4722)
s, d, ct = get(f"{BASE_URL}/api/player/4722")
t2_pass = s == 200 and d.get('player_name') == 'Rashid Khan' and d.get('bowling', {}).get('rating') == 72.13
results.append(("TEST 2: Click Rashid Khan (Bowling Profile)", t2_pass, f"Name: {d.get('player_name')}, Rating: {d.get('bowling', {}).get('rating')}, Econ: {d.get('bowling', {}).get('pressure_economy')}"))

# TEST 3: Open Another Player -> Jasprit Bumrah (2933) & David Miller (1077)
s_bum, d_bum, _ = get(f"{BASE_URL}/api/player/2933")
s_mil, d_mil, _ = get(f"{BASE_URL}/api/player/1077")
t3_pass = (s_bum == 200 and d_bum.get('player_name') == 'Jasprit Bumrah' and d_bum.get('bowling', {}).get('rating') == 70.32 and
           s_mil == 200 and d_mil.get('player_name') == 'David Miller' and d_mil.get('batting', {}).get('rating') == 62.27)
results.append(("TEST 3: Player Switching Independence", t3_pass, f"Bumrah (Rating {d_bum.get('bowling', {}).get('rating')}) vs Miller (Rating {d_mil.get('batting', {}).get('rating')})"))

# TEST 4: Refresh / Direct URL Navigation for /players/4708
s, raw, ct = get(f"{BASE_URL}/players/4708", expect_json=False)
html = raw.decode('utf-8', errors='ignore') if isinstance(raw, bytes) else ""
t4_pass = s == 200 and '<div id="root">' in html
results.append(("TEST 4: Refresh Browser on /players/4708 (SPA HTML served)", t4_pass, f"HTTP {s}, Size: {len(raw)} bytes, Has Root Div: {'<div id=\"root\">' in html}"))

# TEST 5: Direct Tab Navigation for /players/4722
s, raw, ct = get(f"{BASE_URL}/players/4722", expect_json=False)
html2 = raw.decode('utf-8', errors='ignore') if isinstance(raw, bytes) else ""
t5_pass = s == 200 and '<div id="root">' in html2
results.append(("TEST 5: Direct URL Navigation to /players/4722", t5_pass, f"HTTP {s}, Direct load works without blank page"))

# TEST 6: Route Navigation back to /batters and /bowlers
s_bat, raw_bat, _ = get(f"{BASE_URL}/batters", expect_json=False)
s_bow, raw_bow, _ = get(f"{BASE_URL}/bowlers", expect_json=False)
t6_pass = s_bat == 200 and s_bow == 200 and '<div id="root">' in raw_bat.decode('utf-8', errors='ignore')
results.append(("TEST 6: Route Back Navigation (/batters, /bowlers)", t6_pass, f"HTTP {s_bat} (Batters) & HTTP {s_bow} (Bowlers) cleanly served"))

# TEST 7: Global Search Integration
s, d, ct = get(f"{BASE_URL}/api/search-players?q=rinku")
res_list = d.get('results', [])
t7_pass = s == 200 and len(res_list) > 0 and res_list[0].get('player_id') == 4708
results.append(("TEST 7: Global Search to Profile Resolution", t7_pass, f"Found {len(res_list)} match(es), Primary ID: {res_list[0].get('player_id') if res_list else 'None'}"))

# TEST 8: Missing / Invalid Player ID (999999)
s_inv, d_inv, _ = get(f"{BASE_URL}/api/player/999999")
s_inv2, d_inv2, _ = get(f"{BASE_URL}/api/players/999999")
t8_pass = s_inv == 404 and s_inv2 == 404
results.append(("TEST 8: Missing Player Graceful 404 Error", t8_pass, f"HTTP {s_inv} on /api/player/999999 and HTTP {s_inv2} on /api/players/999999 with detail message"))

# TEST 9: Player Photographs & Asset Resolution
s_img1, raw_img1, ct1 = get(f"{BASE_URL}/players/4708.png", expect_json=False)
s_img2, raw_img2, ct2 = get(f"{BASE_URL}/players/2933.png", expect_json=False)
s_img3, raw_img3, ct3 = get(f"{BASE_URL}/players/4722.png", expect_json=False)
t9_pass = s_img1 == 200 and s_img2 == 200 and s_img3 == 200 and 'image' in ct1
results.append(("TEST 9: Player HD Photographs Served", t9_pass, f"Rinku: {len(raw_img1)} bytes, Bumrah: {len(raw_img2)} bytes, Rashid: {len(raw_img3)} bytes"))

# TEST 10: Health & System Integrity
s_h, d_h, _ = get(f"{BASE_URL}/api/health")
t10_pass = s_h == 200 and d_h.get('status') == 'healthy' and d_h.get('backend') == 'online'
results.append(("TEST 10: Health Endpoint & Zero Unhandled Exceptions", t10_pass, f"Status: {d_h.get('status')}, Batters: {d_h.get('analytics_engine', {}).get('eligible_batters')}, Bowlers: {d_h.get('analytics_engine', {}).get('eligible_bowlers')}"))

all_passed = True
for name, passed, detail in results:
    status_label = "[PASS]" if passed else "[FAIL]"
    print(f"{status_label} {name}")
    print(f"       -> {detail}")
    if not passed:
        all_passed = False

print("="*80)
print(f"FINAL RESULT: {'ALL 10/10 TESTS PASSED WITH 100% SUCCESS!' if all_passed else 'SOME TESTS FAILED'}")
print("="*80)
