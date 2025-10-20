/**
 * app.js
 * -----------------
 * Main JS logic for tidy-reporter
 * - Reads JSON data injected by CLI
 * - Renders summary cards
 * - Renders table of tests
 * - Adds search and status filter functionality
 */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // ===== 1. Get JSON data =====
  const dataScript = document.getElementById("report-data");
  if (!dataScript) {
    console.error("Report data not found!");
    return;
  }

  // Parse the JSON string into a JavaScript object
  const reportData = JSON.parse(dataScript.textContent);

  // ===== 2. Populate summary =====
  // Get the summary object or create an empty one if missing
  const summary = reportData.summary || {};

  // Update summary card values with report data or fallback to 0/defaults
  document.getElementById("passed-count").textContent = summary.passed || 0;
  document.getElementById("failed-count").textContent = summary.failed || 0;
  document.getElementById("skipped-count").textContent = summary.skipped || 0;
  document.getElementById("total-count").textContent = summary.total || 0;
  document.getElementById("total-duration").textContent = summary.duration
    ? summary.duration + " ms"
    : "0 ms";
  document.getElementById("pass-rate").textContent = summary.passRate || "0%";

  // ===== 3. Populate tests table =====
  // Get the table body element where test rows will be rendered
  const tbody = document.getElementById("tests-body");
  // Extract all test results or use an empty array if missing
  const tests = reportData.tests || [];

  // Function to render table rows with optional filters
  function renderTableRows(filterStatus = "all", searchQuery = "") {
    // Clear previous rows
    tbody.innerHTML = "";

    // Loop through all tests
    tests.forEach((test, index) => {
      // Get test status or mark as "unknown"
      const status = test.status || "unknown";

      // Apply status filter
      if (filterStatus !== "all" && status !== filterStatus) return;

      // Apply case-insensitive search filter on test name
      if (searchQuery && !test.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return;

      // Create a new table row element
      const tr = document.createElement("tr");

      // Fill row with test details using template literals
     
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${test.name}</td>
        <td class="status-${status}">${status.toUpperCase()}</td>
        <td>${test.duration || 0} ms</td>
        <td>${test.project || "default"}</td>
        <td>${test.file || ""}</td>
        
      `;

      // Add the row to the table body
      tbody.appendChild(tr);
    });
  }

  // Initial table render (show all tests by default)
  renderTableRows();

  // ===== 4. Filters =====
  // Get filter dropdown and search input elements
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");

  // If status filter exists, listen for changes
  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      // Get current filter values
      const status = statusFilter.value;
      const query = searchInput ? searchInput.value : "";
      // Re-render table with new filters
      renderTableRows(status, query);
    });
  }

  // If search input exists, listen for typing events
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value;
      const status = statusFilter ? statusFilter.value : "all";
      // Re-render table with updated search and filter
      renderTableRows(status, query);
    });
  }

  // ===== 5. Show report and hide loading =====
  // Find report container and loading spinner elements
  const reportContainer = document.getElementById("report-container");
  const loading = document.querySelector(".loading");
   // Display the report once everything is ready
  if (reportContainer) reportContainer.style.display = "block";
  // Hide the loading spinner
  if (loading) loading.style.display = "none";

  // ===== 6. Add timestamp =====
  const timestampEl = document.querySelector(".footer .timestamp");
  if (timestampEl) {
    const now = new Date();
    timestampEl.textContent = `Generated on ${now.toLocaleString()}`;
  }
});