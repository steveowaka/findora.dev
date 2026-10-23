
import { fetchRemoteJobs } from "./api.js";
const API_BASE_URL = "http://localhost:3000";

const jobsContainer = document.querySelector("#jobs-container");
const statusMessage = document.querySelector("#status-message");
const searchForm = document.querySelector("#job-search-form");
const keywordInput = document.querySelector("#keyword-input");
const locationInput = document.querySelector("#location-input");

let allJobs = [];
let savedJobs = [];

async function loadSavedJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/savedJobs`);

    if (!response.ok) {
      throw new Error("Unable to load saved jobs.");
    }

    savedJobs = await response.json();
  } catch (error) {
    console.error("Failed to load saved jobs:", error);
  }
}

function isJobSaved(job) {
  return savedJobs.some(
    (savedJob) => String(savedJob.remoteId) === String(job.id)
  );
}

async function toggleSavedJob(job, bookmarkButton) {
  const savedJob = savedJobs.find(
    (item) => String(item.remoteId) === String(job.id)
  );

  try {
    if (savedJob) {
      // Remove the job from saved opportunities
      const response = await fetch(
        `${API_BASE_URL}/savedJobs/${encodeURIComponent(savedJob.id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not remove saved job.");
      }

      savedJobs = savedJobs.filter(
        (item) => String(item.remoteId) !== String(job.id)
      );

      bookmarkButton.classList.remove("saved");
      bookmarkButton.setAttribute("aria-label", "Save opportunity");
      bookmarkButton.setAttribute("aria-pressed", "false");
    } else {
      // Save the job
      const response = await fetch(`${API_BASE_URL}/savedJobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          remoteId: String(job.id),
          position: job.position,
          company: job.company || "Company not specified",
          location: job.location || "Location not specified",
          url: job.url,
          source: "Remote OK"
        })
      });

      if (!response.ok) {
        throw new Error("Could not save job.");
      }

      const newSavedJob = await response.json();
      savedJobs.push(newSavedJob);

      bookmarkButton.classList.add("saved");
      bookmarkButton.setAttribute("aria-label", "Remove from saved");
      bookmarkButton.setAttribute("aria-pressed", "true");
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    statusMessage.textContent =
      "Unable to update saved opportunities. Please try again.";
  }
}


function filterJobs() {
    const keyword = keywordInput.value.trim().toLowerCase();
    const location = locationInput.value.trim().toLowerCase();

  return allJobs.filter((job) => {
    const title = (job.position || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const jobLocation = (job.location || "").toLowerCase();

    const matchesKeyword =
      !keyword ||
      title.includes(keyword) ||
      company.includes(keyword);

    const matchesLocation =
      !location || jobLocation.includes(location);

    return matchesKeyword && matchesLocation;
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const filteredJobs = filterJobs();

  displayFilteredJobs(filteredJobs);
});


function displayFilteredJobs(jobs) {
  jobsContainer.replaceChildren();

  if (jobs.length === 0) {
    statusMessage.textContent = "No matching jobs found. Try another search.";
    return;
  }

  jobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";

    const cardTop = document.createElement("div");
    cardTop.className = "job-card-top";
// svg
    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "bookmark";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Save opportunity");
    bookmarkButton.setAttribute("aria-pressed", "false");

    bookmarkButton.addEventListener("click", async () => {
  await toggleSavedJob(job, bookmarkButton);
 });


    if (isJobSaved(job)) {
    bookmarkButton.classList.add("saved");
    bookmarkButton.setAttribute("aria-label", "Remove from saved");
    bookmarkButton.setAttribute("aria-pressed", "true");
  }


    bookmarkButton.innerHTML = `
        <svg
            width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
    >
        <path d="M6 3h12v18l-6-4-6 4z"></path>
    </svg>
    `;

    const title = document.createElement("h3");
    title.textContent = job.position;

    const company = document.createElement("p");
    company.textContent = job.company || "Company not specified";

    const location = document.createElement("p");
    location.textContent = job.location
      ? `Location: ${job.location}`
      : "Location not specified";

    const jobType = document.createElement("span");
    jobType.className = "job-type";
    jobType.textContent = "Remote Job";

    const link = document.createElement("a");
    link.href = job.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View job";

    cardTop.append(jobType, bookmarkButton)
    card.append(cardTop, title, company, location, link);
    jobsContainer.appendChild(card);
  });

  statusMessage.textContent = `${jobs.length} matching jobs found.`;
}

async function displayJobs() {
  if (!jobsContainer || !statusMessage) {
    console.error("The jobs container or status message is missing.");
    return;
  }

  statusMessage.textContent = "Loading remote jobs...";

  try {
    allJobs = await fetchRemoteJobs();
    const jobs = allJobs

    jobsContainer.replaceChildren();

    if (jobs.length === 0) {
      statusMessage.textContent = "No remote jobs found.";
      return;
    }

    jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";
    // svg

        const cardTop = document.createElement("div");
        cardTop.className = "job-card-top";

        const bookmarkButton = document.createElement("button");
        bookmarkButton.className = "bookmark";
        bookmarkButton.type = "button";
        bookmarkButton.setAttribute("aria-label", "Save opportunity");
        bookmarkButton.setAttribute("aria-pressed", "false");

        bookmarkButton.addEventListener("click", async () => {
        await toggleSavedJob(job, bookmarkButton);
      });

        if (isJobSaved(job)) {
        bookmarkButton.classList.add("saved");
        bookmarkButton.setAttribute("aria-label", "Remove from saved");
        bookmarkButton.setAttribute("aria-pressed", "true");
        }

        bookmarkButton.innerHTML = `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path d="M6 3h12v18l-6-4-6 4z"></path>
        </svg>
        `;

      const title = document.createElement("h3");
      title.textContent = job.position;

      const company = document.createElement("p");
      company.textContent = job.company || "Company not specified";


      const location = document.createElement("p");
      location.textContent = job.location
      ? `Location: ${job.location}`
    : "Location not specified";

    //   const jobType = document.createElement("span");
    //   jobType.className = "job-type";
    //   jobType.textContent = "Remote Job";


      const link = document.createElement("a");
      link.href = job.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View job";


      cardTop.append(bookmarkButton);
      card.append(cardTop, title, company, location, link);
      jobsContainer.appendChild(card);
    });

    statusMessage.textContent = `${jobs.length} remote jobs found.`;
  } catch (error) {
    console.error("Failed to display remote jobs:", error);
    statusMessage.textContent =
      "Unable to load jobs. Please try again later.";
  }
}
//  displayJobs()

async function initializeJobs() {
  await loadSavedJobs();
  await displayJobs();
}

initializeJobs();