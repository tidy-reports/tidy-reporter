# Tidy Reporter
**Open-source HTML reporter for Playwright test results.**  
Generate HTML reports from Playwright `results.json` file.

---

## Installation

bash:
npm i tidy-reporter

Usage
1. Generate Playwright results

Set up the configuration file:

reporter:[

    ['json', { outputFile: 'results.json' }]

  ],

Run the command to execute the tests and generate a JSON file with the test results in the project root:

npx playwright test

2. Create HTML report

npx tidy-reporter generate

By default, it will look for ./results.json in the current directory.

3. After running this command, a folder called html-report will be created in the project root, containing the HTML report files.

## CLI Options

Usage:

  npx tidy-reporter generate [path-to-playwright-json]

Example:

  npx tidy-reporter generate

  npx tidy-reporter generate ./results.json

## Contributing
If you’d like to suggest a feature, improve documentation, or report a bug — please open a discussion or create an issue on GitHub.