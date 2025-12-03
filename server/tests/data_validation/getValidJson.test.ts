import { getValidJson } from "@src/data_validation/getValidJson";

describe("getValidJson", () => {
  it("should return valid JSON unchanged", () => {
    const validJson = '{"name": "test", "value": 123}';
    const result = getValidJson(validJson);
    expect(result).toBe(validJson);
  });

  it("should add missing closing brace", () => {
    const invalidJson = '{"name": "test"';
    const result = getValidJson(invalidJson);
    expect(result).toBe('{"name": "test"}');
  });

  it("should add missing closing bracket", () => {
    const invalidJson = '["item1", "item2"';
    const result = getValidJson(invalidJson);
    expect(result).toBe('["item1", "item2"]');
  });

  it("should add multiple missing closing braces", () => {
    const invalidJson = '{"level1": {"level2": {"level3": "value"';
    const result = getValidJson(invalidJson);
    expect(result).toBe('{"level1": {"level2": {"level3": "value"}}}');
  });

  it("should add multiple missing closing brackets", () => {
    const invalidJson = '[[["nested"';
    const result = getValidJson(invalidJson);
    expect(result).toBe('[[["nested"]]]');
  });

  it("should handle mixed braces and brackets", () => {
    const invalidJson = '{"items": [{"id": 1}';
    const result = getValidJson(invalidJson);
    expect(result).toBe('{"items": [{"id": 1}]}');
  });

  it("should trim whitespace", () => {
    const invalidJson = '  {"name": "test"  ';
    const result = getValidJson(invalidJson);
    expect(result).toBe('{"name": "test"}');
  });

  it("should handle empty string", () => {
    const result = getValidJson("");
    expect(result).toBe("");
  });

  it("should handle string with only whitespace", () => {
    const result = getValidJson("   ");
    expect(result).toBe("");
  });
});
