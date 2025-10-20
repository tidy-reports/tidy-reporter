/**
 * generator.js
 * -----------------
 * This module takes normalized test data and generates
 * a complete static HTML report in the "html-report" folder.
 *
 * Steps:
 *   1. Copy template files (index.html, style.css, app.js)
 *   2. Inject test data into the HTML template
 *   3. Save the final report to /html-report/index.html
 */

// Import Node.js built-in modules for file and path operations
import fs from "fs"; // 'fs' = File System, allows reading/writing/copying files
import path from "path"; // 'path' helps manipulate and resolve file paths
import { fileURLToPath } from "url"; // Converts 'file://' URLs to normal file system paths

// Fix __dirname for ES modules
// In ES modules, __dirname and __filename are not defined by default
// The next two lines recreate them manually

// Convert the current module’s URL (import.meta.url) into a local file path
const __filename = fileURLToPath(import.meta.url);

// Extract only the directory part of that path (without the filename)
const __dirname = path.dirname(__filename);

/**
 * Generate the HTML report
 * @param {object} data - normalized data from parser.js
 * @param {string} outputDir - path to /html-report
 */
export function generateHtmlReport(data, outputDir) {
  // Log message to console so the user knows report generation started
  console.log("Generating HTML report...");

  // ----- 1. Define paths -----
  // Construct the absolute path to the "template" folder
  // __dirname ensures we start from this file’s directory
  const templateDir = path.resolve(__dirname, "../template");

  // Construct the full path where the final "index.html" will be written
  const outputPath = path.resolve(outputDir, "index.html");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
     // If not, create it recursively (creates nested folders if necessary)
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ----- 2. Copy static assets (style.css, app.js) -----
  // These are the static files needed for the HTML report’s layout and behavior
  const staticFiles = ["style.css", "app.js"];

  // Loop through each file name in the array
  for (const file of staticFiles) {
    // Build the source file path (inside the template folder)
    const src = path.join(templateDir, file);
    // Build the destination path (inside the output folder)
    const dest = path.join(outputDir, file);
    // Copy each file from source to destination synchronously
    fs.copyFileSync(src, dest);
  }

  // ----- 3. Load the HTML template -----
  // Define the path to the HTML template file (index.html)
  const templatePath = path.join(templateDir, "index.html");

  // Verify the file exists — if not, show an error and exit the process
  if (!fs.existsSync(templatePath)) {
    console.error("Missing template/index.html file!");
    process.exit(1); // Exit the program with error code 1 (failure)
  }
  // Read the HTML file’s contents as a UTF-8 encoded string
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  // ----- 4. Inject JSON data -----
  // Convert the 'data' object into a JSON string, formatted with 2-space indentation
  const jsonData = JSON.stringify(data, null, 2);

  // Insert the JSON string into the HTML template right before the closing </body> tag.
  // The <script> tag holds JSON data that can later be read by client-side JS.
  const injectedHtml = htmlTemplate.replace(
    "</body>", // Find the closing body tag
    `  <script id="report-data" type="application/json">${jsonData}</script>\n</body>`
  );

  // ----- 5. Write the final HTML file -----
  // Save the modified HTML string as the new index.html in the output folder
  fs.writeFileSync(outputPath, injectedHtml, "utf-8");

  // Log a success message with the full path of the generated report
  console.log(`HTML report successfully created at: ${outputPath}`);
}