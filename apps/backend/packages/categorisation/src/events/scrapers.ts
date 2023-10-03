import chromium from "chrome-aws-lambda";
import { convert } from "html-to-text";
import { logger } from "logger";
import { chromium as localPlaywrightChromium } from "playwright";
import playwright from "playwright-core";

interface ScrapedContent {
  content: string;
  isMain: boolean;
  title: string;
}

async function fetchContentAndTitle(
  browser: playwright.Browser,
  url: string,
): Promise<ScrapedContent> {
  const page = await browser.newPage();
  await page.goto(url);

  const title = await page.title();
  const mainContent = await page.$("main");
  const innerHtml = mainContent
    ? await mainContent.innerHTML()
    : await page.content();

  return { content: innerHtml, isMain: Boolean(mainContent), title };
}

async function getUrlContentsWithLocalPlaywright(
  url: string,
): Promise<ScrapedContent> {
  const browser = await localPlaywrightChromium.launch({ headless: true });
  const result = await fetchContentAndTitle(browser, url);
  await browser.close();

  return result;
}

async function getUrlContentsWithDeployedLambdaPlaywright(
  url: string,
): Promise<ScrapedContent> {
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const result = await fetchContentAndTitle(browser, url);
  await browser.close();

  return result;
}

function truncateText(str: string, limit: number): string {
  if (str.length <= limit) return str;

  const truncated = str.slice(0, limit);
  const lastPeriod = truncated.lastIndexOf(". ");

  return lastPeriod > 0 ? truncated.slice(0, lastPeriod + 1) : truncated;
}

export async function getUrlContents(url: string): Promise<ScrapedContent> {
  let content = "";
  let isMain = false;
  let title = "";

  if (process.env.NODE_ENV !== "production") {
    logger.info("Scraping link with local playwright");
    const res = await getUrlContentsWithLocalPlaywright(url);
    content = res.content;
    isMain = res.isMain;
    title = res.title;
  } else {
    logger.info("Scraping link with deployed lambda playwright");
    const res = await getUrlContentsWithDeployedLambdaPlaywright(url);
    content = res.content;
    isMain = res.isMain;
    title = res.title;
  }

  const htmlToText = convert(content, { wordwrap: 130 });

  return { content: truncateText(htmlToText, 3500), isMain, title };
}
