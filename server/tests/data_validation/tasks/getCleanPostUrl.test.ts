import { getCleanPostUrl } from "@src/data_validation/tasks/getCleanPostUrl";

describe("getCleanPostUrl", () => {
  it("should return valid URL when given a valid HTTP URL", () => {
    const url = "http://example.com/post";
    expect(getCleanPostUrl(url)).toBe(url);
  });

  it("should return valid URL when given a valid HTTPS URL", () => {
    const url = "https://example.com/post";
    expect(getCleanPostUrl(url)).toBe(url);
  });

  it("should return valid URL when given a URL with path", () => {
    const url = "https://instagram.com/p/ABC123";
    expect(getCleanPostUrl(url)).toBe(url);
  });

  it("should return valid URL when given a URL with query parameters", () => {
    const url = "https://example.com/post?id=123&ref=test";
    expect(getCleanPostUrl(url)).toBe(url);
  });

  it("should return null when given an invalid URL string", () => {
    expect(getCleanPostUrl("not a url")).toBeNull();
    expect(getCleanPostUrl("example.com")).toBeNull();
    expect(getCleanPostUrl("://invalid")).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanPostUrl(null)).toBeNull();
    expect(getCleanPostUrl(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanPostUrl(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanPostUrl(true)).toBeNull();
    expect(getCleanPostUrl(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanPostUrl({})).toBeNull();
    expect(getCleanPostUrl([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanPostUrl("")).toBeNull();
  });
});

