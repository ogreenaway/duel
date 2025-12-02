export const getCleanLikes = (likes: unknown): number | null => {
  if (typeof likes === "number" && Number.isInteger(likes) && likes >= 0) {
    return likes;
  }
  return null;
};
