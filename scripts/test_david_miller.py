import urllib.request
import re

url = 'https://www.iplt20.com/players/199a8631-89c0-4b51-b293-324ab9bc7fdd/david-miller/biography'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        all_imgs = re.findall(r'src=["\'](https?://[^"\']+\.(?:png|jpg|jpeg|webp))["\']', html)
        print('All img src:', set(all_imgs[:20]))
        # look for any image tags or background-image
        bgs = re.findall(r'url\(["\']?(https?://[^"\'\)]+)["\']?\)', html)
        print('All bg urls:', set(bgs[:10]))
except Exception as e:
    print('Error:', e)
