const puppeteer = require("puppeteer");
const path = require("path");
const chromium = require("chrome-aws-lambda");

async function generatePDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    args: [...chromium.args],
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  // await page.pdf({ path: outputPath, format: "A4" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });
  await browser.close();
  return pdfBuffer;
}

let defaultLocation = path.join(__dirname, "../public/pdf");
exports.createPDF = async (
  htmlContent,
  fileName = "output.pdf",
  location = defaultLocation
) => {
  try {
    let filePathWithName = `${location}/${fileName}`;
    let buffer = await generatePDF(htmlContent, filePathWithName);
    return buffer;
  } catch (err) {
    console.log(err);
    return false;
  }
};
