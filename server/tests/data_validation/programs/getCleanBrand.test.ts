import { getCleanBrand } from "@src/data_validation/programs/getCleanBrand";

describe("getCleanBrand", () => {
  it('should return "hello world" string when given "hello world"', () => {
    const result = getCleanBrand("hello world");
    expect(result).toBe("hello world");
  });

  it("should return null when given an empty string", () => {
    const result = getCleanBrand("");
    expect(result).toBeNull();
  });

  it("should return null when given a number", () => {
    const result = getCleanBrand(12345);
    expect(result).toBeNull();
  });

  it("should return null when given a string with only spaces", () => {
    const result = getCleanBrand("   ");
    expect(result).toBeNull();
  });
});
