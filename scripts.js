import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import translate from "google-translate-api-x";
import { PDFParse } from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function crawlingRPA() {
  console.time("Exect time");
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

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

  try {
    await page.goto("https://the-internet.herokuapp.com/download", {
      waitUntil: "domcontentloaded",
    });

    const downloadPromise = page.waitForEvent("download", {
      timeout: 6000,
    });

    const downloadLink = page.locator(
      ".example a[href*='P12_TestOtomasyonuFullPage.pdf']",
    );
    await downloadLink.first().click();

    const download = await downloadPromise;

    const downloadFolder = path.join(__dirname, "downloads");

    const suggestedFilneName = download.suggestedFilename();
    const finalPath = path.join(downloadFolder, suggestedFilneName);

    await download.saveAs(finalPath);
    console.log(`Download complete: ${finalPath}`);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
    console.timeEnd("Exec time");
  }
}

async function mergePDFs() {
  try {
    console.time("Exec time");
    const [file1Bypes, file2Bytes] = await Promise.all([
      fs.promises.readFile("helper_files/CV_Asafe-Alves(EN).pdf"),
      fs.promises.readFile("helper_files/CV_Asafe-Alves(PT).pdf"),
    ]);

    const mergedPdf = await PDFDocument.create();

    const pdf1 = await PDFDocument.load(file1Bypes);
    const pdf2 = await PDFDocument.load(file2Bytes);

    const pdf1Pages = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
    const pdf2Pages = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());

    pdf1Pages.forEach((page) => mergedPdf.addPage(page));
    pdf2Pages.forEach((page) => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();
    await fs.promises.writeFile("downloads/merged_doc.pdf", mergedPdfBytes);
  } catch (error) {
    console.error(error);
  } finally {
    console.timeEnd("Exec time");
  }
}

async function translatePDF() {
  try {
    console.time("Exec time");

    const pdfBuffer = await fs.promises.readFile(
      "helper_files/korean_sample.pdf",
    );
    const parser = new PDFParse({ data: pdfBuffer });
    const parsedData = await parser.getText();
    const originalText = parsedData.text.trim();

    const translateResult = await translate(originalText, { to: "en" });
    const translatedText = translateResult.text;

    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height, width } = firstPage.getSize();

    firstPage.drawRectangle({
      x: 50,
      y: height - 400,
      width: width - 100,
      height: 350,
      color: rgb(1, 1, 1),
    });

    firstPage.drawText(translatedText, {
      x: 55,
      y: height - 70,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
      maxWidth: width - 110,
      lineHeight: 16,
    });

    const translatedPdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(
      "downloads/translated_sample.pdf",
      translatedPdfBytes,
    );
  } catch (error) {
    console.error(error);
  } finally {
    console.timeEnd("Exec time");
  }
}

const scripts = {
  crawlingRPA,
  mergePDFs,
  translatePDF,
};

export default scripts;
