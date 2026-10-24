import { jest } from "@jest/globals";
import {
    replaceManagedJob,
    updateManagedJobStatus
} from "../managedjobs.js";

describe("Managed opportunities API", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("PUT replaces a managed opportunity", async () => {
        const updatedJob = {
            id: "1",
            title: "Junior Frontend Developer",
            company: "Test Company",
            status: "Interested",
            url: "https://example.com"
        };

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => updatedJob
        });

        const result = await replaceManagedJob("1", updatedJob);

        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:3000/managedJobs/1",
            expect.objectContaining({ method: "PUT" })
        );
        expect(result.title).toBe("Junior Frontend Developer");
    });

    test("PATCH updates application status", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ id: "1", status: "Applied" })
        });

        const result = await updateManagedJobStatus("1", "Applied");

        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:3000/managedJobs/1",
            expect.objectContaining({ method: "PATCH" })
        );
        expect(result.status).toBe("Applied");
    });

    test("PATCH rejects an invalid status", async () => {
        await expect(
            updateManagedJobStatus("1", "Unknown")
        ).rejects.toThrow("Invalid application status.");

        expect(global.fetch).not.toHaveBeenCalled();
    });
});