#!/usr/bin/env node
/**
 * cli.js
 * -----------------
 * CLI entry point for tidy-reporter.
 * 
 * Usage:
 *   npx tidy-reporter generate <path-to-playwright-json>
 * 
 * Steps:
 *   1. Parse CLI arguments
 *   2. Load Playwright JSON report
 *   3. Normalize JSON via core/parser.js
 *   4. Generate HTML report via core/generator.js
 */

import fs from "fs";                     // File system operations
import path from "path";                 // Path utilities
import { fileURLToPath } from "url";     // For __dirname in ES modules

// Import core modules
import { parsePlaywrightJson } from "../core/parser.js";   // Function to normalize Playwright JSON
import { generateHtmlReport } from "../core/generator.js"; // Function to generate HTML report

// ----- Fix for ES modules: define __dirname -----
// In CommonJS, __dirname is automatically available. In ES modules, we need to define it manually.
const __filename = fileURLToPath(import.meta.url); // Convert the current module's URL (import.meta.url) to a file path
const __dirname = path.dirname(__filename);        // Get the directory part of the file path (equivalent of __dirname in CommonJS)

// ----- 1. Parse CLI arguments -----
// process.argv contains all command-line arguments
// process.argv[0] = node executable path
// process.argv[1] = path to this script (cli.js)
// process.argv[2+] = actual user-provided arguments
const args = process.argv.slice(2); // Skip first two elements to get only user input

// If no arguments are provided, show usage instructions and exit
if (args.length === 0) {
  console.log(`
Usage:
  npx tidy-reporter generate <path-to-playwright-json>

Example:
  npx tidy-reporter generate            # uses ./results.json by default
  npx tidy-reporter generate ./results.json
  `);
  process.exit(1); // Exit if no command provided
}

// First argument is the command ("generate")
const command = args[0];

// ----- 2. Handle "generate" command -----
if (command === "generate") {
  // Second argument is the input file path (optional). Default to "./results.json" if not provided.
  const inputFile = args[1] || "./results.json";

  // Convert relative file path to absolute path, based on the current working directory
  const inputPath = path.resolve(process.cwd(), inputFile);

  // Check if file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`); // Show error if file is missing
    process.exit(1);
  }

  console.log(`Reading Playwright JSON report from: ${inputPath}`);

  // ----- 3. Read and parse JSON -----
  let normalizedData;
  try {
    const rawJson = fs.readFileSync(inputPath, "utf-8"); // Read the JSON file content as a string
    const json = JSON.parse(rawJson);                    // Convert string to JavaScript object
    normalizedData = parsePlaywrightJson(json);          // Convert Playwright JSON into normalized format used internally by the reporter
  } catch (err) {
    console.error("Failed to parse Playwright JSON:", err.message); // Show error if reading or parsing fails
    process.exit(1);
  }

  // ----- 4. Generate HTML report -----
  // Output folder is fixed as "html-report" in the current working directory
  const outputDir = path.resolve(process.cwd(), "html-report");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir); // Create folder if it does not exist

  generateHtmlReport(normalizedData, outputDir); // Generate HTML report files in the output directory

  console.log(`Report generated at: ${outputDir}/index.html`);
} else {
  console.error(`Unknown command: ${command}`); // If user provides a command other than "generate", show an error
  process.exit(1);
}