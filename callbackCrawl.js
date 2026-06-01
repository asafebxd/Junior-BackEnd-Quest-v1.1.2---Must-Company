import { chromium } from "playwright";
import fs from "fs";

export async function callbackCrawl(retries) {
  try {
    await crawlingFromLinux();
  } catch (error) {
    console.error(error);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await callbackCrawl(retries - 1);
    }
    process.exit(1);
  }

  async function crawlingFromLinux() {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.time("Exect time");
      await page.route("**/*", (route) => {
        const requestType = route.request().resourceType();
        if (
          ["image", "stylesheet", "font", "media", "analytics"].includes(
            requestType,
          )
        ) {
          route.abort();
        } else {
          route.continue();
        }
      });
      const response = await page.goto("https://quotes.toscrape.com", {
        waitUntil: "domcontentloaded",
        timeout: 8000,
      });

      const extractedData = await page.evaluate(() => {
        const quoteNotes = document.querySelectorAll(".quote");

        console.log("quoteNotes", quoteNotes.length);

        const textData = Array.from(quoteNotes).map((data) => {
          return {
            text: data.querySelector(".text")?.textContent?.trim(),
            author: data.querySelector(".author")?.textContent?.trim(),
            tags: Array.from(data.querySelectorAll(".tag")).map((tag) =>
              tag.textContent?.trim(),
            ),
          };
        });
        return textData;
      });

      await fs.promises.writeFile(
        "downloads/extracted_data.json",
        JSON.stringify(extractedData, null, 2),
      );
    } finally {
      console.timeEnd("Exect time");
      await browser.close();
    }
  }
}

callbackCrawl(3);
