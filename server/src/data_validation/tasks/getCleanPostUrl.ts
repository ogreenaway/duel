export const getCleanPostUrl = (url: unknown): string | null => {
    if (typeof url !== 'string') return null;
    try {
        new URL(url);
        return url;
    } catch {
        return null;
    }
};