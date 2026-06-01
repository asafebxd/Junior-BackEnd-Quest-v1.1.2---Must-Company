import * as fs from "fs";
import * as path from "path";
import scripts from "./scripts";
import { callbackCrawl } from "./callbackCrawl";

beforeAll(async () => {
  const files = await fs.promises.readdir("downloads");

  await Promise.all(
    files.map((file) =>
      fs.promises.rm(path.join("downloads", file), {
        recursive: true,
        force: true,
      }),
    ),
  );
});

describe("Automated unit tests for scripts validation", () => {
  test("Test 'scripts.crawlingRPA()' behaivor", async () => {
    await scripts.crawlingRPA();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const extractedFile = await fs.promises.stat("downloads/test_document.pdf");

    expect(extractedFile.isFile()).toBe(true);
  }, 10000);

  test("Test 'scripts.mergePDFs()' behaivor", async () => {
    await scripts.mergePDFs();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mergedFile = await fs.promises.stat("downloads/merged_doc.pdf");

    expect(mergedFile.isFile()).toBe(true);
  });

  test("Test 'scripts.translatePDF()' behaivor", async () => {
    await scripts.translatePDF();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mergedFile = await fs.promises.stat(
      "downloads/translated_sample.pdf",
    );

    expect(mergedFile.isFile()).toBe(true);
  });

  test("Test 'callbackCrawl() behaivor", async () => {
    await callbackCrawl(0);

    await new Promise((resolve) => setTimeout(resolve, 6000));

    const exctractedFile = await fs.promises.readFile(
      "downloads/extracted_data.json",
    );
    const parsedFile = JSON.parse(exctractedFile);

    expect(parsedFile[0]).toEqual({
      text: "“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”",
      author: "Albert Einstein",
      tags: ["change", "deep-thoughts", "thinking", "world"],
    });
  }, 10000);
});
