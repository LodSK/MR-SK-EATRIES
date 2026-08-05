import { ApiError } from "@/utils/ApiError";

describe("ApiError factories", () => {
  it.each([
    ["badRequest", 400],
    ["unauthorized", 401],
    ["forbidden", 403],
    ["notFound", 404],
    ["conflict", 409],
    ["tooManyRequests", 429],
    ["internal", 500],
  ] as const)("%s produces status %i", (factory, status) => {
    const error = ApiError[factory]();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(status);
    expect(error.isOperational).toBe(true);
  });

  it("carries a custom message and details through", () => {
    const error = ApiError.badRequest("Invalid email", { field: "email" });
    expect(error.message).toBe("Invalid email");
    expect(error.details).toEqual({ field: "email" });
  });

  it("has a real stack trace", () => {
    const error = ApiError.notFound();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("ApiError");
  });
});
