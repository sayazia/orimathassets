// Rasterises SVG strings to PNG in headless Chromium (no fonts involved: every SVG here is polygons).
import { chromium } from 'playwright';

export async function rasterizer() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body></body></html>');
  const png = async (svg, width, height, jpeg = false) => {
    const url = await page.evaluate(async ({ svg, width, height, jpeg }) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      await img.decode();
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      const g = c.getContext('2d');
      if (jpeg) { g.fillStyle = '#fff'; g.fillRect(0, 0, width, height); }
      g.drawImage(img, 0, 0, width, height);
      return c.toDataURL(jpeg ? 'image/jpeg' : 'image/png', 0.9);
    }, { svg, width, height, jpeg });
    return Buffer.from(url.split(',')[1], 'base64');
  };
  // Screenshot of an HTML page (for the preview composites).
  const shot = async (url, width, height, file) => {
    const p = await browser.newPage({ viewport: { width, height } });
    await p.goto(url); await p.waitForTimeout(400);
    await p.screenshot({ path: file, fullPage: true });
    await p.close();
  };
  return { png, shot, close: () => browser.close() };
}
