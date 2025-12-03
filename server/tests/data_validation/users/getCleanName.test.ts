import { getCleanName } from "@src/data_validation/users/getCleanName";

describe("getCleanName", () => {
  it("should return valid name when given a name with letters only", () => {
    expect(getCleanName("John")).toBe("John");
    expect(getCleanName("Mary")).toBe("Mary");
  });

  it("should return valid name when given a name with spaces", () => {
    expect(getCleanName("John Smith")).toBe("John Smith");
    expect(getCleanName("Mary Jane Watson")).toBe("Mary Jane Watson");
  });

  it("should return valid name when given a name with apostrophes", () => {
    expect(getCleanName("O'Brien")).toBe("O'Brien");
    expect(getCleanName("Mary O'Connor")).toBe("Mary O'Connor");
  });

  it("should return null when given a name with numbers", () => {
    expect(getCleanName("John123")).toBeNull();
    expect(getCleanName("John 2")).toBeNull();
  });

  it("should return null when given a name with special characters", () => {
    expect(getCleanName("John-Smith")).toBeNull();
    expect(getCleanName("John@Smith")).toBeNull();
    expect(getCleanName("John.Smith")).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanName(null)).toBeNull();
    expect(getCleanName(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanName(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanName(true)).toBeNull();
    expect(getCleanName(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanName({})).toBeNull();
    expect(getCleanName([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanName("")).toBeNull();
  });
});

