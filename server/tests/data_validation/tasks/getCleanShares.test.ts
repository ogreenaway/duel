import { getCleanShares } from "@src/data_validation/tasks/getCleanShares";

describe("getCleanShares", () => {
  it("should return number when given a valid non-negative integer", () => {
    expect(getCleanShares(0)).toBe(0);
    expect(getCleanShares(1)).toBe(1);
    expect(getCleanShares(100)).toBe(100);
    expect(getCleanShares(999999)).toBe(999999);
  });

  it("should return null when given a negative number", () => {
    expect(getCleanShares(-1)).toBeNull();
    expect(getCleanShares(-100)).toBeNull();
  });

  it("should return null when given a float", () => {
    expect(getCleanShares(1.5)).toBeNull();
    expect(getCleanShares(100.99)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanShares(null)).toBeNull();
    expect(getCleanShares(undefined)).toBeNull();
  });

  it("should return null when given a string", () => {
    expect(getCleanShares("100")).toBeNull();
    expect(getCleanShares("0")).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanShares(true)).toBeNull();
    expect(getCleanShares(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanShares({})).toBeNull();
    expect(getCleanShares([])).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(getCleanShares(NaN)).toBeNull();
  });
});

