
import { jest } from "@jest/globals";
import { fetchRemoteJobs } from "../api.js";

describe("Remote OK API", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("fetches jobs successfully", async () => {
        const jobs = [
            { id: "101", position: "Frontend Developer" },
            { id: "102", position: "Backend Developer" }
        ];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => jobs
        });

        const result = await fetchRemoteJobs();

        expect(global.fetch).toHaveBeenCalledWith(
            "https://remoteok.com/api"
        );
        expect(result).toEqual(jobs);
    });

    test("throws an error when the request fails", async () => {
        global.fetch.mockResolvedValue({
            ok: false
        });

        await expect(fetchRemoteJobs()).rejects.toThrow(
            "unable to fetch rempte jobs."
        );
    });

    test("throws an error when the response is not an array", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: "Invalid data" })
        });

        await expect(fetchRemoteJobs()).rejects.toThrow(
            "The API returned an invalid response"
        );
    });

    test("filters out invalid job records", async () => {
        const jobs = [
            { id: "101", position: "Frontend Developer" },
            { id: "102" },
            { position: "Backend Developer" },
            null,
            { id: "103", position: "Software Engineer" }
        ];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => jobs
        });

        const result = await fetchRemoteJobs();

        expect(result).toEqual([
            { id: "101", position: "Frontend Developer" },
            { id: "103", position: "Software Engineer" }
        ]);
    });
});
