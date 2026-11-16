import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for slug in ['david-miller', 'tim-david', 'yuzvendra-chahal', 'kuldeep-yadav', 'rahul-tewatia', 'shubham-dubey', 'tilak-varma', 'rovman-powell', 'mustafizur-rahman', 'maheesh-theekshana']:
    url = f'https://www.iplt20.com/players/{slug}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=6) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            imgs = re.findall(r'https://[^\s"\'<>]+(?:IPLHeadshot|headshot|players)[^\s"\'<>]+\.png', html, re.IGNORECASE)
            print(f"{slug} -> {imgs[:2] if imgs else 'None found'}")
    except Exception as e:
        print(f"{slug} -> Error {e}")
