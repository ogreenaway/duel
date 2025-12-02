export const getCleanTotalSalesAttributed = (sales: unknown): number | null => {
  if (typeof sales === "number" && !isNaN(sales)) {
    return sales;
  }
  if (typeof sales === "string") {
    const parsed = parseFloat(sales);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};
