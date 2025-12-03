import { getCleanLikes } from "@src/data_validation/tasks/getCleanLikes";

describe("getCleanLikes", () => {
  it("should return number when given a valid non-negative integer", () => {
    expect(getCleanLikes(0)).toBe(0);
    expect(getCleanLikes(1)).toBe(1);
    expect(getCleanLikes(100)).toBe(100);
    expect(getCleanLikes(999999)).toBe(999999);
  });

  it("should return null when given a negative number", () => {
    expect(getCleanLikes(-1)).toBeNull();
    expect(getCleanLikes(-100)).toBeNull();
  });

  it("should return null when given a float", () => {
    expect(getCleanLikes(1.5)).toBeNull();
    expect(getCleanLikes(100.99)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanLikes(null)).toBeNull();
    expect(getCleanLikes(undefined)).toBeNull();
  });

  it("should return null when given a string", () => {
    expect(getCleanLikes("100")).toBeNull();
    expect(getCleanLikes("0")).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanLikes(true)).toBeNull();
    expect(getCleanLikes(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanLikes({})).toBeNull();
    expect(getCleanLikes([])).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(getCleanLikes(NaN)).toBeNull();
  });
});

