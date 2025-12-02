/**
 * Attempts to fix malformed JSON by adding missing closing brackets
 */
export function getValidJson(jsonString: string): string {
  // Count opening and closing braces and brackets
  let braceCount = 0;
  let bracketCount = 0;
  
  for (const char of jsonString) {
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;
  }
  
  let fixed = jsonString.trim();
  
  // Add missing closing brackets
  while (bracketCount > 0) {
    fixed += ']';
    bracketCount--;
  }
  
  // Add missing closing braces
  while (braceCount > 0) {
    fixed += '}';
    braceCount--;
  }
  
  return fixed;
}
