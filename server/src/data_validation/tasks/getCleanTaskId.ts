import { randomUUID } from 'crypto';

export const getCleanTaskId = (taskId: unknown): string => {
    if (typeof taskId === 'string' && taskId.trim().length > 0) {
        return taskId;
    }
    return randomUUID();
};