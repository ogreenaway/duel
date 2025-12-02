import { randomUUID } from 'crypto';

export const getCleanUserId = (userId: unknown): string => {
    if (typeof userId === 'string' && userId.trim().length > 0) {
        return userId;
    }
    return randomUUID();
};