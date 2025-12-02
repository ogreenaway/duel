export const getCleanComments = (comments: unknown): number | null => {
  if (
    typeof comments === "number" &&
    Number.isInteger(comments) &&
    comments >= 0
  ) {
    return comments;
  }
  return null;
};
