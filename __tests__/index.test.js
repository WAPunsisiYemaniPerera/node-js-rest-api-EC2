import request from "supertest";
import mongoose from "mongoose";
import index from "../index.js";

describe("GET /health", () => {
  let app = index;
  it("should return 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
