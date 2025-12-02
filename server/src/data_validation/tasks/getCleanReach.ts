export const getCleanReach = (reach: unknown): number | null => {
    if (typeof reach === 'number' && Number.isInteger(reach) && reach >= 0) {
        return reach;
    }
    return null;
};