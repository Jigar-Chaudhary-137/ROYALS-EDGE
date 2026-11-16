import urllib.request
import concurrent.futures

url_template = "https://documents.iplt20.com/ipl/IPLHeadshot2024/{}.png"
headers = {'User-Agent': 'Mozilla/5.0'}

valid_ids = {}

def check_id(i):
    url = url_template.format(i)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                length = resp.headers.get('Content-Length')
                return i, int(length) if length else 0
    except Exception:
        return None

with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(check_id, i) for i in range(1, 260)]
    for f in concurrent.futures.as_completed(futures):
        res = f.result()
        if res:
            valid_ids[res[0]] = res[1]

print(f"Found {len(valid_ids)} valid IPL Headshot IDs in 1..250:")
print(sorted(valid_ids.keys()))
