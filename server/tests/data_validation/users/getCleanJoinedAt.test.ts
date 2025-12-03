import { getCleanJoinedAt } from "@src/data_validation/users/getCleanJoinedAt";

describe("getCleanJoinedAt", () => {
  it("should return ISO string when given a valid date string", () => {
    const dateString = "2024-01-15T10:30:00Z";
    const result = getCleanJoinedAt(dateString);
    expect(result).toBe(new Date(dateString).toISOString());
  });

  it("should return ISO string when given a valid date number (timestamp)", () => {
    const timestamp = 1705312200000; // Jan 15, 2024
    const result = getCleanJoinedAt(timestamp);
    expect(result).toBe(new Date(timestamp).toISOString());
  });

  it("should return null when given an invalid date string", () => {
    expect(getCleanJoinedAt("not a date")).toBeNull();
    expect(getCleanJoinedAt("2024-13-45")).toBeNull();
  });

  it("should return null when given an invalid date number", () => {
    expect(getCleanJoinedAt(NaN)).toBeNull();
  });

  it("should return null when given null or undefined", () => {
    expect(getCleanJoinedAt(null)).toBeNull();
    expect(getCleanJoinedAt(undefined)).toBeNull();
  });

  it("should return null when given a boolean", () => {
    expect(getCleanJoinedAt(true)).toBeNull();
    expect(getCleanJoinedAt(false)).toBeNull();
  });

  it("should return null when given an object or array", () => {
    expect(getCleanJoinedAt({})).toBeNull();
    expect(getCleanJoinedAt([])).toBeNull();
  });

  it("should return null when given empty string", () => {
    expect(getCleanJoinedAt("")).toBeNull();
  });

  it("should handle various date formats", () => {
    const formats = [
      "2024-01-15",
      "2024-01-15T10:30:00",
      "2024-01-15T10:30:00Z",
      "2024-01-15T10:30:00.000Z",
    ];

    formats.forEach((format) => {
      const result = getCleanJoinedAt(format);
      expect(result).toBe(new Date(format).toISOString());
    });
  });
});
