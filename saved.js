const API_BASE_URL = "https://findora-dev2-0.onrender.com";

const savedJobsContainer = document.querySelector("#saved-jobs-container");
const savedStatus = document.querySelector("#saved-status");
const savedMeta = document.querySelector(".saved-meta");

let savedJobs = [];

async function loadSavedJobs() {

  try {
    const response = await fetch(`${API_BASE_URL}/savedJobs`);

    if (!response.ok) {
      throw new Error("Unable to load saved opportunities.");
    }

    savedJobs = await response.json();
    savedStatus.textContent = "";

    savedJobsContainer.replaceChildren();

    if (savedJobs.length === 0) {
      savedMeta.textContent = "0 saved";
      savedStatus.textContent = "You haven't saved any opportunities yet.";
      return;
    }

    savedMeta.textContent = `${savedJobs.length} saved`;

    savedJobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";

      const title = document.createElement("h3");
      title.textContent = job.position || job.title || "Untitled opportunity";

      const company = document.createElement("p");
      company.textContent = job.company || "Organization not specified";


      // Create the filled bookmark button
      const bookmarkButton = document.createElement("button");
      bookmarkButton.className = "bookmark saved";
      bookmarkButton.type = "button";
      bookmarkButton.setAttribute("aria-label", "Remove from saved"); bookmarkButton.setAttribute("aria-pressed", "true");



      bookmarkButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24"
          fill="currentColor" stroke="currentColor" stroke-width="2">
        <path d="M6 3h12v18l-6-4-6 4z"></path>
      </svg>
    `;

      bookmarkButton.addEventListener("click", () => {
        deleteSavedJob(job.id, card)
      })


      const link = document.createElement("a");
      link.href = job.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View job";
      link.className = "view-job-link";

      card.append(bookmarkButton, title, company);

      if (job.url) {
        card.appendChild(link);
      }

      savedJobsContainer.appendChild(card);

    });


  } catch (error) {
    console.error("Error loading saved jobs:", error);
    savedStatus.textContent =
      "Unable to load saved opportunities. Please try again.";
  }
}


async function deleteSavedJob(id, card) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/savedJobs/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Unable to delete saved opportunity.");
    }

    card.remove();
    await loadSavedJobs();
  } catch (error) {
    console.error("Error deleting saved job:", error);
    savedStatus.textContent =
      "Unable to remove opportunity. Please try again.";
  }
}


loadSavedJobs();
export { loadSavedJobs, deleteSavedJob };