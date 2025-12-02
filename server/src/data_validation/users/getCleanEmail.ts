export const getCleanEmail = (email: unknown): string | null => {
    if (typeof email !== 'string') return null;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return email;
    }
    return null;
};