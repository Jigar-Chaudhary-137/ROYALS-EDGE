import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

squad_urls = [
    'https://www.iplt20.com/teams/rajasthan-royals/squad',
    'https://www.iplt20.com/teams/kolkata-knight-riders/squad',
    'https://www.iplt20.com/teams/mumbai-indians/squad',
    'https://www.iplt20.com/teams/chennai-super-kings/squad',
    'https://www.iplt20.com/teams/gujarat-titans/squad',
    'https://www.iplt20.com/teams/delhi-capitals/squad',
    'https://www.iplt20.com/teams/royal-challengers-bengaluru/squad',
    'https://www.iplt20.com/teams/punjab-kings/squad'
]

player_map = {}

for s_url in squad_urls:
    try:
        req = urllib.request.Request(s_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract player URLs and image sources
            # Look for player cards: e.g. href="/players/123/name" and img src="...IPLHeadshot...png"
            blocks = re.findall(r'<a[^>]+href="[^"]*players/(\d+)/([^"]+)"[^>]*>.*?<img[^>]+src="([^"]+)"', html, re.DOTALL)
            for pid, slug, img in blocks:
                clean_name = slug.replace('-', ' ').title()
                player_map[clean_name] = {'ipl_id': pid, 'img': img, 'slug': slug}
                
            # Also general regex
            headshots = re.findall(r'IPLHeadshot\w*/(\d+)\.png', html)
            # print found
    except Exception as e:
        print(f"Error fetching {s_url}: {e}")

print(f"Found {len(player_map)} players from IPL squads!")
for name, data in sorted(player_map.items()):
    print(f"  {name}: {data['img']}")

# Save found mapping to json
with open('data/ipl_player_headshots.json', 'w') as f:
    json.dump(player_map, f, indent=2)
