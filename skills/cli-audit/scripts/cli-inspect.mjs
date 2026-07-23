#!/usr/bin/env node

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

async function main() {
  const rawUrl = process.argv[2];

  if (!rawUrl) {
    console.error('Usage: cli-audit-inspect <URL>');
    process.exit(1);
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl).toString();
  } catch {
    console.error('Invalid URL. Provide a full URL like https://example.com');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/Toronto',
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
      extraHTTPHeaders: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        DNT: '1',
        Pragma: 'no-cache',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const page = await context.newPage();
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    const axeResults = await new AxeBuilder({ page }).analyze();

    let accessibilityTree = null;
    try {
      accessibilityTree = await page.accessibility.snapshot({
        interestingOnly: false
      });
    } catch (snapshotError) {
      // Keep axe results even when browser accessibility APIs are unavailable.
      accessibilityTree = {
        error: snapshotError?.message ?? String(snapshotError)
      };
    }

    const report = {
      meta: {
        url: targetUrl,
        scannedAt: new Date().toISOString(),
        userAgent: await page.evaluate(() => navigator.userAgent),
        title: await page.title()
      },
      axe: axeResults,
      accessibilityTree
    };

    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        error: {
          message: error?.message ?? String(error),
          stack: error?.stack ?? null
        }
      },
      null,
      2
    )
  );
  process.exit(1);
});