
const API_BASE_URL = "http://localhost:3000";

// PUT: Replace an existing managed opportunity
export async function replaceManagedJob(id, jobData) {
  const response = await fetch(
    `${API_BASE_URL}/managedJobs/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jobData)
    }
  );

  if (!response.ok) {
    throw new Error("Unable to replace managed opportunity.");
  }

  return response.json();
}

// PATCH: Update only the application status
export async function updateManagedJobStatus(id, status) {
  const allowedStatuses = ["Interested", "Applied", "Rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid application status.");
  }

  const response = await fetch(
    `${API_BASE_URL}/managedJobs/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  if (!response.ok) {
    throw new Error("Unable to update application status.");
  }

  return response.json();
}
