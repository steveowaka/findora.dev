
import { fetchRemoteJobs } from "./api.js";

const jobsContainer = document.querySelector("#jobs-container");
const statusMessage = document.querySelector("#status-message");

async function displayJobs() {
  if (!jobsContainer || !statusMessage) {
    console.error("The jobs container or status message is missing.");
    return;
  }

  statusMessage.textContent = "Loading remote jobs...";

  try {
    const jobs = await fetchRemoteJobs();

    jobsContainer.replaceChildren();

    if (jobs.length === 0) {
      statusMessage.textContent = "No remote jobs found.";
      return;
    }

    jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";

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

      card.append(title, company, location, link);
      jobsContainer.appendChild(card);
    });

    statusMessage.textContent = `${jobs.length} remote jobs found.`;
  } catch (error) {
    console.error("Failed to display remote jobs:", error);
    statusMessage.textContent =
      "Unable to load jobs. Please try again later.";
  }
}
 displayJobs()