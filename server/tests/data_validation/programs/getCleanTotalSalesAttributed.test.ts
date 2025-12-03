import { getCleanTotalSalesAttributed } from "@src/data_validation/programs/getCleanTotalSalesAttributed";

describe("getCleanTotalSalesAttributed", () => {
  it("should return number when given a valid number", () => {
    expect(getCleanTotalSalesAttributed(123.45)).toBe(123.45);
    expect(getCleanTotalSalesAttributed(0)).toBe(0);
    expect(getCleanTotalSalesAttributed(-100)).toBe(-100);
  });

  it("should return parsed number when given a valid numeric string", () => {
    expect(getCleanTotalSalesAttributed("123.45")).toBe(123.45);
    expect(getCleanTotalSalesAttributed("0")).toBe(0);
    expect(getCleanTotalSalesAttributed("-100")).toBe(-100);
  });

  it("should return null when given NaN", () => {
    expect(getCleanTotalSalesAttributed(NaN)).toBeNull();
  });

  it("should return null when given an invalid string", () => {
    expect(getCleanTotalSalesAttributed("not a number")).toBeNull();
    expect(getCleanTotalSalesAttributed("abc123")).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanTotalSalesAttributed(null)).toBeNull();
    expect(getCleanTotalSalesAttributed(undefined)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanTotalSalesAttributed(true)).toBeNull();
    expect(getCleanTotalSalesAttributed(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanTotalSalesAttributed({})).toBeNull();
    expect(getCleanTotalSalesAttributed([])).toBeNull();
  });
});
