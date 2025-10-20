// core/parser.js
/**
 * parser.js
 * -----------------
 * Converts Playwright's results.json into a simple structure for HTML front-end
 */

export function parsePlaywrightJson(playwrightJson) {
  // Initialize an empty array to store all parsed test results
  const tests = [];

  function extractTests(suite) {
    if (!suite) return;

    // Handle the "specs" array (used in modern Playwright report format)
    if (suite.specs) {
      suite.specs.forEach(spec => {
        // Get the first result object from the spec (contains status, duration, etc.)
        const firstResult = spec.results && spec.results[0];
        // Determine the test status: use result status or fallback to "ok" flag
        const status = firstResult?.status || (spec.ok ? "passed" : "failed");
        // Extract test duration or use 0 if missing
        const duration = firstResult?.duration || 0;
        // Extract error message if it exists, otherwise null
        const error = firstResult?.error?.message || null;

        // Push a simplified test object into the tests array
        tests.push({
          title: spec.title,
          fullTitle: `${suite.title} > ${spec.title}`,
          status,
          duration,
          file: suite.file || suite.title || "unknown",
          error,
        });
      });
    }

     // If the suite contains nested suites, process them recursively
    if (suite.suites && suite.suites.length > 0) {
      suite.suites.forEach(subSuite => extractTests(subSuite));
    }
  }

  // Start parsing from the top-level suites if available
  if (playwrightJson.suites) {
    playwrightJson.suites.forEach(extractTests);
  } else {
    console.warn("No suites found in Playwright JSON.");
  }

  // Summary
  const summary = {
    total: tests.length,                                            // Total number of tests
    passed: tests.filter(t => t.status === "passed").length,        // Number of passed tests
    failed: tests.filter(t => t.status === "failed").length,        // Number of failed tests
    skipped: tests.filter(t => t.status === "skipped").length,      // Number of skipped tests
    duration: tests.reduce((sum, t) => sum + (t.duration || 0), 0), // Total test duration
  };

   // Calculate the pass rate as a percentage string
  summary.passRate = summary.total
    ? `${Math.round((summary.passed / summary.total) * 100)}%`
    : "0%";

  return { summary, tests };
}