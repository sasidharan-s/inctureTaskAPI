const puppeteer = require("puppeteer");
const path = require("path");

async function generatePDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: "A4" });
  await browser.close();
}

// Example usage
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>My PDF</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a test PDF generated using Puppeteer.</p>
</body>
</html>
`;

let defaultLocation = path.join(__dirname, "../public/pdf");
exports.createPDF = async (
  htmlContent,
  fileName = "output.pdf",
  location = defaultLocation
) => {
  try {
    let filePathWithName = `${location}/${fileName}`;
    await generatePDF(htmlContent, filePathWithName);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
