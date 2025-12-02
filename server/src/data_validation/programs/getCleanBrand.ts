export const getCleanBrand = (brand: unknown): string | null => {
  if (typeof brand === "string" && brand.trim().length > 0) {
    return brand;
  }
  return null;
};
