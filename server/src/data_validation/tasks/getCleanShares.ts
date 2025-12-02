export const getCleanShares = (shares: unknown): number | null => {
    if (typeof shares === 'number' && Number.isInteger(shares) && shares >= 0) {
        return shares;
    }
    return null;
};