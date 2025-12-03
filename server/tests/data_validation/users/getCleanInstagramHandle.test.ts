import { getCleanInstagramHandle } from "@src/data_validation/users/getCleanInstagramHandle";

describe("getCleanInstagramHandle", () => {
  it("should return valid handle when given a valid Instagram handle", () => {
    expect(getCleanInstagramHandle("username")).toBe("username");
    expect(getCleanInstagramHandle("user_name")).toBe("user_name");
    expect(getCleanInstagramHandle("user.name")).toBe("user.name");
    expect(getCleanInstagramHandle("user123")).toBe("user123");
  });

  it("should return null when handle is longer than 30 characters", () => {
    const longHandle = "a".repeat(31);
    expect(getCleanInstagramHandle(longHandle)).toBeNull();
  });

  it("should return valid handle when handle is exactly 30 characters", () => {
    const handle = "a".repeat(30);
    expect(getCleanInstagramHandle(handle)).toBe(handle);
  });

  it("should return null when handle contains invalid characters", () => {
    expect(getCleanInstagramHandle("user-name")).toBeNull(); // hyphen not allowed
    expect(getCleanInstagramHandle("user@name")).toBeNull(); // email not allowed
    expect(getCleanInstagramHandle("user name")).toBeNull(); // space not allowed
  });

  it("should return null when handle contains only numbers", () => {
    expect(getCleanInstagramHandle("12345")).toBeNull();
    expect(getCleanInstagramHandle("0")).toBeNull();
  });

  it("should return null when handle starts with a period", () => {
    expect(getCleanInstagramHandle(".username")).toBeNull();
  });

  it("should return null when handle ends with a period", () => {
    expect(getCleanInstagramHandle("username.")).toBeNull();
  });

  it("should return null when handle contains consecutive periods", () => {
    expect(getCleanInstagramHandle("user..name")).toBeNull();
  });

  it("should return null when handle contains only periods and underscores", () => {
    expect(getCleanInstagramHandle("...")).toBeNull();
    expect(getCleanInstagramHandle("___")).toBeNull();
    expect(getCleanInstagramHandle("._.")).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanInstagramHandle(null)).toBeNull();
    expect(getCleanInstagramHandle(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanInstagramHandle(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanInstagramHandle(true)).toBeNull();
    expect(getCleanInstagramHandle(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanInstagramHandle({})).toBeNull();
    expect(getCleanInstagramHandle([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanInstagramHandle("")).toBeNull();
  });
});
