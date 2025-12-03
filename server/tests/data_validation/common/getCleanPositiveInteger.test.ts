import { getCleanPositiveInteger } from "@src/data_validation/common/getCleanPositiveInteger";

describe("getCleanPositiveInteger", () => {
  it("should return number when given a valid non-negative integer", () => {
    expect(getCleanPositiveInteger(0)).toBe(0);
    expect(getCleanPositiveInteger(1)).toBe(1);
    expect(getCleanPositiveInteger(100)).toBe(100);
    expect(getCleanPositiveInteger(999999)).toBe(999999);
  });

  it("should return null when given a negative number", () => {
    expect(getCleanPositiveInteger(-1)).toBeNull();
    expect(getCleanPositiveInteger(-100)).toBeNull();
  });

  it("should return null when given a float", () => {
    expect(getCleanPositiveInteger(1.5)).toBeNull();
    expect(getCleanPositiveInteger(100.99)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanPositiveInteger(null)).toBeNull();
    expect(getCleanPositiveInteger(undefined)).toBeNull();
  });

  it("should return null when given a string", () => {
    expect(getCleanPositiveInteger("100")).toBeNull();
    expect(getCleanPositiveInteger("0")).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanPositiveInteger(true)).toBeNull();
    expect(getCleanPositiveInteger(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanPositiveInteger({})).toBeNull();
    expect(getCleanPositiveInteger([])).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(getCleanPositiveInteger(NaN)).toBeNull();
  });
});
