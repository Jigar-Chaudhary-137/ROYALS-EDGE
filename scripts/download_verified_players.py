import os
import urllib.request

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
out_dir = os.path.abspath('frontend/public/players')
os.makedirs(out_dir, exist_ok=True)

verified_map = {
    4708: ('Rinku Singh', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/152.png', '4708.png'),
    8: ('MS Dhoni', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/57.png', '8.png'),
    2933: ('Jasprit Bumrah', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/9.png', '2933.png'),
    152: ('Ravindra Jadeja', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/46.png', '152.png'),
    4722: ('Rashid Khan', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/218.png', '4722.png'),
    6256: ('Varun Chakravarthy', 'https://documents.iplt20.com/ipl/IPLHeadshot2024/140.png', '6256.png'),
    3644: ('Kuldeep Yadav', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Kuldeep_Yadav_in_PMO_New_Delhi.jpg', '3644.jpg'),
    1612: ('Yuzvendra Chahal', 'https://upload.wikimedia.org/wikipedia/commons/d/df/Yuzvendra_Chahal_in_PMO_New_Delhi.jpg', '1612.jpg'),
    1077: ('David Miller', 'https://upload.wikimedia.org/wikipedia/commons/f/f6/David_Miller_2025_interview_%28cropped%29.png', '1077.png'),
    7897: ('Tilak Varma', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Tilak_Varma_in_March_2026.png', '7897.png'),
    4373: ('Mustafizur Rahman', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Mustafizur_Rahman_%284%29_%28cropped%29.jpg/960px-Mustafizur_Rahman_%284%29_%28cropped%29.jpg', '4373.jpg'),
    3297: ('Shimron Hetmyer', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Shimron_Hetmyer.jpg', '3297.jpg'),
    830: ('Josh Hazlewood', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/RSA_vs_AUS_Day_1_-_Josh_Hazlewood-2.jpg/960px-RSA_vs_AUS_Day_1_-_Josh_Hazlewood-2.jpg', '830.jpg'),
    3605: ('Aiden Markram', 'https://upload.wikimedia.org/wikipedia/commons/2/25/Aiden_Markram_interview_after_WTC_final_2025_%28cropped%29.png', '3605.png'),
    4692: ('Lockie Ferguson', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Lockie_Ferguson.jpg', '4692.jpg'),
}

for pid, (name, url, filename) in verified_map.items():
    dest = os.path.join(out_dir, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            with open(dest, 'wb') as f:
                f.write(content)
            print(f"Downloaded {name} ({pid}) -> {filename} ({len(content):,} bytes)")
    except Exception as e:
        print(f"Failed {name} ({pid}): {e}")

print(f"\nAll files in {out_dir}:")
for f in os.listdir(out_dir):
    print(" ", f, f"{os.path.getsize(os.path.join(out_dir, f)):,} bytes")
