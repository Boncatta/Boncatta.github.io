import { chromium } from "playwright";

const base = process.env.BONCATTA_TEST_URL || "http://localhost:8787";
const dir = process.env.BONCATTA_SHOT_DIR || "output/playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
});

await page.goto(`${base}/index.html`);
await page.fill("#loginName", "piglin");
await page.fill("#loginPassword", "123456");
await page.click("#loginButton");
await page.waitForSelector("#homeLobby:not([hidden])");
await page.screenshot({ path: `${dir}/home-mobile.png`, fullPage: true });

await page.goto(`${base}/game.html`);
await page.waitForSelector("#createStage:not([hidden])");
await page.screenshot({ path: `${dir}/game-create-mobile.png`, fullPage: true });
await page.click("#createRoom");
await page.waitForSelector("#roomStage:not([hidden])");
await page.screenshot({ path: `${dir}/game-room-mobile.png`, fullPage: true });

await page.goto(`${base}/me.html`);
await page.waitForSelector("#profileCard");
await page.screenshot({ path: `${dir}/me-mobile.png`, fullPage: true });

const metrics = await page.evaluate(() => ({
  w: innerWidth,
  h: innerHeight,
  scroll: document.documentElement.scrollHeight,
  nav: Boolean(document.querySelector(".nav a[aria-current]")),
}));

console.log(JSON.stringify(metrics));
await browser.close();
