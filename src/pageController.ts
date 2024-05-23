import { Browser } from "puppeteer";
import { scraperObject } from "./pageScraper";

export async function scrapeAll(browserInstance: Browser) {
  try {
    await scraperObject.scraper(browserInstance);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}
