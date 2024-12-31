import requestFn from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import validateToken from "../middleware/validate-token.middleware";

vi.mock("../middleware/validate-token.middleware", () => {
  return { default: vi.fn((req, res, next) => next()) };
});

const fetch = requestFn(app);
describe("Change Password Route", () => {
  it("should call validate token middleware", async () => {
    await fetch
      .post("/change-password/")
      .query({ token: "something" })
      .send({ password: "newPassword" });

    expect(validateToken).toHaveBeenCalled();
  });
});
