import urllib.request
import json
import re

headers = {'User-Agent': 'Mozilla/5.0'}

# Let's check IPL players endpoint
# Many times IPL has a json file: https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/allplayers.js or similar
urls_to_test = [
    'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/allplayers.js',
    'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/2024/allplayers.js',
    'https://cricketapi-icc.pulseive.com/content/ipl/tournament/2024/squads'
]

for u in urls_to_test:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            print(f"Success: {u} (size {len(data)})")
            # print sample
            print(data[:300])
    except Exception as e:
        print(f"Fail {u}: {e}")
