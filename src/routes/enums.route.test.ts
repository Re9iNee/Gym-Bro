import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";
import { ENUMS } from "../lib/constants";

const fetch = request(app);
describe("ENUMS Route", () => {
  it("should return list of all enums", async () => {
    const response = await fetch.get("/enums");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: "OK", data: ENUMS });
  });
});
