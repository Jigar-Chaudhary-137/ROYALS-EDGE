import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('exports', 'screenshots');
const ASSETS_SCREENSHOTS_DIR = path.resolve('assets', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_SCREENSHOTS_DIR)) fs.mkdirSync(ASSETS_SCREENSHOTS_DIR, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pagesToCapture = [
  { name: 'fig01_dashboard.png', path: '/', waitMs: 1500, desc: 'Overview Dashboard & Season 2 KPIs' },
  { name: 'fig02_explorer.png', path: '/explorer', waitMs: 1500, desc: 'Dataset Explorer & Schema Inspector' },
  { name: 'fig03_pressure_engine.png', path: '/pressure', waitMs: 1500, desc: 'Match Pressure Index (MPI) Engine' },
  { name: 'fig04_batter_rankings.png', path: '/batters', waitMs: 1500, desc: 'Top 10 Batters Under Pressure & Full Cohort' },
  { name: 'fig05_bowler_rankings.png', path: '/bowlers', waitMs: 1500, desc: 'Top 10 Bowlers Under Pressure & Full Cohort' },
  { name: 'fig06_batter_profile.png', path: '/players/4708', waitMs: 1500, desc: 'Rinku Singh 360° Analytical Dossier' },
  { name: 'fig07_bowler_profile.png', path: '/players/4722', waitMs: 1500, desc: 'Rashid Khan 360° Analytical Dossier' },
  { name: 'fig08_comparison.png', path: '/comparison', waitMs: 1500, desc: 'Head-to-Head Multi-Attribute Comparison Tool' },
  { name: 'fig09_auction_strategy.png', path: '/recommendations', waitMs: 1500, desc: 'Rajasthan Royals IPL 2027 Auction Radar' },
  { name: 'fig10_methodology.png', path: '/methodology', waitMs: 1500, desc: 'Mathematical Formulation & Empirical Bayesian Logic' },
  { name: 'fig11_export_centre.png', path: '/exports', waitMs: 1500, desc: 'Deliverables & Export Centre' },
  { name: 'fig12_report_download.png', path: '/exports', waitMs: 1500, desc: 'Methodology PDF & Submission Pack Download' }
];

async function captureAll() {
  console.log("Launching Edge headless to capture 12 application screenshots...");
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (let i = 0; i < pagesToCapture.length; i++) {
    const item = pagesToCapture[i];
    const url = `http://127.0.0.1:8000${item.path}`;
    console.log(`[${i+1}/${pagesToCapture.length}] Capturing ${item.name} from ${url}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      if (item.waitMs) await new Promise(r => setTimeout(r, item.waitMs));

      const out1 = path.join(SCREENSHOTS_DIR, item.name);
      const out2 = path.join(ASSETS_SCREENSHOTS_DIR, item.name);
      await page.screenshot({ path: out1 });
      fs.copyFileSync(out1, out2);
      console.log(`   ✓ Saved: ${item.name} (${fs.statSync(out1).size} bytes)`);
    } catch (err) {
      console.error(`   ✗ Error capturing ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

captureAll().catch(err => {
  console.error("Fatal capture error:", err);
  process.exit(1);
});

