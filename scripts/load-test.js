const { chromium } = require('playwright');

const NUM_INSTANCES = parseInt(process.argv[2], 10) || 5;

const SENTENCES = [
  "Hello from the automated bot.",
  "We are load testing the application.",
  "WebRTC is a powerful technology.",
  "Typing collaboratively can be challenging.",
  "Checking for memory leaks and CPU usage."
];

async function runInstance(browser, index) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for the editor to be available
  const editor = page.locator('[contenteditable="true"]');
  await editor.waitFor({ state: 'visible', timeout: 30000 });
  
  console.log(`Bot ${index} connected and ready.`);
  
  // Loop forever typing
  while (true) {
    const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    try {
      await editor.click();
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.keyboard.type(`[Bot ${index}]: ${sentence}`);
    } catch (e) {
      console.log(`Bot ${index} failed to type:`, e.message);
    }
    
    await page.waitForTimeout(3000);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  console.log(`Launching ${NUM_INSTANCES} bots...`);
  
  for (let i = 0; i < NUM_INSTANCES; i++) {
    runInstance(browser, i + 1).catch(err => console.error(`Bot ${i + 1} error:`, err.message));
    // Stagger starts significantly to avoid Next.js dev server timeout
    await new Promise(r => setTimeout(r, 4000));
  }
}

main().catch(console.error);
