import { cache } from "./cache";

jest.mock("../db/redis.js", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn()
  }
}));

describe("cache middleware", () => {
  it("stores the response body when the route responds with res.send(object)", async () => {
    const redisClient = (await import("../db/redis.js")).default as any;
    redisClient.get.mockResolvedValue(null);
    redisClient.setEx.mockResolvedValue("OK");

    const req = {
      originalUrl: "/api/v1/property/fake-slug"
    } as any;

    const res = {
      send: jest.fn(),
      json: jest.fn()
    } as any;

    const next = jest.fn();

    await cache(600)(req, res, next);

    const body = { id: "1", title: "Fake" };
    res.send(body);

    expect(redisClient.setEx).toHaveBeenCalledWith(
      "cache:/api/v1/property/fake-slug",
      600,
      JSON.stringify(body)
    );
  });
});
