import { getCleanReach } from "@src/data_validation/tasks/getCleanReach";

describe("getCleanReach", () => {
  it("should return number when given a valid non-negative integer", () => {
    expect(getCleanReach(0)).toBe(0);
    expect(getCleanReach(1)).toBe(1);
    expect(getCleanReach(100)).toBe(100);
    expect(getCleanReach(999999)).toBe(999999);
  });

  it("should return null when given a negative number", () => {
    expect(getCleanReach(-1)).toBeNull();
    expect(getCleanReach(-100)).toBeNull();
  });

  it("should return null when given a float", () => {
    expect(getCleanReach(1.5)).toBeNull();
    expect(getCleanReach(100.99)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanReach(null)).toBeNull();
    expect(getCleanReach(undefined)).toBeNull();
  });

  it("should return null when given a string", () => {
    expect(getCleanReach("100")).toBeNull();
    expect(getCleanReach("0")).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanReach(true)).toBeNull();
    expect(getCleanReach(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanReach({})).toBeNull();
    expect(getCleanReach([])).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(getCleanReach(NaN)).toBeNull();
  });
});

