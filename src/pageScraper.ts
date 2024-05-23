import { Browser, Page } from "puppeteer";
import path from "path";
import { createDirectoryIfNotExists, writeJsonToFile, getTodayDateString } from "./util/createFoldersAndFiles";
import { downloadPdf } from "./util/downloadPdf";
import "dotenv/config";

interface Catalog {
  catalogId: number;
  catalogName: string;
  linkOfCatalog: string;
  duringDates: string;
}

export const scraperObject = {
  url: process.env.SCRAPER_URL,

  async scraper(browser: Browser) {
    let page: Page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    await page.waitForSelector("#s2");

    const catalogInfo: { name: string; dates: string; link: string }[] = await page.evaluate(() => {
      const container = document.querySelector("#s2");
      if (!container) {
        return [];
      }
      const catalogs = Array.from(container.querySelectorAll(".slick-list .list-item"));
      return catalogs.map((catalog) => {
        const nameElement = catalog.querySelector(".hover h3 a") as HTMLAnchorElement | null;
        const name = nameElement ? (nameElement.textContent ?? "").trim() : "";

        const link = nameElement ? nameElement.href : "";

        const dateElements = Array.from(catalog.querySelectorAll("time"));
        const dates = dateElements.map((dateElement) => (dateElement.textContent ?? "").trim()).join(" - ");

        return { name, dates, link };
      });
    });

    const baseDir = path.join(__dirname, "../parserResult");
    const todayDir = path.join(baseDir, getTodayDateString());
    const jsonFilePath = path.join(todayDir, "catalogs.json");

    createDirectoryIfNotExists(baseDir);
    createDirectoryIfNotExists(todayDir);

    const newCatalogs: Catalog[] = catalogInfo.map((info, index) => ({
      catalogId: index + 1,
      catalogName: info.name,
      linkOfCatalog: info.link,
      duringDates: info.dates,
    }));

    writeJsonToFile(jsonFilePath, newCatalogs);

    console.log("Data successfully written to catalogs.json");

    const pdfLinks: string[] = await page.evaluate(() => {
      const container = document.querySelector("#s2");
      if (!container) {
        return [];
      }
      const pdfElements = Array.from(container.querySelectorAll(".slick-list .list-item .hover a.pdf"));
      return pdfElements.map((pdfElement: Element) => (pdfElement as HTMLAnchorElement).href);
    });

    const pdfDir = path.join(todayDir, "pdf");

    createDirectoryIfNotExists(pdfDir);

    for (let index = 0; index < pdfLinks.length; index++) {
      const pdfLink = pdfLinks[index];
      await downloadPdf({ pdfLink, pdfDir, index });
    }

    await browser.close();
  },
};
