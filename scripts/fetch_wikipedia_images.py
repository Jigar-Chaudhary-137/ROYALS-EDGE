import urllib.request
import json
import re

headers = {'User-Agent': 'RoyalScoutBot/1.0 (contact@royalscout.org)'}

players_to_search = [
    'Tim David', 'Shaheen Afridi', 'Rahul Tewatia', 'Rovman Powell', 
    'Abrar Ahmed (cricketer)', 'Maheesh Theekshana', 'Matheesha Pathirana', 
    'Dhruv Jurel', 'Shubham Dubey', 'Dasun Shanaka', 'Josh Hazlewood',
    'Aiden Markram', 'Lockie Ferguson', 'Mohit Sharma'
]

results = {}

for p in players_to_search:
    try:
        # Search page title
        search_url = f"https://en.wikipedia.org/w/api.php?action=opensearch&search={urllib.parse.quote(p)}&limit=1&format=json"
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            if data[1]:
                title = data[1][0]
            else:
                title = p

        # Query page images and parse
        info_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages|images&pithumbsize=800&format=json"
        req2 = urllib.request.Request(info_url, headers=headers)
        with urllib.request.urlopen(req2) as resp:
            data2 = json.loads(resp.read().decode())
            pages = data2.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                thumb = pdata.get('thumbnail', {}).get('source')
                images = [im['title'] for im in pdata.get('images', [])]
                results[p] = {'title': title, 'thumb': thumb, 'images': images[:5]}
                print(f"{p} (title: {title}): thumb = {thumb}")
    except Exception as e:
        print(f"Error {p}: {e}")

with open('data/wiki_player_images.json', 'w') as f:
    json.dump(results, f, indent=2)
