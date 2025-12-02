export const getCleanJoinedAt = (date: unknown): string | null => {
  if (
    typeof date === "string" ||
    typeof date === "number" ||
    date instanceof Date
  ) {
    const parsedDate = new Date(date as string | number | Date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    }
  }
  return null;
};
