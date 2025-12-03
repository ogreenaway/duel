import { getCleanTiktokHandle } from "@src/data_validation/users/getCleanTiktokHandle";

describe("getCleanTiktokHandle", () => {
  it("should return valid handle when given a valid TikTok handle", () => {
    expect(getCleanTiktokHandle("username")).toBe("username");
    expect(getCleanTiktokHandle("user_name")).toBe("user_name");
    expect(getCleanTiktokHandle("user.name")).toBe("user.name");
    expect(getCleanTiktokHandle("user123")).toBe("user123");
    expect(getCleanTiktokHandle("@Declan35")).toBe("@Declan35");
  });

  it("should return null when handle is longer than 24 characters", () => {
    const longHandle = "a".repeat(25);
    expect(getCleanTiktokHandle(longHandle)).toBeNull();
  });

  it("should return valid handle when handle is exactly 24 characters", () => {
    const handle = "a".repeat(24);
    expect(getCleanTiktokHandle(handle)).toBe(handle);
  });

  it("should return null when handle contains invalid characters", () => {
    expect(getCleanTiktokHandle("user-name")).toBeNull(); // hyphen not allowed
    expect(getCleanTiktokHandle("user@name")).toBeNull(); // email not allowed
    expect(getCleanTiktokHandle("user name")).toBeNull(); // space not allowed
  });

  it("should return null when handle ends with a period", () => {
    expect(getCleanTiktokHandle("username.")).toBeNull();
  });

  it("should return valid handle when handle starts with a period", () => {
    expect(getCleanTiktokHandle(".username")).toBe(".username");
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanTiktokHandle(null)).toBeNull();
    expect(getCleanTiktokHandle(undefined)).toBeNull();
  });

  it("should return null when given a number", () => {
    expect(getCleanTiktokHandle(123)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanTiktokHandle(true)).toBeNull();
    expect(getCleanTiktokHandle(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanTiktokHandle({})).toBeNull();
    expect(getCleanTiktokHandle([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanTiktokHandle("")).toBeNull();
  });
});
