import { describe, expect, it } from "vitest";
import app from "./app";
import request from "supertest";

describe("GET /", () => {
  it('responds with "Gym Bro API', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Gym Bro API");
  });
});
