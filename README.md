# Tidy Reporter
**Open-source HTML reporter for Playwright test results.**  
Generate HTML reports from Playwright `results.json` file.

---

## Installation

bash:
npm i tidy-reporter

Usage
1. Generate Playwright results
2. Create HTML report

npx tidy-reporter generate

By default, it will look for ./results.json in the current directory.

3. After running this command, a folder called html-report will be created in the project root, containing the HTML report files.

## CLI Options

Usage:

  tidy-reporter generate [path-to-playwright-json]

Example:

  tidy-reporter generate

  tidy-reporter generate ./results.json

## Contributing
If you’d like to suggest a feature, improve documentation, or report a bug — please open a discussion or create an issue on GitHub.