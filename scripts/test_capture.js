import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function testScreenshot() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  console.log("Launching Edge with puppeteer-core...");
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle0' });

  const outPath = path.resolve('exports', 'test_screen.png');
  await page.screenshot({ path: outPath });
  console.log("Screenshot captured successfully to:", outPath);
  await browser.close();
}

testScreenshot().catch(err => {
  console.error("Capture error:", err);
  process.exit(1);
});

