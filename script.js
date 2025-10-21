// Data object 'data' is assumed to be available globally from data.js

document.addEventListener("DOMContentLoaded", () => {
  // Data rendering starts immediately on DOMContentLoaded.

  // Ensure the data object is available before attempting to render
  if (typeof data !== "undefined" && Object.keys(data).length > 0) {
    displayData(data);
  } else {
    console.error("Data variable not found or is empty. Check data.js.");
    document.getElementById("entries").innerHTML =
      '<p style="text-align: center; color: #f87171;">No data entries found to display.</p>';
  }
});

/**
 * Renders the progress data into the DOM container.
 * @param {object} data The object containing all progress entries.
 */
function displayData(data) {
  const container = document.getElementById("entries");

  // Custom sort function: Extracts the day number to ensure correct chronological sorting
  // It sorts by the number found in "(Day X)"
  const dates = Object.keys(data)
    .sort((a, b) => {
      const dayA = parseInt(a.match(/Day (\d+)/)?.[1] || 0);
      const dayB = parseInt(b.match(/Day (\d+)/)?.[1] || 0);
      return dayA - dayB; // Sort ascending (Day 1, Day 2, ...)
    })
    .reverse(); // Reverse to display latest day first

  dates.forEach((date) => {
    const entry = data[date];
    const div = document.createElement("div");

    // CORE STYLING: Apply the single custom class
    div.className = "day-entry";

    let html = `<h2>${date}</h2>`;

    // Helper function to dynamically generate HTML for each category
    const generateCategoryHtml = (title, icon, content) => {
      let contentHtml = "";

      if (typeof content === "string") {
        // Simple string content (e.g., Study, Expenses)
        contentHtml = `<p>${content}</p>`;
      } else if (typeof content === "object" && content !== null) {
        // Detailed list content (e.g., Exercise, CP)
        let totalProblems = 0;
        contentHtml = `<ul class="category-list">`;

        for (let key in content) {
          const value = content[key];
          if (title.includes("Competitive Programming")) {
            // CP Specific Formatting
            // Ensure the value is a number for summation
            if (typeof value === "number") {
              totalProblems += value;
            }

            contentHtml += `
                            <li>
                                <span class="cp-rating-label">Rating ${key}</span>
                                <span class="cp-value">${value} problem${
              value !== 1 ? "s" : ""
            } solved</span>
                            </li>
                        `;
          } else {
            // Exercise Specific Formatting
            contentHtml += `
                            <li>
                                <span class="exercise-key">${
                                  key.charAt(0).toUpperCase() + key.slice(1)
                                }:</span>
                                <span class="exercise-value">${value}</span>
                            </li>
                        `;
          }
        }
        contentHtml += `</ul>`;

        // Add total CP problems summary box
        if (title.includes("Competitive Programming") && totalProblems > 0) {
          contentHtml = `
                        <div class="cp-summary-box">
                            <p>Total Solved: <span>${totalProblems}</span></p>
                        </div>
                        ${contentHtml}
                    `;
        }
      }

      // Return the complete category block
      return `
                <div class="category">
                    <h3>
                        ${icon} <span>${title}</span>
                    </h3>
                    ${contentHtml}
                </div>
            `;
    };

    // Render each category based on available data
    if (entry.exercise) {
      html += generateCategoryHtml("Exercise", "🏋️", entry.exercise);
    }

    if (entry.study) {
      html += generateCategoryHtml("Study", "📚", entry.study);
    }

    if (entry.CP) {
      html += generateCategoryHtml(
        "Competitive Programming (CP)",
        "💻",
        entry.CP
      );
    }

    if (entry.expenses) {
      html += generateCategoryHtml("Expenses", "💰", entry.expenses);
    }

    div.innerHTML = html;
    container.appendChild(div);
  });
}
