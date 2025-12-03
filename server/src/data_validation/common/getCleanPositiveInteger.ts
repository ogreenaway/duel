export const getCleanPositiveInteger = (integer: unknown): number | null => {
  if (
    typeof integer === "number" &&
    Number.isInteger(integer) &&
    integer >= 0
  ) {
    return integer;
  }
  return null;
};
