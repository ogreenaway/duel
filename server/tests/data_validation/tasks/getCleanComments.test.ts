import { getCleanComments } from "@src/data_validation/tasks/getCleanComments";

describe("getCleanComments", () => {
  it("should return number when given a valid non-negative integer", () => {
    expect(getCleanComments(0)).toBe(0);
    expect(getCleanComments(1)).toBe(1);
    expect(getCleanComments(100)).toBe(100);
    expect(getCleanComments(999999)).toBe(999999);
  });

  it("should return null when given a negative number", () => {
    expect(getCleanComments(-1)).toBeNull();
    expect(getCleanComments(-100)).toBeNull();
  });

  it("should return null when given a float", () => {
    expect(getCleanComments(1.5)).toBeNull();
    expect(getCleanComments(100.99)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanComments(null)).toBeNull();
    expect(getCleanComments(undefined)).toBeNull();
  });

  it("should return null when given a string", () => {
    expect(getCleanComments("100")).toBeNull();
    expect(getCleanComments("0")).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanComments(true)).toBeNull();
    expect(getCleanComments(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanComments({})).toBeNull();
    expect(getCleanComments([])).toBeNull();
  });

  it("should return null when given NaN", () => {
    expect(getCleanComments(NaN)).toBeNull();
  });
});
