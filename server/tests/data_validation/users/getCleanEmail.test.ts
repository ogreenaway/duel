import { getCleanEmail } from "@src/data_validation/users/getCleanEmail";

describe("getCleanEmail", () => {
  it("should return valid email when given a valid email", () => {
    expect(getCleanEmail("test@example.com")).toBe("test@example.com");
    expect(getCleanEmail("user.name@domain.co.uk")).toBe(
      "user.name@domain.co.uk",
    );
    expect(getCleanEmail("user+tag@example.com")).toBe("user+tag@example.com");
  });

  it("should return null when given an invalid email format", () => {
    expect(getCleanEmail("notanemail")).toBeNull();
    expect(getCleanEmail("@example.com")).toBeNull();
    expect(getCleanEmail("test@")).toBeNull();
    expect(getCleanEmail("test@example")).toBeNull();
    expect(getCleanEmail("test example.com")).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanEmail(null)).toBeNull();
    expect(getCleanEmail(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanEmail(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanEmail(true)).toBeNull();
    expect(getCleanEmail(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanEmail({})).toBeNull();
    expect(getCleanEmail([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanEmail("")).toBeNull();
  });
});
