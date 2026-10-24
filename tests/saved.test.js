
import { jest } from "@jest/globals";

const mockFetch = jest.fn();

global.fetch = mockFetch;

document.body.innerHTML = `
  <div id="saved-jobs-container"></div>
  <p id="saved-status"></p>
  <span class="saved-meta"></span>
`;

await import("../saved.js");

const flushPromises = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("Saved jobs page", () => {
  beforeEach(() => {
    document.querySelector("#saved-jobs-container").replaceChildren();
    document.querySelector("#saved-status").textContent = "";
    document.querySelector(".saved-meta").textContent = "";
    mockFetch.mockReset();
    jest.restoreAllMocks();
  });

  test("displays saved jobs returned by the API", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          position: "Frontend Developer",
          company: "Example Ltd",
          url: "https://example.com/job"
        }
      ]
    });

    const { loadSavedJobs } = await import("../saved.js");
    await loadSavedJobs();

    expect(
      document.querySelector(".job-card h3").textContent
    ).toBe("Frontend Developer");

    expect(
      document.querySelector(".saved-meta").textContent
    ).toBe("1 saved");
  });

  test("shows a message when there are no saved jobs", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    const { loadSavedJobs } = await import("../saved.js");
    await loadSavedJobs();

    expect(
      document.querySelector("#saved-status").textContent
    ).toBe("You haven't saved any opportunities yet.");

    expect(
      document.querySelector(".saved-meta").textContent
    ).toBe("0 saved");
  });

  test("shows an error when loading saved jobs fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false
    });

    const { loadSavedJobs } = await import("../saved.js");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await loadSavedJobs();

    expect(
      document.querySelector("#saved-status").textContent
    ).toBe("Unable to load saved opportunities. Please try again.");

    consoleSpy.mockRestore();
  });
});
