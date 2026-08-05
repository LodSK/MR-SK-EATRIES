import { cn } from "./cn";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false && "hidden", undefined, null, "text-sm")).toBe("px-2 text-sm");
  });

  it("resolves conflicting Tailwind utilities in favor of the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("supports conditional object syntax", () => {
    expect(cn("base", { "text-red-500": true, "text-blue-500": false })).toBe("base text-red-500");
  });
});
