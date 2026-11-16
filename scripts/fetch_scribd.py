import urllib.request
import re

url = 'https://www.scribd.com/document/929886372/PLAYERDATATOTEAMS-5'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'(\w+[\s\w]*)\s*,\s*.*?IPLHeadshot2024/(\d+)\.png', html)
        print('Matches:', len(matches), matches[:20])
        # Also just extract all names and numbers
        all_ids = re.findall(r'IPLHeadshot2024/(\d+)\.png', html)
        print('All IDs in doc:', len(all_ids), set(all_ids[:30]))
except Exception as e:
    print('Error:', e)
