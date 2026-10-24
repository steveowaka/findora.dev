
import { jest } from "@jest/globals";

describe("Findora job listings", () => {
  let app;

  beforeAll(async () => {
    document.body.innerHTML = `
      <div id="jobs-container"></div>
      <p id="status-message"></p>
      <form id="job-search-form">
        <input id="keyword-input" />
        <input id="location-input" />
        <button type="submit">Search</button>
      </form>
    `;

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    app = await import("../webapp.js");
  });

  beforeEach(() => {
    document.querySelector("#jobs-container").replaceChildren();
    document.querySelector("#status-message").textContent = "";
    document.querySelector("#keyword-input").value = "";
    document.querySelector("#location-input").value = "";
  });

  test("displays a message when no jobs match", () => {
    app.displayFilteredJobs([]);

    expect(
      document.querySelector("#status-message").textContent
    ).toBe("No matching jobs found. Try another search.");
  });

  test("renders job cards with their details", () => {
    app.displayFilteredJobs([
      {
        id: "1",
        position: "Frontend Developer",
        company: "Example Ltd",
        location: "Remote",
        url: "https://example.com/job"
      }
    ]);

    expect(
      document.querySelector(".job-card h3").textContent
    ).toBe("Frontend Developer");

    expect(
      document.querySelector(".job-card a").textContent
    ).toBe("View job");

    expect(
      document.querySelector("#status-message").textContent
    ).toBe("1 matching jobs found.");
  });

  test("shows fallback text when company or location is missing", () => {
    app.displayFilteredJobs([
      {
        id: "2",
        position: "Software Engineer",
        url: "https://example.com/job"
      }
    ]);

    const card = document.querySelector(".job-card");

    expect(card.textContent).toContain("Company not specified");
    expect(card.textContent).toContain("Location not specified");
  });

  test("filters jobs by keyword and location", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          position: "Frontend Developer",
          company: "Example Ltd",
          location: "Kenya",
          url: "https://example.com/1"
        },
        {
          id: "2",
          position: "Backend Developer",
          company: "Another Ltd",
          location: "United States",
          url: "https://example.com/2"
        }
      ]
    });

    await app.displayJobs();

    document.querySelector("#keyword-input").value = "frontend";
    document.querySelector("#location-input").value = "kenya";

    const results = app.filterJobs();

    expect(results).toHaveLength(1);
    expect(results[0].position).toBe("Frontend Developer");
  });

  test("displays an error when job loading fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });

    await app.displayJobs();

    expect(
      document.querySelector("#status-message").textContent
    ).toBe("Unable to load jobs. Please try again later.");

    consoleSpy.mockRestore();
  });
});
