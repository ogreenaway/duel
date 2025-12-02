export const getCleanName = (name: unknown): string | null => {
    if (typeof name !== 'string') return null;
    
    // Only contains spaces, letters, and apostrophes
    const nameRegex = /^[a-zA-Z\s']+$/;
    if (nameRegex.test(name)) {
        return name;
    }
    return null;
};