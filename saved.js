const API_BASE_URL = "http://localhost:3000";

const savedJobsContainer = document.querySelector(
  "#saved-jobs-container"
);

const savedStatus = document.querySelector("#saved-status");

async function loadSavedJobs() {
  savedStatus.textContent = "Loading saved opportunities...";

  try {
    const response = await fetch(`${API_BASE_URL}/savedJobs`);

    if (!response.ok) {
      throw new Error("Unable to load saved opportunities.");
    }

    const savedJobs = await response.json();

    savedJobsContainer.replaceChildren();

    if (savedJobs.length === 0) {
      savedStatus.textContent = "You haven't saved any opportunities yet.";
      return;
    }

    savedJobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";

      const title = document.createElement("h3");
      title.textContent = job.position || job.title || "Untitled opportunity";

      const company = document.createElement("p");
      company.textContent = job.company || "Organization not specified";

      card.append(title, company);
      savedJobsContainer.appendChild(card);
    });

    savedStatus.textContent =
      `${savedJobs.length} saved opportunities.`;
  } catch (error) {
    console.error("Error loading saved jobs:", error);
    savedStatus.textContent =
      "Unable to load saved opportunities. Please try again.";
  }
}

loadSavedJobs();