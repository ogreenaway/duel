export const getCleanTiktokHandle = (handle: unknown): string | null => {
  if (typeof handle !== "string") return null;

  if (handle.length > 24) return null;

  // Allowable characters: a-z A-Z 0-9 _ .
  const validCharsRegex = /^[a-zA-Z0-9_.]+$/;
  if (!validCharsRegex.test(handle)) return null;

  // Periods cannot be at the end of the username
  if (handle.endsWith(".")) return null;

  return handle;
};
