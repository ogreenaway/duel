import { getCleanPlatform } from "@src/data_validation/tasks/getCleanPlatform";

describe("getCleanPlatform", () => {
  it('should return "TikTok" when given "TikTok"', () => {
    expect(getCleanPlatform("TikTok")).toBe("TikTok");
  });

  it('should return "Instagram" when given "Instagram"', () => {
    expect(getCleanPlatform("Instagram")).toBe("Instagram");
  });

  it('should return "Facebook" when given "Facebook"', () => {
    expect(getCleanPlatform("Facebook")).toBe("Facebook");
  });

  it("should return null when given invalid platform string", () => {
    expect(getCleanPlatform("Twitter")).toBeNull();
    expect(getCleanPlatform("YouTube")).toBeNull();
    expect(getCleanPlatform("tiktok")).toBeNull(); // lowercase
    expect(getCleanPlatform("INSTAGRAM")).toBeNull(); // uppercase
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanPlatform(null)).toBeNull();
    expect(getCleanPlatform(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanPlatform(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanPlatform(true)).toBeNull();
    expect(getCleanPlatform(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanPlatform({})).toBeNull();
    expect(getCleanPlatform([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanPlatform("")).toBeNull();
  });
});

