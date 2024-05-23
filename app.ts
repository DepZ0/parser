import { startBrowser } from "./src/startBrowser";
import { scrapeAll } from "./src/pageController";

async function main() {
  const browserInstance = await startBrowser();

  scrapeAll(browserInstance);
}

main();
