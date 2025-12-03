export const getCleanInstagramHandle = (handle: unknown): string | null => {
  if (typeof handle !== "string") return null;

  if (handle.length > 30) return null;

  // Allowable characters: a-z A-Z 0-9 _ . -
  const validCharsRegex = /^[a-zA-Z0-9_.-]+$/;
  if (handle.startsWith("@")) {
    if (!validCharsRegex.test(handle.slice(1))) return null;
  } else {
    if (!validCharsRegex.test(handle)) return null;
  }

  // Cannot have only numbers
  if (/^[0-9]+$/.test(handle)) return null;

  // No "." starting or ending a username
  if (handle.startsWith(".") || handle.endsWith(".")) return null;

  // No two "." in sequence
  if (handle.includes("..")) return null;

  // Cannot have only "." and "_" combinations
  if (/^[._]+$/.test(handle)) return null;

  return handle;
};
